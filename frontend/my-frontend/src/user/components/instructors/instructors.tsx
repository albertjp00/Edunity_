import React, { useEffect, useState } from "react";
import { getUserInstructors } from "../../services/instructorServices";
import "./instructors.css";
import type { IInstructor } from "../../interfaces";


const Instructors: React.FC = () => {
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const res = await getUserInstructors();
      if (res?.data.success) {
        setInstructors(res.data.instructors);
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <section className="instructors-section">
      {/* Left Side - Text */}
      <div className="instructors-intro">
        <p className="subtitle">OUR INSTRUCTORS</p>
        <h2 className="title">Meet Our Expert Instructor</h2>
        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris.
        </p>
        <button className="contact-btn">Contact Us →</button>
      </div>

      {/* Right Side - Instructor Grid */}
      <div className="instructors-grid">
        {loading ? (
          <p>Loading instructors...</p>
        ) : instructors.length === 0 ? (
          <p>No instructors found.</p>
        ) : (
          instructors.map((instructor, index) => (
            <div key={index} className="instructor-card">
              <div className="instructor-img-wrapper">
                <img
                  src={`${import.meta.env.VITE_API_URL}/assets/${instructor.profileImage}`}
                  alt={instructor.name}
                  className="instructor-img"
                />
              </div>
              <div className="instructor-info">
                <h3 className="instructor-name">{instructor.name}</h3>
                <p className="instructor-role">
                  {instructor.expertise || "Junior Instructor"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Instructors;
