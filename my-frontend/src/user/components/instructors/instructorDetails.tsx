import { CheckCircle, Mail, Briefcase, GraduationCap, Code } from "lucide-react";
import "./instructorDetails.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserInstructorsDetails } from "../../services/instructorServices";

interface Instructor {
  _id: string;
  name: string;
  email: string;
  expertise: string;
  bio: string;
  profileImage: string;
  KYCApproved: boolean;
  KYCstatus: string;
  work: string;
  education: string;
  blocked: boolean;
  skills: string[];
}

const InstructorDetailsUser = () => {
    const {id} = useParams()
    const [instructor , setInstructor]  = useState<Instructor | null >(null) 

    const getDetails = async()=>{
        try {
            if(!id ) return
            const res = await getUserInstructorsDetails(id)
            console.log(res);
            
            if(res.data.success){
                setInstructor(res.data.instructor)
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=>{
        getDetails()
    },[])

    if (!instructor) {
  return <div>Loading...</div>;
}
  return (
    <div className="instructor-card">
      <div className="instructor-header" />

      <div className="instructor-body">
        <div className="instructor-avatar-wrapper">
          <div className="instructor-image">
            <img src={`${import.meta.env.VITE_API_URL}/assets/${instructor.profileImage}`}></img>
          </div>
        </div>

        <div className="instructor-name-section">
          <div className="instructor-name-row">
            <h1 className="instructor-name">{instructor.name}</h1>
            {instructor.KYCApproved && (
              <CheckCircle className="instructor-verified-icon" />
            )}
          </div>
          <p className="instructor-expertise">{instructor.expertise}</p>
        </div>

        <p className="instructor-bio">{instructor.bio}</p>

        <div className="instructor-info-list">
          <div className="instructor-info-row">
            <span className="instructor-info-icon"><Mail /></span>
            <div>
              <p className="instructor-info-label">Email</p>
              <p className="instructor-info-value">{instructor.email}</p>
            </div>
          </div>
          <div className="instructor-info-row">
            <span className="instructor-info-icon"><Briefcase /></span>
            <div>
              <p className="instructor-info-label">Experience</p>
              <p className="instructor-info-value">{instructor.work}</p>
            </div>
          </div>
          <div className="instructor-info-row">
            <span className="instructor-info-icon"><GraduationCap /></span>
            <div>
              <p className="instructor-info-label">Education</p>
              <p className="instructor-info-value">{instructor.education}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="instructor-skills-header">
            <Code />
            <span className="instructor-skills-title">Skills</span>
          </div>
          <div className="instructor-skills-list">
            {instructor.skills.map((skill) => (
              <span key={skill} className="instructor-skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetailsUser;
