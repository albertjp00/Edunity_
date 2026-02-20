import  { useEffect, useState } from "react";
import {addCategory,deleteCategory,fetchCategory,} from "../../services/adminServices";
import type { ICategory } from "../../adminInterfaces";
import "./category.css";
import { toast } from "react-toastify";

const Category = () => {
  const [categoryName, setCategoryName] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error ,setError] = useState<string | null>(null)

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await fetchCategory();
        console.log(res);
        
        setCategories(res.data.category);
      } catch (error) {
        console.log(error);
      }
    };

    getCategory();
  }, []);

  const handleAddSkill = () => {
    if (!skillName.trim()) return setError('Type a skill')

    setSkills((prev) => [...prev, skillName]);
    setSkillName("");
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim())
      return toast.error("Category name required");
    if (skills.length === 0)
      
      return toast.error("Add at least one skill");

    try {
      
      const res = await addCategory(categoryName, skills);

      if(!res.data.success){
          toast.error('Category already exists')
          return
        }
      
      if (res.data.success) {
        
        setCategories((prev) => [...prev, res.data.category]);
        setSkills((prev)=>[...prev , res.data.skills])
        setCategoryName("");
        setSkills([]); 
        toast.success('Category Added')
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (name: string) => {
    try {
      await deleteCategory(name);
      setCategories((prev) => prev.filter((c) => c.name !== name));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="category-container">
      <label>Add Category</label>
      <div className="category-input-box">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category name"
        />
      </div>

      <label>Add Skills</label>
      <div className="category-input-box">
        <input
          type="text"
          value={skillName}
          onChange={(e) => {
            setSkillName(e.target.value)
          setError('')
        } }
          placeholder="Skill name"
        />
        
        <button onClick={handleAddSkill}>Add Skill</button>
        
      </div>
      <br />
      {error && <p className="error-text">{error}</p>}

      {/* Show skills before saving */}
      <ul>
        {skills.map((skill, i) => (
          <li key={i}>{skill}</li>
        ))}
      </ul>

<br />
      <button onClick={handleAddCategory}>Save Category</button>

      {/* Show categories with skills */}
      <div className="category-list">
        <h4>All Categories</h4>
        <ul>
          {categories.map((cat) => (
            <li key={cat._id} className="category-item">
              <strong>{cat.name}</strong>
              <ul>
                {cat.skills.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
              <span onClick={() => handleDelete(cat.name!)}>X</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
