import React, { useEffect, useRef, useState } from "react";
import api from "../../../api/userApi";

interface VideoPlayerProps {
  initialUrl: string;
  onComplete?: ()=> void
}

const VideoPlayerUser: React.FC<VideoPlayerProps> = ({ initialUrl , onComplete }) => {
  const [videoUrl, setVideoUrl] = useState(initialUrl);
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);

  const handleVideoEnd = () => {
    if (onComplete) onComplete(); // only mark progress when video ends
  };

  useEffect(() => {
    const key = videoUrl.split(".amazonaws.com/")[1];

    // Auto-refresh before expiry (e.g., after 55 minutes)
    refreshTimer.current = setTimeout(async () => {
      try {
        const res = await api.get(`/user/refresh?key=${key}`);
        if (res.data.success) {
          setVideoUrl(res.data.url);
          console.log("🔄 Video URL refreshed successfully!");
        }
      } catch (err) {
        console.error("❌ Failed to refresh video URL:", err);
      }
    }, 55 * 60 * 1000); // refresh after 55 min

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current); 
    }; 
  }, [videoUrl]);

  return (
    <video
      width="100%"
      height="auto"
      controls
      style={{ marginTop: "10px" }}
      src={videoUrl}
      onEnded={handleVideoEnd}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayerUser;
