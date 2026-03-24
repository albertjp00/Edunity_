import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import profilePic from "../../../assets/profilePic.png";
import thumbnail from "../../../assets/webinar_thumnail.png";
import "./userEventDetails.css";
import { eventEnroll, getDetailsEvent } from "../../services/eventServices";
import { toast } from "react-toastify";
import type { Ievent } from "../../../instructor/interterfaces/events";
import { getUserProfile } from "../../services/profileServices";

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Ievent | null>(null);
  // const [instructor, setInstructor] = useState<string>();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [user, setUser] = useState<string>();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      const res = await getDetailsEvent(id);
      console.log(res);

      if (!res) return;

      if (res.data.success) {
        setEvent(res.data.event);
        // setInstructor(res.data.instructor);
        setIsEnrolled(res.data.enrolled);
        console.log(res);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    const getUser = async () => {
      const res = await getUserProfile();
      if (!res) return;
      setUser(res.data.data.name);
    };
    getUser();
  }, []);

  //Check if user can join based on current time
  const canJoin = useMemo(() => {
    if (!event) return false;

    const now = new Date();

    const eventDate = new Date(event.date);

    const [hours, minutes] = event.time.split(":").map(Number);

    const eventDateTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      hours,
      minutes,
      0,
      0,
    );

    return now >= eventDateTime;
  }, [event]);

  const handleEnroll = async () => {
    try {
      if (!id) return;
      const res = await eventEnroll(id);
      toast.success(res?.data.message || "Enrolled!");
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling in event:", error);
      toast.error("Failed to enroll. Try again.");
    }
  };

  const handleJoinEvent = () => {
    if (!event) return;
    // navigate(`/user/joinEvent/${event._id}`, {
    //   state: { name: user },
    // });

    navigate(`/user/groupEvent/${event.roomId}`, {
      state: { name: user },
    });
  };

  if (!event) return <p>Loading...</p>;

  return (
  <div className="min-h-screen bg-slate-50 py-12 px-6">
    <div className="max-w-4xl mx-auto">
      {/* MAIN EVENT CARD */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100">
        
        {/* HERO IMAGE SECTION */}
        <div className="relative h-[400px] w-full">
          <img 
            src={thumbnail} 
            alt="Event Thumbnail" 
            className="w-full h-full object-cover" 
          />
          {/* OVERLAY GRADIENT FOR READABILITY */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                {event.isLive ? "● Live Now" : event.isOver ? "Finished" : "Upcoming Event"}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest">
                🌐 Online Experience
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-10 md:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* LEFT: DETAILS */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">About the Event</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {event.description || "Join us for an exclusive session where we dive deep into the core concepts of this topic with industry experts."}
                </p>
              </div>

              <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl">📅</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Event Date</p>
                    <p className="font-bold text-slate-800">{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-xl">⏱</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Start Time</p>
                    <p className="font-bold text-slate-800">{event.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: ACTION BOX */}
            <div className="bg-slate-50 rounded-[2rem] p-8 flex flex-col justify-center border border-slate-100 shadow-inner">
              <div className="text-center space-y-6">
                {!event.isOver ? (
                  !isEnrolled ? (
                    <>
                      <div className="text-slate-500 text-sm font-medium px-4">
                        Secure your spot to get access to the live link and materials.
                      </div>
                      <button 
                        onClick={handleEnroll} 
                        className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
                      >
                        Enroll Now
                      </button>
                    </>
                  ) : event.isLive && canJoin ? (
                    <>
                      <div className="flex flex-col items-center">
                        <span className="relative flex h-3 w-3 mb-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <p className="text-red-600 font-bold text-sm uppercase tracking-widest">Event is Live</p>
                      </div>
                      <button 
                        onClick={handleJoinEvent} 
                        className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95"
                      >
                        Join Live Event
                      </button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-4xl">⏳</div>
                      <p className="text-slate-700 font-bold leading-tight">
                        Waiting for instructor to start the event...
                      </p>
                      <p className="text-slate-400 text-xs">The join button will appear once the session begins.</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-4 py-4">
                    <div className="text-4xl">❌</div>
                    <p className="text-red-500 font-black uppercase tracking-widest text-sm">
                      This event has ended.
                    </p>
                    <button className="text-slate-400 font-bold text-xs hover:underline">View Recording</button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Back Button */}
      <button 
        onClick={() => window.history.back()} 
        className="mt-8 text-slate-400 font-bold text-sm hover:text-slate-900 transition-colors flex items-center gap-2"
      >
        ← Back to all events
      </button>
    </div>
  </div>
);
};

export default EventDetails;
