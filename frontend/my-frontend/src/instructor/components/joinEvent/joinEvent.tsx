import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface RemoteStream {
  id: string;
  stream: MediaStream;
}

interface VideoCallProps {
  eventId: string;
  userId: string;
  isInstructor: boolean;
}

const socket: Socket = io(import.meta.env.VITE_API_URL);

const VideoCall: React.FC<VideoCallProps> = ({ eventId, userId, isInstructor }) => {
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  useEffect(() => {
    let localStream: MediaStream;

    const init = async () => {
      // 🎥 Get user media
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideo.current) {
        localVideo.current.srcObject = localStream;
      }

      // 🔌 Join event room
      socket.emit("joinEvent", { eventId, userId });

      // 🟢 New user joined → Instructor sends them an offer
      socket.on("user-joined", async ({ userId: newUser }: { userId: string }) => {
        if (isInstructor) {
          const pc = createPeerConnection(newUser);
          localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { eventId, offer, from: userId, to: newUser });
        }
      });

      // 🔹 Receive an offer
      socket.on("offer", async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
        const pc = createPeerConnection(from);
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { eventId, answer, from: userId, to: from });
      });

      // 🔹 Receive an answer
      socket.on("answer", async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
        const pc = peerConnections.current[from];
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      // 🔹 Receive ICE candidates
      socket.on("ice-candidate", async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
        const pc = peerConnections.current[from];
        if (pc) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding ICE candidate", err);
          }
        }
      });
    };

    init();

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [eventId, userId, isInstructor]);

  // Helper: Create PeerConnection for each participant
  const createPeerConnection = (peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          eventId,
          candidate: event.candidate,
          from: userId,
          to: peerId,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => [
        ...prev.filter((s) => s.id !== peerId),
        { id: peerId, stream: event.streams[0] },
      ]);
    };

    peerConnections.current[peerId] = pc;
    return pc;
  };

  return (
    <div>
      <h2>{isInstructor ? "Instructor" : "Student"} Video Call</h2>
      <video ref={localVideo} autoPlay playsInline muted className="w-1/3" />
      <div>
        {remoteStreams.map((user) => (
          <video
            key={user.id}
            autoPlay
            playsInline
            className="w-1/3"
            ref={(video) => {
              if (video) video.srcObject = user.stream;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCall;
