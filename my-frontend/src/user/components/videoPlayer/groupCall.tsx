  import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useEffect, useRef } from 'react';
  import { useParams } from "react-router-dom";

  function randomID(len = 5) {
    let result = '';
    const chars =
      '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';

    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  //  function getUrlParams(url = window.location.href) {
  //   const urlStr = url.split('?')[1] || '';
  //   return new URLSearchParams(urlStr);
  // }




export default function GroupCall() {
  const { roomId } = useParams();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !roomId) return;

    const appID = Number(import.meta.env.VITE_APP_ID);
    const serverSecret = import.meta.env.VITE_SERVER_SECRET;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      randomID(5),
      "User"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: containerRef.current,
      sharedLinks: [
        {
          name: "Invite Link",
          url: `${window.location.origin}/groupEvent/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
    });
  }, [roomId]);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}
