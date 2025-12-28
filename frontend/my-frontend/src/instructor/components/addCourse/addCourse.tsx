import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./addCourse.css";
import { addCourse, getCategory } from "../../services/Instructor/instructorServices";
import type { ICategory } from "../../../admin/adminInterfaces";
import type { addCourseModule, CourseForm } from "../../interterfaces/instructorInterfaces";



const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [categories , setCategories] = useState<ICategory[]>([])
  const [skills , setSkills ] = useState<string[]>([])
  const [subscription , setSubscription] = useState<boolean>(false)

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
    <div className="addCourse">
      <form className="add-course-form" onSubmit={handleSubmit}>
        <h2>Add New Course</h2>

        <label>Course Title</label>
        <input className="title-name" name="title" placeholder="Course Title" onChange={handleChange} />

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Course Description"
          onChange={handleChange}
        ></textarea>


        <label htmlFor="select-category">Category</label>
        <select
          className="select-category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {categories.map((c)=>(
            <option value={c.name}>{c.name}</option>
          ))}
        </select>

        <label>Skills</label>
        <div className="skills-checkbox-group">
          {skills.map((skill) => (
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

        <label htmlFor="select-level">Course Level</label>
        <select
          className="select-level"
          name="level"
          value={form.level}
          onChange={handleChange}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        

        <label>Course Access Type</label>
        <div className="access-type-group">
          <label className="access-radio">
            <input
              type="radio"
              name="accessType"
              value="subscription"
              checked={form.accessType === "subscription"}
              onChange={handleChange}
            />
            Subscription 
          </label>

          <label className="access-radio">
            <input
              type="radio"
              name="accessType"
              value="oneTime"
              checked={form.accessType === "oneTime"}
              onChange={handleChange}
            />
            One-Time Purchase
          </label>

          
        </div>


        {subscription && 
        <>
          <label>Price</label>
        <input
          name="price"
          placeholder="Price"
          type="number"
          onChange={handleChange}
        />
        </>
        }

        <label>Thumbnail</label>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm({
              ...form,
              thumbnail: e.target.files ? e.target.files[0] : null,
            })
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
            <textarea
              placeholder="Module Content"
              value={module.content}
              onChange={(e) => updateModule(index, "content", e.target.value)}
            />
            <label>Upload Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateModule(
                  index,
                  "video",
                  e.target.files ? e.target.files[0] : null
                )
              }
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
