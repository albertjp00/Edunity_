import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";
import instructorApi from "../../../api/instructorApi";
import "./addCourse.css";

interface Module {
  title: string;
  videoUrl: string;
  content: string;
}

interface CourseForm {
  title: string;
  description: string;
  skills: string[];
  price: string;
  thumbnail: File | null;
  level: string;
  modules: Module[];
  category: string
}

const AddCourse: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CourseForm>({
    title: "",
    description: "",
    skills: [],
    price: "",
    thumbnail: null,
    level: "Beginner",
    modules: [],
    category: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addModule = () => {
    setForm({
      ...form,
      modules: [...form.modules, { title: "", videoUrl: "", content: "" }],
    });
  };



  const handleSkillChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setForm({ ...form, skills: [...form.skills, value] });
    } else {
      setForm({ ...form, skills: form.skills.filter((skill) => skill !== value) });
    }
  };

  const validateForm = () => {
    if (!form.title.trim() || !form.description.trim() || !form.price) {
      toast.error("Please fill all course details.");
      return false;
    }

    for (let i = 0; i < form.modules.length; i++) {
      const module = form.modules[i];
      if (!module.title.trim() || !module.videoUrl.trim()) {
        toast.error(`Module ${i + 1} must have a title and video URL.`);
        return false;
      }
    }
    return true;
  };


  const updateModule = (index: number, field: keyof Module, value: string) => {
    const updatedModules = [...form.modules];
    updatedModules[index][field] = value;
    setForm({ ...form, modules: updatedModules });
  };

  const checkUrlExists = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
    const videoFileRegex = /\.(mp4|webm|ogg)$/i;

    return youtubeRegex.test(url) || vimeoRegex.test(url) || videoFileRegex.test(url);
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic form validation
    if (!form.title.trim() || !form.description.trim() || !form.price) {
      toast.error("Please fill all course details.");
      return;
    }

    // Validate modules only at submission
    for (let i = 0; i < form.modules.length; i++) {
      const mod = form.modules[i];
      if (!mod.title.trim() || !mod.videoUrl.trim()) {
        toast.error(`Module ${i + 1} must have a title and video URL.`);
        return;
      }
      if (!checkUrlExists(mod.videoUrl)) {
        toast.error(`Module ${i + 1} has an invalid video URL.`);
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("skills", JSON.stringify(form.skills));
      formData.append("price", form.price);
      formData.append("level", form.level);
      formData.append("category", form.category);

      if (form.thumbnail) {
        formData.append("thumbnail", form.thumbnail);
      }

      formData.append("modules", JSON.stringify(form.modules));

      const token = localStorage.getItem("instructor");

      const res = await instructorApi.post("/instructor/course", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      if (res.data.success) {
        toast.success("Course added");
        navigate("/instructor/home");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding course");
    }
  };


  return (
    <div className="addCourse">
      <form className="add-course-form" onSubmit={handleSubmit}>
        <h2>Add New Course</h2>

        <label>Course Title</label>
        <input name="title" placeholder="Course Title" onChange={handleChange} />

        <label>Description</label>
        <textarea name="description" placeholder="Course Description" onChange={handleChange}></textarea>

        <label>Skills</label>
        <div className="skills-checkbox-group">
          {["React", "HTML", "CSS", "JavaScript", "Node.js"].map((skill) => (
            <label key={skill} className="skill-checkbox">
              <input
                type="checkbox"
                value={skill}
                checked={form.skills.includes(skill)}
                onChange={handleSkillChange}
              />
              {skill}
            </label>
          ))}
        </div>

        {form.skills.length > 0 && (
          <div className="selected-skills">
            <p>
              <strong>Selected Skills:</strong>
            </p>
            <ul>
              {form.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        <label htmlFor="select-level">Course Level</label>
        <select
          className="select-level"
          name="level"
          value={form.level}
          onChange={handleChange}
          required
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <label htmlFor="select-category">Category</label>
        <select
          className="select-category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="Web Development">Web Development</option>
          <option value="Mobile Development">Mobile Development</option>
          <option value="Data Science">Data science</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="Design">Design</option>
          <option value="Language">Language</option>
        </select>


        <br />
        <label>Price</label>
        <input name="price" placeholder="Price" type="number" onChange={handleChange} />

        <label>Thumbnail</label>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, thumbnail: e.target.files ? e.target.files[0] : null })
          }
        />

        <hr />

        <h3>Modules</h3>
        {form.modules.map((module, index) => (
          <div key={index} className="module-card">
            <input
              type="text"
              placeholder="Module Title"
              value={module.title}
              onChange={(e) => updateModule(index, "title", e.target.value)}
            />
            <input
              type="text"
              placeholder="Video URL"
              value={module.videoUrl}
              onChange={(e) => updateModule(index, "videoUrl", e.target.value)}
            />
            <textarea
              placeholder="Module Content"
              value={module.content}
              onChange={(e) => updateModule(index, "content", e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={addModule}>
          + Add Module
        </button>

        <br />
        <br />
        <button className="add-course-btn" type="submit">
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
