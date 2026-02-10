import "./banner.css";
import { useNavigate } from "react-router-dom";

const Banner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="hero">
      <div className="hero__bg" role="img" aria-label="Students learning together" />

      <div className="hero__overlay" />

      <div className="hero__content">
        <span className="hero__eyebrow">Start Learning Today</span>
        <h1 className="hero__title">
          Learn <span className="accent">Skills</span> for the Future
        </h1>
        <p className="hero__subtitle">
          Join thousands of learners improving their careers with industry-ready courses.
        </p>

        <div className="hero__cta">
          {/* <button className="btn btn--primary" onClick={() => navigate("/register")}>
            Get Started
          </button> */}
          <button className="btn btn--ghost" onClick={() => navigate("/user/allCourses")}>
            Explore Courses
          </button>
        </div>

        {/* quick stats (optional) */}
        <ul className="hero__stats">
          <li><strong>500+</strong><span>Courses</span></li>
          <li><strong>20k+</strong><span>Students</span></li>
          <li><strong>4.8/5</strong><span>Avg. Rating</span></li>
        </ul>
      </div>
    </header>
  );
};

export default Banner;
