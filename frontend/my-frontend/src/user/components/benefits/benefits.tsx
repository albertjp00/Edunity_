import React from "react";
import "./Benefits.css";

const benefitsData = [
  {
    id: "01",
    title: "Flexible Learning Schedule",
    description:
      "Fit your coursework around your existing commitments and obligations.",
  },
  {
    id: "02",
    title: "Expert Instruction",
    description:
      "Learn from industry experts who have hands-on experience in design and development.",
  },
  {
    id: "03",
    title: "Diverse Course Offerings",
    description:
      "Explore a wide range of design and development courses covering various topics.",
  },
  {
    id: "04",
    title: "Updated Curriculum",
    description:
      "Access courses with up-to-date content reflecting the latest trends and industry practices.",
  },

  {
    id: "06",
    title: "Interactive Learning Environment",
    description:
      "Collaborate with fellow learners, exchanging ideas and feedback to enhance your understanding.",
  },
];

const Benefits = () => {
  return (
    <section className="benefits">
      <div className="benefits-header">
        <h2>Benefits</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur. Tempus tincidunt etiam eget
          elit id imperdiet et. Cras eu sit dignissim lorem nibh et. Ac cum eget
          habitasse in velit fringilla feugiat senectus in.
        </p>
        <button className="view-all-btn">View All</button>
      </div>

      <div className="benefits-grid">
        {benefitsData.map((benefit) => (
          <div key={benefit.id} className="benefit-card">
            <span className="benefit-id">{benefit.id}</span>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
            <div className="arrow">↗</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
