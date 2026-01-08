import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import MeetingRoom from "../../../eventMeeting/meetingRoom";
import { toast } from "react-toastify";
import { eventJoin } from "../../services/eventServices";
import { getUserProfile } from "../../services/profileServices";

const UserEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>(""); 
  // const [userName , setUsername] = useState<string>("")

  const location = useLocation()
    const { name } = location.state || {};
    console.log('name',name);
    

  // Replace with your auth/store logic
  // const userId = "instructor_1";

  useEffect(() => {
    const joinEvent = async () => {
      if (!eventId) return;
      try {
        const res = await eventJoin(eventId)
        if(!res) return
        console.log(res);
        setUserId(res.data.userId)
        
        if (res.data.result.success) {
          setMeetingLink(res.data.result.meetingLink || eventId); 
        } else {
          toast.error(res.data.message || "Failed to join event");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error joining event");
      } finally {
        setLoading(false);
      }
    };

    joinEvent();

    const userInfo = async ()=>{
      try {
        const userDetails  = await getUserProfile()
        console.log(userDetails);
        // setUsername( userDetails.data.user.name)
        
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
      userId={userId}
      role="user"
      name={name}
   
    />
  );
};

export default UserEvent;
