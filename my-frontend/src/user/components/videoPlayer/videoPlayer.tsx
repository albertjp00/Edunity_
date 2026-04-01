import { useEffect, useRef, useState } from "react";
import { refreshKey } from "../../services/courseServices";

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

    console.log('url ---',initialUrl);
    
    
    const keyWithParams = videoUrl.split(".amazonaws.com/")[1];
  const key = keyWithParams.split("?")[0];

    const scheduleRefresh = async () => {
      console.log("⏱️ Triggering refresh...");
      try {
        const res = await refreshKey(key)
        if(!res) return
        if (res.data?.success && res.data?.url) {
          setVideoUrl(res.data.url);
          console.log("🔄 Video URL refreshed!");
        }
      } catch (err) {
        console.error("❌ Refresh failed:", err);
      }

      // schedule next refresh
      refreshTimer.current = setTimeout(scheduleRefresh, 10 * 60 * 1000);
    };

    // start countdown
    refreshTimer.current = setTimeout(scheduleRefresh, 10 * 60 *  1000);

    return () => {
      console.log("🧹 Unmounted, clearing timer");
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
