import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./courseDetail.css";
import Navbar from "../navbar/navbar";
import api from "../../../api/userApi";


interface Module {
    title: string;
    videoUrl: string;
    content: string;
}

interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    level: string;
    thumbnail: string;
    skills: string[];
    modules: Module[];
}

interface Instructor {
    name: string;
    profileImage: string;
    bio?: string;
    expertise?: string;
}

interface ApiResponse {
  success: boolean;
  course: Course & {
    instructor: Instructor;
    hasAccess: boolean;
    completedModules?: string[];
  };
}

const CourseDetailsUser: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [hasAccess, setHasAccess] = useState<boolean>(false);
    const [instructor, setInstructor] = useState<Instructor | null>(null);
    const [completedModules, setCompletedModules] = useState<string[]>([]);

    const navigate = useNavigate();

    const fetchCourse = async () => {
        try {

            const res = await api.get(
                `/user/courseDetails?id=${id}`,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setCourse(res.data.course);
            setInstructor(res.data.course.instructor);
            setHasAccess(res.data.course.hasAccess);
            setCompletedModules(res.data.course.completedModules || []);
        } catch (err) {
            console.error("Error fetching course:", err);
        }
    };

    const handlePurchase = async () => {
        const userId = localStorage.getItem("token");
        if (!userId || !id) return;

        const formData = new FormData();
        formData.append("user", userId);
        formData.append("course", id);

        try {
            const res = await api.get(`/user/buyCourse/${id}`
            );

            if (res.data.success) {
                navigate("/user/myCourses");
            }
        } catch (err) {
            console.error("Error during purchase:", err);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, []);

    if (!course) return <p>Loading...</p>;

    return (
        <div className="course-navbar">

            <div className="course-detail-page">
                <h2>{course.title}</h2>

                {course.thumbnail && (
                    <img
                        src={`http://localhost:5000/assets/${course.thumbnail}`}
                        alt="Course Thumbnail"
                        className="detail-thumbnail"
                    />
                )}

                <p>
                    <strong>Description:</strong> {course.description}
                </p>

                {instructor && (
                    <div className="instructor-info">
                        <img
                            src={`http://localhost:5000/assets/${instructor.profileImage}`}
                            alt={instructor.name}
                            className="instructor-image"
                        />

                        <div className="instructor-details">
                            <p className="instructor-name">
                                <strong>Instructor:</strong> {instructor.name}
                            </p>
                        </div>
                    </div>
                )}

                <div className="course-highlights">
                    <div className="highlight-row">
                        <div className="highlight-item">
                            <p>🧑‍🎓 <strong>Beginner level</strong></p>
                            <span>No prior experience required</span>
                        </div>
                        <div className="highlight-item">
                            <p>⏱️ <strong>Estimated Time</strong></p>
                            <span>12 hours</span>
                        </div>
                        <div className="highlight-item">
                            <p>🎯 <strong>Learn at your own pace</strong></p>
                        </div>
                    </div>
                </div>

                {!hasAccess && (
                    <div className="purchase-section">
                        <p>
                            <strong>Price:</strong> ₹{course.price}
                        </p>
                        <button onClick={handlePurchase} className="buy-button">
                            Buy Course
                        </button>
                    </div>
                )}

                <div className="skills-box">
                    <p className="skills-title">Skills you'll gain</p>
                    <div className="skills-list">
                        {course.skills.map((skill, index) => (
                            <button key={index} className="skill-button">
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="modules">
                    <h3>Modules:</h3>
                    {course.modules.map((module, idx) => (
                        <div key={idx} className="module">
                            <details>
                                <summary className="module-title">
                                    📘 {module.title || `Module ${idx + 1}`}
                                </summary>
                            </details>
                        </div>
                    ))}
                </div>

                {instructor && (
                    <div className="instructor-details-centered">
                        <img
                            src={`http://localhost:5000/assets/${instructor.profileImage}`}
                            alt={instructor.name}
                            className="instructor-image-centered"
                        />
                        <h3 className="instructor-name">{instructor.name}</h3>

                        <p className="instructor-bio">{instructor.bio || "No bio available."}</p>
                        <p className="instructor-expertise">
                            <strong>Expertise:</strong> {instructor.expertise || "Not specified"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetailsUser;
