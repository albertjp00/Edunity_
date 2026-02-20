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
    <div className="edit-container">
      <form className="edit-course-form" onSubmit={handleSubmit}>
        <h2>Edit Course</h2>

        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={(e) => {
            setForm({ ...form, category: e.target.value, skills: [] });
          }}
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Skills</label>
        <div className="skills-checkbox-group">
          {skills.map((s) => (
            <label key={s} className="skill-checkbox">
              <input
                type="checkbox"
                value={s}
                checked={form.skills.includes(s)}
                onChange={handleSkillChange}
              />
              {s}
            </label>
          ))}
        </div>

        <label>Level</label>
        <select name="level" value={form.level} onChange={handleChange} required>
          <option value="">-- Select Level --</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <label>Price</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
        />

        <label>Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files &&
            setForm({ ...form, thumbnail: e.target.files[0] })
          }
        />

        <h3>Modules</h3>
        {form.modules.map((mod, i) => (
  <div key={i} className="module-card">
    <input
      placeholder="Module title"
      value={mod.title}
      onChange={(e) => updateModule(i, "title", e.target.value)}
    />

    <textarea
      placeholder="Module content"
      value={mod.content}
      onChange={(e) => updateModule(i, "content", e.target.value)}
    />


    <div className="videofile">
      <input
      type="file"
      accept="video/*"
      onChange={(e) => {
        if (e.target.files) {
          updateModule(i, "videoFile", e.target.files[0]);
        }
      }}
    />
    <p className="filename">File Name - {mod.videoUrl && mod.videoUrl.split("/").pop()?.split("?")[0]}</p>
    </div>

    <button type="button" onClick={() => removeModule(i)}>
      Remove
    </button>
  </div>
))}


        <button type="button" onClick={addModule}>
          + Add Module
        </button>

        <button className="add-course-btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
