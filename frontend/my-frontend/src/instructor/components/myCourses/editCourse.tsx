import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import instructorApi from '../../../api/instructorApi';
import './editCourse.css';

// Interfaces
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
    category: string
}

// interface ApiResponse<T> {
//     success: boolean;
//     course: T;
// }

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

    const updateModule = (index: number, field: keyof Module, value: string | File) => {
        const modules = [...form.modules];
        if (field === "videoFile") {
            modules[index].videoFile = value as File;
        } else {
            modules[index][field] = value as string;
        }
        setForm({ ...form, modules });
    };


    // const checkUrlExists = async (url: string): Promise<boolean> => {
    //     try {
    //         // Quick regex for YouTube / Vimeo / direct video links
    //         const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    //         const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
    //         const videoFileRegex = /\.(mp4|webm|ogg)$/i;

    //         if (youtubeRegex.test(url) || vimeoRegex.test(url) || videoFileRegex.test(url)) {
    //             return true;
    //         }

    //         return false;
    //     } catch (error) {
    //         if (error) {
    //             console.log(error);

    //         }
    //         return false;
    //     }
    // };




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

        const isValid = validateCourseForm(form);
        if (!isValid) return;

        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('skills', JSON.stringify(form.skills));
            formData.append('price', form.price);
            formData.append('level', form.level);
            formData.append('category', form.category);

            if (form.thumbnail instanceof File) {
                formData.append('thumbnail', form.thumbnail);
            }

            // Append modules individually
            form.modules.forEach((mod, idx) => {
                formData.append(`modules[${idx}][title]`, mod.title);
                formData.append(`modules[${idx}][content]`, mod.content);
                if (mod.videoFile) {
                    formData.append(`modules[${idx}][video]`, mod.videoFile);
                } else if (mod.videoUrl) {
                    formData.append(`modules[${idx}][videoUrl]`, mod.videoUrl);
                }
            });

            const res = await instructorApi.patch(`/instructor/course/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

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
            console.log(res);


            if (res.data.success) {
                const course = res.data.course.course;

                setForm({
                    title: course.title || '',
                    description: course.description || '',
                    skills: Array.isArray(course.skills) ? course.skills : [],
                    price: course.price ? String(course.price) : '',
                    thumbnail: course.thumbnail || '',
                    level: course.level || '',
                    modules: Array.isArray(course.modules)
                        ? course.modules.map((m: { title?: string; videoUrl?: string; content?: string }) => ({
                            title: m.title || '',
                            videoUrl: m.videoUrl || '',
                            content: m.content || '',
                        }))
                        : [],
                    category: course.category || '',
                });

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
                        value={form.category || ""}  // ensures controlled input
                        onChange={handleChange}
                        required
                    >
                        {/* Default placeholder option */}
                        <option value="" disabled>
                            -- Select a Category --
                        </option>

                        {/* Category options */}
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="Data Science">Data Science</option>
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
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        updateModule(index, 'videoFile', e.target.files[0]);
                                        // Clear previous videoUrl if replacing with file
                                        updateModule(index, 'videoUrl', '');
                                    }
                                }}
                            />
                            {/* {module.videoUrl && !module.videoFile && (
                                <video width="100%" controls style={{ marginTop: '10px' }}>
                                    <source src={`${import.meta.env.VITE_API_URL}${module.videoUrl}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )} */}
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
