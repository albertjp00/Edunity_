import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MeetingRoom from "../../../eventMeeting/meetingRoom";
import instructorApi from "../../../api/instructorApi";

const InstructorEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);

  // Replace with your auth/store logic
  const instructorId = "instructor_1";

  useEffect(() => {
    const joinEvent = async () => {
      if (!eventId) return;
      try {
        const { data } = await instructorApi.patch(`/instructor/joinEvent/${eventId}`);
        if (data.success) {
          setMeetingLink(data.meetingLink || eventId); // fallback to eventId
        } else {
          alert(data.message || "Failed to join event");
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
      userId={instructorId}
      role="instructor"
    />
  );
};

export default InstructorEvent;
