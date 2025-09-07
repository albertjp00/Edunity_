import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import instructorApi from '../../../api/instructorApi';
import './editCourse.css';

// Interfaces
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
    thumbnail: File | string;
    level: string;
    modules: Module[];
    category: string
}

interface ApiResponse<T> {
    success: boolean;
    course: T;
}

// Component
const EditCourse: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState<CourseForm>({
        title: '',
        description: '',
        skills: [],
        price: '',
        thumbnail: '',
        level: '',
        modules: [],
        category: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addModule = () => {
        setForm({
            ...form,
            modules: [...form.modules, { title: '', videoUrl: '', content: '' }],
        });
    };

    const removeModule = (indexToRemove: number) => {
        const updatedModules = form.modules.filter((_, index) => index !== indexToRemove);
        setForm({ ...form, modules: updatedModules });
    };




    const handleSkillChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;

        if (checked) {
            setForm({ ...form, skills: [...form.skills, value] });
        } else {
            setForm({ ...form, skills: form.skills.filter((skill) => skill !== value) });
        }
    };

    const updateModule = (index: number, field: keyof Module, value: string) => {
        const modules = [...form.modules];
        modules[index][field] = value;
        setForm({ ...form, modules });
    };

    const checkUrlExists = async (url: string): Promise<boolean> => {
        try {
            // Quick regex for YouTube / Vimeo / direct video links
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
            const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
            const videoFileRegex = /\.(mp4|webm|ogg)$/i;

            if (youtubeRegex.test(url) || vimeoRegex.test(url) || videoFileRegex.test(url)) {
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    };



    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        

        for (let mod of form.modules) {
            if (mod.videoUrl.trim()) {
                const exists = await checkUrlExists(mod.videoUrl);
                if (!exists) {
                    toast.error(`Video URL "${mod.videoUrl}" is invalid or not reachable.`);
                    return;
                }
            }
        }

        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('skills', JSON.stringify(form.skills));
            formData.append('price', form.price);
            formData.append('level', form.level);
            formData.append('category', form.category)

            if (form.thumbnail instanceof File) {
                formData.append('thumbnail', form.thumbnail);
            } else {
                formData.append('thumbnail', form.thumbnail);
            }

            formData.append('modules', JSON.stringify(form.modules));

            const res = await instructorApi.put(`/instructor/course/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.data.success) {
                toast.success('Course Updated');
                navigate(-1);
            }
        } catch (err) {
            console.error(err);
            alert('Error updating course');
        }
    };

    const fetchData = async () => {
        try {
            const res = await instructorApi.get(`/instructor/course/${id}`);
            if (res.data.success) {

                console.log(res.data.course);
                setForm(res.data.course);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>

            <div className="edit-container">
                <form className="edit-course-form" onSubmit={handleSubmit}>
                    <h2>Edit Course</h2>

                    <label>Course Title</label>
                    <input
                        name="title"
                        placeholder="Course Title"
                        onChange={handleChange}
                        value={form.title}
                    />

                    <label>Description</label>
                    <textarea
                        name="description"
                        placeholder="Course Description"
                        onChange={handleChange}
                        value={form.description}
                    ></textarea>

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
                            <p><strong>Selected Skills:</strong></p>
                            <ul>
                                {form.skills.map((skill, i) => (
                                    <li key={i}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <label htmlFor="level">Course Level</label>
                    <select
                        className="level"
                        name="level"
                        value={form.level}
                        onChange={handleChange}
                        required
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>

                    <br />
                    <label>Price</label>
                    <input
                        name="price"
                        placeholder="Price"
                        type="number"
                        onChange={handleChange}
                        value={form.price}
                    />

                    <label>Thumbnail</label>
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setForm({ ...form, thumbnail: e.target.files[0] });
                            }
                        }}
                    />

                    <hr />

                    <h3>Modules</h3>
                    {form.modules.map((module, index) => (
                        <div key={index} className="module-card">
                            <input
                                type="text"
                                placeholder="Module Title"
                                value={module.title}
                                onChange={(e) => updateModule(index, 'title', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Video URL"
                                value={module.videoUrl}
                                onChange={(e) => updateModule(index, 'videoUrl', e.target.value)}
                            />
                            <textarea
                                placeholder="Content"
                                value={module.content}
                                onChange={(e) => updateModule(index, 'content', e.target.value)}
                            />
                            <button type="button" onClick={() => removeModule(index)}>Remove Module</button>
                        </div>
                    ))}

                    <button type="button" onClick={addModule}>+ Add Module</button>

                    <br /><br />
                    <button className="add-course-btn" type="submit">Save</button>
                </form>
            </div>
        </>
    );
};

export default EditCourse;
