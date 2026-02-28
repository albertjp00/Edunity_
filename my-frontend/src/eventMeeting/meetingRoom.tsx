// MeetingRoom.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./meetingRoom.css";

const SOCKET_URL = import.meta.env.VITE_API_URL;
const socket = io(SOCKET_URL, { autoConnect: true });

interface MeetingRoomProps {
  eventId: string;
  userId: string;
  role: "instructor" | "user";
  name: string;
}

interface RemoteUser {
  socketId: string;
  stream: MediaStream;
  micOn: boolean;
  camOn: boolean;
  userId?: string;
  name?: string;
}

interface Participant {
  socketId: string;
  userId: string;
  name: string;
  role?: "instructor" | "user"; // optional if you send role too
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({
  eventId,
  userId,
  role,
  name,
}) => {
  const navigate = useNavigate();


  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcMap = useRef<Record<string, RTCPeerConnection>>({});
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const upsertRemoteUser = (
    update: Partial<RemoteUser> & { socketId: string },
  ) => {
    setRemoteUsers((prev) => {
      const idx = prev.findIndex((p) => p.socketId === update.socketId);
      if (idx === -1) {
        return [
          ...prev,
          {
            socketId: update.socketId,
            stream: (update.stream as MediaStream) || new MediaStream(),
            micOn: update.micOn ?? true,
            camOn: update.camOn ?? true,
            userId: update.userId,
            name: update.name,
          },
        ];
      } else {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...update };
        return copy;
      }
    });
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (cancelled) {
          media.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = media;
        if (localVideoRef.current) localVideoRef.current.srcObject = media;

        socket.emit("joinEvent", { eventId, userId, role, name });

        socket.emit("update-status", { eventId, micOn: true, camOn: true });
      } catch (err) {
        console.error("Failed to getUserMedia", err);
      }
    })();

    socket.off("user-joined");
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
    socket.off("user-left");
    socket.off("status-updated");

    // When receiving participants list
    socket.on("participants", async (list: Participant[]) => {
      for (const participant of list) {
        if (participant.socketId === socket.id) continue;

        const socketId = participant.socketId;

        const pc = createPeerConnection(socketId);
        pcMap.current[socketId] = pc;

        const localStream = localStreamRef.current;

        if (localStream) {
          localStream
            .getTracks()
            .forEach((track) => pc.addTrack(track, localStream));
        }

        // ✅ CREATE OFFER
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("offer", {
          eventId,
          offer,
          from: socket.id,
          to: socketId,
        });

        upsertRemoteUser({
          socketId,
          userId: participant.userId,
          name: participant.name,
        });
      }
    });



    socket.on("user-joined", async (participant: Participant) => {
      const socketId = participant.socketId;

      const pc = createPeerConnection(socketId);
      pcMap.current[socketId] = pc;

      const localStream = localStreamRef.current;

      if (localStream) {
        localStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream));
      }

      // ✅ SEND OFFER TO NEW USER
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", {
        eventId,
        offer,
        from: socket.id,
        to: socketId,
      });

      upsertRemoteUser({
        socketId,
        userId: participant.userId,
        name: participant.name,
      });
    });



    socket.on("user-left", (participant: Participant) => {
      if (!participant) return;
      console.log(`${participant.name} left the meeting`);
      const pc = pcMap.current[participant.socketId];
      if (pc) pc.close();
      delete pcMap.current[participant.socketId];

      setRemoteUsers((prev) =>
        prev.filter((u) => u.socketId !== participant.socketId),
      );
    });

    socket.on("offer", async ({ from, offer }) => {
      console.log("offer from", from);
      const pc = createPeerConnection(from);
      pcMap.current[from] = pc;

      const localStream = localStreamRef.current;
      if (localStream)
        localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { eventId, answer, from: socket.id, to: from });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

    socket.on("answer", async ({ from, answer }) => {
      const pc = pcMap.current[from];
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.error("Error setting remote description (answer):", err);
      }
    });

    socket.on("ice-candidate", async ({ from, candidate }) => {
      const pc = pcMap.current[from];
      if (!pc || !candidate) return;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn("Failed to add ICE candidate:", err);
      }
    });

    socket.on(
      "status-updated",
      ({ socketId, micOn: rMicOn, camOn: rCamOn }) => {
        upsertRemoteUser({ socketId, micOn: rMicOn, camOn: rCamOn });
      },
    );

    return () => {
      cancelled = true;
      socket.emit("leaveEvent", { eventId, userId });
      Object.values(pcMap.current).forEach((pc) => {
        try {
          pc.close();
        } catch (error) {
          console.log(error);
        }
      });
      pcMap.current = {};
      // stop local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      // remove listeners
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      socket.off("status-updated");
    };
  }, []);



const createPeerConnection = (socketId: string) => {

  if (pcMap.current[socketId])
    return pcMap.current[socketId];

  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        eventId,
        candidate: event.candidate,
        from: socket.id,
        to: socketId,
      });
    }
  };

  pc.ontrack = (event) => {
    const stream = event.streams[0];
    if (!stream) return;

    upsertRemoteUser({
      socketId,
      stream,
    });
  };

  pcMap.current[socketId] = pc;

  return pc;
};



  const toggleMic = () => {
    const s = localStreamRef.current;
    if (!s) return;
    const enabled = !micOn;
    s.getAudioTracks().forEach((t) => (t.enabled = enabled));
    setMicOn(enabled);
    socket.emit("update-status", { eventId, micOn: enabled, camOn });
  };

  const toggleCam = () => {
    const s = localStreamRef.current;
    if (!s) return;
    const enabled = !camOn;
    s.getVideoTracks().forEach((t) => (t.enabled = enabled));
    setCamOn(enabled);
    socket.emit("update-status", { eventId, micOn, camOn: enabled });
  };

  const leaveMeeting = () => {
    Object.values(pcMap.current).forEach((pc) => pc.close());
    pcMap.current = {};
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    socket.emit("leaveEvent", { eventId, userId });
    navigate(-1);
  };

  return (
    <div className="meeting-room">
      <h2>{role === "instructor" ? "Instructor View" : "User View"}</h2>

      <div className="video-container">
        <div className="video-tile">
          <video ref={localVideoRef} autoPlay playsInline muted />
          {!micOn && <span className="mic-muted">🔇</span>}
          {!camOn && <span className="cam-off">📷❌</span>}
          <p className="video-name">{name} (You)</p>
        </div>

        {remoteUsers.map((user) => (
          <div key={user.socketId} className="video-tile">
            <video
              autoPlay
              playsInline
              ref={(el) => {
                if (!el) return;
                if (el.srcObject !== user.stream) el.srcObject = user.stream;
              }}
            />
            {!user.micOn && <span className="mic-muted">🔇</span>}
            {!user.camOn && <span className="cam-off">📷❌</span>}
            <p className="video-name">{user.name ?? user.socketId}</p>
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={toggleMic}>{micOn ? "Mute Mic" : "Unmute Mic"}</button>
        <button onClick={toggleCam}>
          {camOn ? "Turn Off Cam" : "Turn On Cam"}
        </button>
        <button className="end-event-btn" onClick={leaveMeeting}>
          Leave Meeting
        </button>
      </div>
    </div>
  );
};

export default MeetingRoom;
