import "./category.css";

const categories = [
  { name: "Web Development", color: "lightblue", icon: "📊" },
  { name: "Mobile Development", color: "lightpink", icon: "🎨" },
  { name: "Data Science", color: "lightgreen", icon: "🌱" },
  { name: "UI/UX Design", color: "lightgoldenrodyellow", icon: "🖌️" },
  { name: "Graphic Design", color: "lavender", icon: "🖼️" },
  { name: "Digital Marketing", color: "mistyrose", icon: "📢" },
  { name: "Cyber Security", color: "whitesmoke", icon: "⭐" },
  { name: "Product Design", color: "peachpuff", icon: "📦" },
  { name: "Language", color: "aliceblue", icon: "🎥" },
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
