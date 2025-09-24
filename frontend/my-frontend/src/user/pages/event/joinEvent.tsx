import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MeetingRoom from "../../../eventMeeting/meetingRoom";
import api from "../../../api/userApi";

const UserEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);

  // Replace with your auth/store logic
  const userId = "instructor_1";

  useEffect(() => {
    const joinEvent = async () => {
      if (!eventId) return;
      try {
        const res = await api.get(`/user/joinEvent/${eventId}`);
        console.log(res);
        
        if (res.data.success) {
          setMeetingLink(res.data.meetingLink || eventId); 
        } else {
          alert(res.data.message || "Failed to join event");
        }
      } catch (err) {
        console.error(err);
        alert("Server error joining event");
      } finally {
        setLoading(false);
      }
    };

    joinEvent();
  }, [eventId]);

  if (loading) return <p>Starting event...</p>;
  if (!meetingLink) return <p>Unable to join event.</p>;

  return (
    <MeetingRoom
      eventId={meetingLink}
      userId={userId}
      role="user"
    />
  );
};

export default UserEvent;
