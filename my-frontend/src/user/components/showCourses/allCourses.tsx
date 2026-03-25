import  { useEffect, useState } from "react";
import "./allCourses.css";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../admin/components/debounce/debounce";
import type { Course } from "../../interfaces";
import { allCourses } from "../../services/courseServices";



const AllCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const coursesPerPage = 6; // backend limit

  // ✅ filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInstructors] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>(""); 

  const navigate = useNavigate();

  const fetchCourses = async (page: number = 1 , searchQuery:string) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: coursesPerPage.toString(),
      });

      if (selectedCategories.length > 0) {
        queryParams.append("categories", selectedCategories.join(","));
      }
      if (selectedInstructors.length > 0) {
        queryParams.append("instructors", selectedInstructors.join(","));
      }
      if (selectedPrice) {
        queryParams.append("price", selectedPrice);
      }
      if (selectedLevel) {
        queryParams.append("level", selectedLevel);
      }
      if (sortBy) {
        queryParams.append("sortBy", sortBy);
      }
      if (searchQuery.trim() !== "") {        
        queryParams.append("search", searchQuery.trim());
      }

      

      const response = await allCourses(queryParams.toString())
      // console.log("response",response);
      if(!response) return
      setCourses(response.data.courses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  setCurrentPage(1);
  fetchCourses(1,searchQuery);
};

  const gotoCourse = (id: string): void => {
    navigate(`/user/courseDetails/${id}`);
  };

  
  const debouncedSearchTerm = useDebounce(searchQuery,500)

  useEffect(() => {
    fetchCourses(currentPage,debouncedSearchTerm);
  }, [
    currentPage,
    debouncedSearchTerm,
    selectedCategories,
    selectedInstructors,
    selectedPrice,
    selectedLevel,
    sortBy,
    // searchQuery,
  ]);



  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (price: string) => {
    setSelectedPrice((prev) => (prev === price ? "" : price));
    setCurrentPage(1);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel((prev) => (prev === level ? "" : level));
    setCurrentPage(1);
  };

return (
  <div className="min-h-screen bg-slate-50">
    {/* Banner Section */}
    <div className="bg-slate-900 py-8 px-6 text-center"> {/* Smaller padding */}
      <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">
        ALL COURSES
      </h1>
      <p className="text-slate-400 text-xs font-medium">
        Home / <span className="text-indigo-400">Instructor</span>
      </p>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side - Courses Content */}
        <div className="flex-1 order-2 lg:order-1">
          
          {/* Search Bar - More Compact */}
          <form 
            className="flex gap-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search courses..."
              className="flex-1 px-3 py-1.5 text-sm outline-none text-slate-600 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
              🔍 
            </button>
          </form>

          <h2 className="text-xl font-black text-slate-800 mb-4">All Courses</h2>

          {/* Course Grid - Smaller Cards via 3 columns on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course._id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col">
                
                {/* Thumbnail - Reduced Height */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[9px] font-bold uppercase text-slate-900 shadow-sm">
                    {course.category || 'Web-development'}
                  </span>
                </div>

                <div className="p-3 flex flex-col flex-1"> {/* Reduced padding from p-5 to p-3 */}
                  <span className="text-indigo-600 font-black text-base mb-1">₹{course.price}</span>

                  <h3 className="text-sm font-bold text-slate-900 mb-3 line-clamp-2 leading-snug h-10">
                    {course.title}
                  </h3>

                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold mb-4">
                    <span>📚 10</span>
                    <span>⏰ 6h</span>
                    <span>👨‍🎓 20+</span>
                  </div>

                  <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/assets/${course.instructorImage}`}
                        alt="instructor"
                        className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-100"
                      />
                      <span className="text-[10px] font-bold text-slate-600 truncate max-w-[70px]">
                        {course.instructorName}
                      </span>
                    </div>
                    <button
                      className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md hover:bg-indigo-600 transition-colors"
                      onClick={() => gotoCourse(course._id)}
                    >
                      Enroll →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - Scaled Down */}
          <div className="flex justify-center items-center gap-1.5 mt-10">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white disabled:opacity-50 text-xs"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  currentPage === i + 1 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white disabled:opacity-50 text-xs"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Right Side - Filters (Sidebar Scaled Down) */}
        <aside className="w-full lg:w-60 order-1 lg:order-2">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 border-b pb-1">Category</h3>
              <ul className="space-y-2">
                {["Web Development", "Mobile Development", "Data Science", "Cyber Security", "Design", "Language"].map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                      />
                      <span className="text-xs font-medium text-slate-600">{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 border-b pb-1">Sort By Price</h3>
              <ul className="space-y-2">
                {[
                  { label: "None", value: "" },
                  { label: "Low to High", value: "priceLowToHigh" },
                  { label: "High to Low", value: "priceHighToLow" }
                ].map((opt) => (
                  <li key={opt.value}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sortPrice"
                        className="w-3.5 h-3.5 border-slate-300 text-indigo-600"
                        checked={sortBy === opt.value}
                        onChange={() => setSortBy(opt.value)}
                      />
                      <span className="text-xs font-medium text-slate-600">{opt.label}</span>
                    </label>
                  </li>
                ))}
              </ul>

              {/* Price & Level Filter logic follows same pattern... */}
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mt-5 mb-3 border-b pb-1">Price</h3>
              <ul className="space-y-2">
                {["Free", "Paid"].map((p) => (
                  <li key={p}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPrice === p.toLowerCase()}
                        onChange={() => handlePriceChange(p.toLowerCase())}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600"
                      />
                      <span className="text-xs font-medium text-slate-600">{p}</span>
                    </label>
                  </li>
                ))}
              </ul>

              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mt-5 mb-3 border-b pb-1">Level</h3>
              <ul className="space-y-2">
                {["Beginner", "Intermediate", "Expert"].map((lvl) => (
                  <li key={lvl}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLevel === lvl}
                        onChange={() => handleLevelChange(lvl)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600"
                      />
                      <span className="text-xs font-medium text-slate-600">{lvl}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>
);
};

export default AllCourses;
