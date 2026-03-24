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
  <div className="max-w-7xl mx-auto px-6 py-16">
    {/* HEADER SECTION */}
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">
        Browse By Categories
      </h2>
      
    </div>

    {/* CATEGORIES GRID */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
      {categories.map((cat, index) => (
        <div
          key={index}
          className="group relative cursor-pointer overflow-hidden rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl active:scale-95"
          style={{ 
            backgroundColor: cat.color || '#f8fafc',
            // Adding a subtle gradient overlay to make the color look premium
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)'
          }}
        >
          <div className="flex flex-col items-center text-center gap-4">
            {/* ICON CONTAINER */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 text-3xl shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              {cat.icon}
            </div>

            {/* CATEGORY NAME */}
            <span className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {cat.name}
            </span>
          </div>

          {/* SUBTLE GLOW EFFECT ON HOVER */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
        </div>
      ))}
    </div>
  </div>

  );
};

export default Categories;
