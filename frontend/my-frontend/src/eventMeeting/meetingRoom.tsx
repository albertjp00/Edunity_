import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./meetingRoom.css";

const socket = io("http://localhost:5000");

interface MeetingRoomProps {
  eventId: string;
  userId: string;
  role: "instructor" | "user";
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ eventId, userId, role }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pc = new RTCPeerConnection();
  const navigate = useNavigate();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    // ✅ Get local stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      });

    // ✅ Remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // ✅ ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          eventId,
          candidate: event.candidate,
        });
      }
    };

    // ✅ Join room
    socket.emit("join-room", { eventId, userId });

    socket.on("user-joined", async ({ socketId }) => {
      if (role === "instructor") {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("offer", {
          eventId,
          offer,
          to: socketId,
        });
      }
    });

    socket.on("offer", async ({ offer, from }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", {
        eventId,
        answer,
        to: from,
      });
    });

    socket.on("answer", async ({ answer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate", err);
      }
    });

    return () => {
      socket.emit("leave-room", { eventId, userId });
      pc.close();
    };
  }, []);

  // ✅ Toggle Mic
  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => (track.enabled = !micOn));
      setMicOn(!micOn);
    }
  };

  // ✅ Toggle Camera
  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => (track.enabled = !camOn));
      setCamOn(!camOn);
    }
  };

  // ✅ End Event / Leave Room
const handleEndEvent = () => {
  if (localStream) {
    localStream.getTracks().forEach(track => {
      track.stop(); // stops camera/mic
    });
  }

  // Clear video element
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = null;
  }
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = null;
  }

  socket.emit("leave-room", { eventId, userId });
  pc.close();

  // Delay navigation slightly to ensure cleanup finishes
  setTimeout(() => {
    navigate(-1);
  }, 300);
};


  return (
    <div className="meeting-room">
      <h2>{role === "instructor" ? "Instructor View" : "User View"}</h2>

      <div className="video-container">
        <video ref={localVideoRef} autoPlay playsInline muted />
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>

      {/* ✅ Controls */}
      <div className="controls">
        <button onClick={toggleMic}>
          {micOn ? "Mute Mic" : "Unmute Mic"}
        </button>
        <button onClick={toggleCam}>
          {camOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
        <button className="end-event-btn" onClick={handleEndEvent}>
          Leave Event
        </button>
      </div>
    </div>
  );
};

export default MeetingRoom;
