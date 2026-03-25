import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./addCourse.css";
import { addCourse, getCategory } from "../../services/instructorServices";
import type { ICategory } from "../../../admin/adminInterfaces";
import type { addCourseModule, CourseForm } from "../../interterfaces/instructorInterfaces";



const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [categories , setCategories] = useState<ICategory[]>([])
  const [skills , setSkills ] = useState<string[]>([])
  const [subscription , setSubscription] = useState<boolean>(true)

  const [form, setForm] = useState<CourseForm>({
    title: "",
    description: "",
    skills: [],
    price: "",
    thumbnail: null,
    level: "Beginner",
    modules: [],
    category: "",
    accessType: 'oneTime'
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if(e.target.value == 'subscription') setSubscription(false) 
    if(e.target.value == 'oneTime') setSubscription(true) 
    
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addModule = () => {
    setForm({
      ...form,
      modules: [...form.modules, { title: "", video: null, content: "" }],
    });
  };

  const updateModule = (
    index: number,
    field: keyof addCourseModule,
    value: string | File | null
  ) => {
    const updatedModules = [...form.modules];
    updatedModules[index][field] = value as never;
    setForm({ ...form, modules: updatedModules });
  };

  const handleSkillChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setForm({
      ...form,
      skills: checked
        ? [...form.skills, value]
        : form.skills.filter((skill) => skill !== value),
    });
  };

  const validateCourseForm = (form: CourseForm): boolean => {
    const MAX_TITLE_LENGTH = 30;
    const MAX_DESCRIPTION_LENGTH = 1000;
    const MAX_CONTENT_LENGTH = 2000;
    const MAX_PRICE = 1000;
    const MAX_FILE_SIZE_MB = 50;

    if (!form.title.trim()) {
      toast.error("Course title is required");
      return false;
    }
    if (form.title.length > MAX_TITLE_LENGTH) {
      toast.error(`Title should not exceed ${MAX_TITLE_LENGTH} characters`);
      return false;
    }

    if (!form.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (form.description.length > MAX_DESCRIPTION_LENGTH) {
      toast.error(`Description should not exceed ${MAX_DESCRIPTION_LENGTH} characters`);
      return false;
    }

    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      toast.error("Enter a valid price greater than 0");
      return false;
    }
    if (Number(form.price) > MAX_PRICE) {
      toast.error(`Price cannot exceed ₹${MAX_PRICE}`);
      return false;
    }

    if (!form.category.trim()) {
      toast.error("Category is required");
      return false;
    }

    if (!form.level.trim()) {
      toast.error("Level is required");
      return false;
    }

    if (!form.skills.length) {
      toast.error("At least one skill is required");
      return false;
    }

    if (form.thumbnail instanceof File) {
      if (form.thumbnail.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`Thumbnail size must be less than ${MAX_FILE_SIZE_MB}MB`);
        return false;
      }
    }

    if (!form.modules.length) {
      toast.error("Add at least one module");
      return false;
    }

    if (!form.accessType) {
      toast.error("Please select course access type");
      return false;
    }

    if (form.accessType !== "subscription") {
      if (!form.price || Number(form.price) <= 0) {
        toast.error("Enter a valid price for one-time purchase");
        return false;
      }
    }


    for (let i = 0; i < form.modules.length; i++) {
      const mod = form.modules[i];

      if (!mod.title.trim()) {
        toast.error(`Module ${i + 1} title is required`);
        return false;
      }
      if (mod.title.length > MAX_TITLE_LENGTH) {
        toast.error(`Module ${i + 1} title cannot exceed ${MAX_TITLE_LENGTH} characters`);
        return false;
      }

      if (!mod.content.trim()) {
        toast.error(`Module ${i + 1} content is required`);
        return false;
      }
      if (mod.content.length > MAX_CONTENT_LENGTH) {
        toast.error(`Module ${i + 1} content too long (max ${MAX_CONTENT_LENGTH} chars)`);
        return false;
      }

      if (mod.videoFile && mod.videoFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`Module ${i + 1} video exceeds ${MAX_FILE_SIZE_MB}MB`);
        return false;
      }
    }

    return true; // ✅ Passed all validations
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateCourseForm(form)) return;

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("skills", JSON.stringify(form.skills));
      formData.append("price", form.price);
      formData.append("level", form.level);
      formData.append("category", form.category);
      formData.append('accessType',form.accessType)


      if (form.thumbnail) {
        formData.append("thumbnail", form.thumbnail);
      }


      form.modules.forEach((module, index) => {
        formData.append(`modules[${index}][title]`, module.title);
        formData.append(`modules[${index}][content]`, module.content);
        if (module.video) {
          formData.append(`modules[${index}][video]`, module.video);
        }
      });



      const res = await addCourse(formData)
      if (!res) return
      if (res.data.success) {
        toast.success("Course added successfully!");
        navigate("/instructor/home");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding course");
    }
  };




  useEffect(() => {
      const fetchCategories = async () => {
        try {
          const res = await getCategory();
          if (!res) return;
          setCategories(res.data.category);
          setSkills(res.data.categories.skills)
        } catch (error) {
          console.log(error);
        }
      };
      fetchCategories();
    }, []);

    useEffect(() => {
  if (categories.length && !form.category) {
    setForm((prev) => ({
      ...prev,
      category: categories[0].name,
    }));
  }
}, [categories]);


    useEffect(()=>{
      if(!form.category) return

      const selectedCategory = categories.find(
        (cat)=>cat.name==form.category
      )

      setSkills(selectedCategory?.skills || [])

    },[form.category , categories])

  return (
  <div className="min-h-screen bg-slate-50 py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <form className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden" onSubmit={handleSubmit}>
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center">
          <h2 className="text-3xl font-black text-white italic tracking-tight">Add New Course</h2>
          <p className="text-slate-400 mt-2">Design your curriculum and reach students worldwide.</p>
        </div>

        <div className="p-8 space-y-10">
          
          {/* Section 1: Basic Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
              <h3 className="text-xl font-bold text-slate-800">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Course Title</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                  name="title" 
                  placeholder="e.g. Master React in 30 Days" 
                  onChange={handleChange} 
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  name="description"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="What will students learn in this course?"
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none appearance-none cursor-pointer"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Course Level</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none appearance-none cursor-pointer"
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Skills & Access */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
              <h3 className="text-xl font-bold text-slate-800">Skills & Pricing</h3>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Target Skills</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 max-h-48 overflow-y-auto">
                {skills.map((skill) => (
                  <label key={skill} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all border ${form.skills.includes(skill) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      value={skill}
                      checked={form.skills.includes(skill)}
                      onChange={handleSkillChange}
                    />
                    <span className="text-xs font-bold">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Access Type</label>
                <div className="flex gap-4">
                  {["subscription", "oneTime"].map((type) => (
                    <label key={type} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.accessType === type ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-400'}`}>
                      <input
                        type="radio"
                        className="hidden"
                        name="accessType"
                        value={type}
                        checked={form.accessType === type}
                        onChange={handleChange}
                      />
                      <span className="font-bold text-sm uppercase tracking-tight">{type === 'subscription' ? 'Subscription' : 'One-Time'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {subscription && (
                <div className="space-y-2 animate-in fade-in slide-in-from-left-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Pricing (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                      name="price"
                      type="number"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-700"
                      placeholder="0.00"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Course Thumbnail</label>
              <div className="relative group">
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.files ? e.target.files[0] : null })}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Curriculum */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">3</span>
                <h3 className="text-xl font-bold text-slate-800">Modules & Content</h3>
              </div>
              <button 
                type="button" 
                onClick={addModule}
                className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-800"
              >
                + Add Module
              </button>
            </div>

            <div className="space-y-6">
              {form.modules.map((module, index) => (
                <div key={index} className="group p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative transition-all hover:bg-white hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Module {index + 1}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Module Title"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-bold"
                    value={module.title}
                    onChange={(e) => updateModule(index, "title", e.target.value)}
                  />
                  <textarea
                    placeholder="Briefly explain what this module covers..."
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"
                    value={module.content}
                    onChange={(e) => updateModule(index, "content", e.target.value)}
                  />
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Video Lesson:</label>
                    <input
                      type="file"
                      accept="video/*"
                      className="text-xs text-slate-500 file:bg-slate-200 file:border-0 file:px-3 file:py-1 file:rounded-md file:text-[10px] file:font-bold hover:file:bg-slate-300"
                      onChange={(e) => updateModule(index, "video", e.target.files ? e.target.files[0] : null)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-10 flex justify-center">
            <button className="w-full sm:w-80 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95" type="submit">
              Launch Course
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
);
};

export default AddCourse;
