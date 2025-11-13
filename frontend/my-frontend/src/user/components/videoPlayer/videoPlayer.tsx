import React, { useEffect, useRef, useState } from "react";
import api from "../../../api/userApi";

interface VideoPlayerProps {
  initialUrl: string;
  onComplete?: () => void;
}

const VideoPlayerUser: React.FC<VideoPlayerProps> = ({ initialUrl, onComplete }) => {
  const [videoUrl, setVideoUrl] = useState(initialUrl);
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);

  const handleVideoEnd = () => {
    if (onComplete) onComplete();
  };

  useEffect(() => {
    
    const keyWithParams = videoUrl.split(".amazonaws.com/")[1];
  const key = keyWithParams.split("?")[0];

    const scheduleRefresh = async () => {
      console.log("⏱️ Triggering refresh...");
      try {
        const res = await api.get(`/user/refresh?key=${key}`);
        if (res.data?.success && res.data?.url) {
          setVideoUrl(res.data.url);
          console.log("🔄 Video URL refreshed!");
        }
      } catch (err) {
        console.error("❌ Refresh failed:", err);
      }

      // schedule next refresh
      refreshTimer.current = setTimeout(scheduleRefresh, 55 * 60 * 1000);
    };

    // start countdown
    refreshTimer.current = setTimeout(scheduleRefresh, 10000); // 10 sec test

    return () => {
      console.log("🧹 Unmounted, clearing timer");
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [initialUrl]);


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
