import React from "react";
import "./category.css";

const categories = [
  { name: "Business Management", color: "lightblue", icon: "📊" },
  { name: "Arts & Design", color: "lightpink", icon: "🎨" },
  { name: "Personal Development", color: "lightgreen", icon: "🌱" },
  { name: "UI/UX Design", color: "lightgoldenrodyellow", icon: "🖌️" },
  { name: "Graphic Design", color: "lavender", icon: "🖼️" },
  { name: "Digital Marketing", color: "mistyrose", icon: "📢" },
  { name: "Exclusive man", color: "whitesmoke", icon: "⭐" },
  { name: "Product Design", color: "peachpuff", icon: "📦" },
  { name: "Video & Photography", color: "aliceblue", icon: "🎥" },
];

const Categories = () => {
  return (
    <div className="categories-section">
      <h2 className="categories-title">Browse By Categories</h2>
      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="category-card"
            style={{ backgroundColor: cat.color }}
          >
            <span className="category-icon">{cat.icon}</span>
            <span className="category-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
