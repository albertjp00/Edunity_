import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import MeetingRoom from "../../../eventMeeting/meetingRoom";
import instructorApi from "../../../api/instructorApi";

const InstructorEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [instructorId, setInstructor] = useState<string>("");
  // const [name , setName] = useState<string>("")


   const location = useLocation();
  const { instructorName } = location.state || {};

  useEffect(() => {
    const joinEvent = async () => {
      if (!eventId) return;
      try {
        const { data } = await instructorApi.patch(`/instructor/joinEvent/${eventId}`);
        if (data.success) {
          setMeetingLink(data.meetingLink || eventId); 
          console.log('dadaaadadad',data);
          
        } else {
          alert(data.message || "Failed to join event");
        }
        setInstructor(data.instructorId)
      } catch (err) {
        console.error(err);
        alert("Server error joining event");
      } finally {
        setLoading(false);
      }
    };

    joinEvent();

    const userInfo = async ()=>{
      try {
   
        
        const userDetails  = await instructorApi.get('/instructor/profile')
        // setName( userDetails.data.user.name)
                console.log('details',userDetails);

      } catch (error) {
        console.log(error);
        
      }
    }
    userInfo()
  }, [eventId]);

  if (loading) return <p>Starting event...</p>;
  if (!meetingLink) return <p>Unable to join event.</p>;

  return (
    <MeetingRoom
      eventId={meetingLink}
      userId={instructorId}
      role="instructor"
      name = {instructorName}
      
    />
  );
};

export default InstructorEvent;
