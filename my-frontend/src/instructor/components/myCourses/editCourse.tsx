import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./editCourse.css";

import {
  editCourse,
  getCategory,
  getCourseDetails,
} from "../../services/instructorServices";

import type { ICategory } from "../../../admin/adminInterfaces";

/* ===================== TYPES ===================== */

interface Module {
  title: string;
  videoFile?: File;
  videoUrl?: string;
  content: string;
}

interface CourseForm {
  title: string;
  description: string;
  skills: string[];
  price: string;
  thumbnail: File | string;
  level: string;
  modules: Module[];
  category: string;
}

/* ===================== COMPONENT ===================== */

const EditCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const [form, setForm] = useState<CourseForm>({
    title: "",
    description: "",
    skills: [],
    price: "",
    thumbnail: "",
    level: "",
    modules: [],
    category: "",
  });

  /* ===================== FETCH CATEGORIES ===================== */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory();
        if (!res) return;
        setCategories(res.data.category);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  /* ===================== FETCH COURSE ===================== */

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) return;
        const res = await getCourseDetails(id);
        if (!res?.data?.success) return;
        console.log(res);
        

        const course = res.data.course;

        setForm({
          title: course.title || "",
          description: course.description || "",
          skills: Array.isArray(course.skills) ? course.skills : [],
          price: course.price ? String(course.price) : "",
          thumbnail: course.thumbnail || "",
          level: course.level || "",
          category: course.category || "",
          modules: course.modules?.map((m: { title: string; videoUrl: string; content: string; }) => ({
            title: m.title || "",
            videoUrl: m.videoUrl || "",
            content: m.content || "",
          })) || [],
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourse();
  }, [id]);

  /* ===================== UPDATE SKILLS ON CATEGORY CHANGE ===================== */

  useEffect(() => {
    if (!form.category || !categories.length) return;

    const selectedCategory = categories.find(
      (cat) => cat.name === form.category
    );

    setSkills(selectedCategory?.skills || []);
  }, [form.category, categories]);

  /* ===================== HANDLERS ===================== */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      skills: checked
        ? [...prev.skills, value]
        : prev.skills.filter((skill) => skill !== value),
    }));
  };

  const addModule = () => {
    setForm((prev) => ({
      ...prev,
      modules: [...prev.modules, { title: "", content: "" }],
    }));
  };

  const removeModule = (index: number) => {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const updateModule = (index: number, field: keyof Module, value: string | File) => {
        const modules = [...form.modules];
        if (field === "videoFile") {
            modules[index].videoFile = value as File;
        } else {
            modules[index][field] = value as string;
        }
        setForm({ ...form, modules });
    };

  /* ===================== SUBMIT ===================== */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!id) return;

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("level", form.level);
      formData.append("category", form.category);
      formData.append("skills", JSON.stringify(form.skills));

      if (form.thumbnail instanceof File) {
        formData.append("thumbnail", form.thumbnail);
      }

      form.modules.forEach((mod, i) => {
  formData.append(`modules[${i}][title]`, mod.title);
  formData.append(`modules[${i}][content]`, mod.content);

  if (mod.videoUrl) {
    formData.append(`modules[${i}][videoUrl]`, mod.videoUrl);
  }

  if (mod.videoFile) {
    formData.append(`modules[${i}][video]`, mod.videoFile);
  }
});


      const res = await editCourse(id, formData);
      if (res?.data?.success) {
        toast.success("Course updated successfully");
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update course");
    }
  };


return (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Form Header */}
      <div className="bg-slate-900 px-8 py-6">
        <h2 className="text-2xl font-bold text-white">Edit Course</h2>
        <p className="text-slate-400 text-sm">Update your course details and curriculum</p>
      </div>

      <form className="p-8 space-y-8" onSubmit={handleSubmit}>
        
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="e.g. Master React in 30 Days"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value, skills: [] })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
            <select 
              name="level" 
              value={form.level} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            >
              <option value="">-- Select Level --</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setForm({ ...form, thumbnail: e.target.files[0] })}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Skills Selection */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <label className="block text-sm font-bold text-gray-800 mb-4">Skills you'll gain</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map((s) => (
              <label key={s} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="checkbox"
                  value={s}
                  checked={form.skills.includes(s)}
                  onChange={handleSkillChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Modules Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-xl font-bold text-gray-900">Course Curriculum</h3>
            <button 
              type="button" 
              onClick={addModule}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              + Add New Module
            </button>
          </div>

          <div className="space-y-4">
            {form.modules.map((mod, i) => (
              <div key={i} className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-blue-300 transition-all">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Module {i + 1}</span>
                    <button 
                      type="button" 
                      onClick={() => removeModule(i)}
                      className="text-xs text-red-500 font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <input
                    placeholder="Module Title"
                    value={mod.title}
                    onChange={(e) => updateModule(i, "title", e.target.value)}
                    className="text-lg font-bold text-gray-800 focus:outline-none border-b border-transparent focus:border-blue-500 pb-1"
                  />

                  <textarea
                    placeholder="Describe what students will learn in this module..."
                    value={mod.content}
                    onChange={(e) => updateModule(i, "content", e.target.value)}
                    className="text-sm text-gray-600 bg-gray-50/50 p-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                  />

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Video Lesson</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => e.target.files && updateModule(i, "videoFile", e.target.files[0])}
                        className="block w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
                      />
                    </div>
                    {mod.videoUrl && (
                      <p className="text-[10px] text-blue-500 font-medium truncate max-w-[150px]">
                        Current: {mod.videoUrl.split("/").pop()?.split("?")[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 border-t border-gray-100 flex items-center justify-end gap-4">
          <button 
            type="button" 
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default EditCourse;
