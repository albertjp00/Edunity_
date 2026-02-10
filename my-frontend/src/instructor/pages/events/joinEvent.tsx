import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import MeetingRoom from "../../../eventMeeting/meetingRoom";
import { toast } from "react-toastify";
import { eventJoin } from "../../services/eventsServices";

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
        const res = await eventJoin(eventId)
        if(!res) return
        if (res.data.success) {
          setMeetingLink(res.data.meetingLink || eventId); 
          console.log('dadaaadadad',res.data);
          
        } else {
          toast.error("Failed to join event")
        }
        setInstructor(res.data.instructorId)
      } catch (err) {
        console.error(err);
        // alert("Server error joining event");
        toast.error("Server error joining event")
      } finally {
        setLoading(false);
      }
    };

    joinEvent();

    // const userInfo = async ()=>{
    //   try {
   
        
    //     const userDetails  = await instructorApi.get('/instructor/profile')
        

    //   } catch (error) {
    //     console.log(error);
        
    //   }
    // }
    // userInfo()
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
