import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import './editProfile.css'
import { toast } from 'react-toastify'
import profilePic from '../../../assets/profilePic.png'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar/navbar'
import { getEditProfile, getUserProfile } from '../../services/profileServices'
import type { EditForm } from '../../interfaces'
import { fetchUserProfile } from '../../../redux/slices/authSlice'
import { useAppDispatch } from '../../../redux/hooks'




const EditProfile = () => {

    const navigate = useNavigate()

    const [errors, setErrors] = useState<Partial<Record<keyof EditForm, string>>>({});

    const dispatch = useAppDispatch()


    const [data, setData] = useState<EditForm>({
        name: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        dob: '',
        gender: '',
        profileImage: '',

    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    

    const validate = () => {
    const newErrors: Partial<Record<keyof EditForm, string>> = {};

    (Object.keys(data) as (keyof EditForm)[]).forEach((key) => {
        const error = validateField(key, String(data[key] ?? ""));
        if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
        toast.error("Please fix the errors", { autoClose: 1500 });
        return false;
    }

    return true;
};


    const validateField = (name: keyof EditForm, value: string) => {

        // const { name } = data

        switch (name) {

            case  'name':
                if (!name.trim()) return "Name is required"

                if (value.length < 3) {
                    return 'Name must be atleast 3 characters'
                    return '';
                }
                return ''

         case "phone":
            if (value && !/^[1-9]\d{9}$/.test(value))
                return "Enter a valid 10-digit phone number";
            return "";

            case "bio":
            if (value && value.length > 150)
                return "Bio must be under 150 characters";
            return "";


            case "dob":
            if (value) {
                const dob = new Date(value);
                if (dob > new Date()) return "DOB cannot be in the future";
            }
            return "";

            default:
                return "";


        }
    }

        const handleChange = (
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        ) => {
            const {name , value} = e.target

            setData({ ...data, [e.target.name]: e.target.value });

            const error = validateField(name as keyof  EditForm , value)

            setErrors(prev=>({
                ...prev  , [name]:error,
            }))
        };


const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setSelectedFile(file);
    }
};

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
        return
    }

    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('bio', data.bio);
    formData.append('location', data.location);
    formData.append('dob', data.dob);
    formData.append('gender', data.gender);

    if (selectedFile) {
        formData.append('profileImage', selectedFile);
    }

    try {
        const response = await getEditProfile(formData)

        if (response?.data.success) {
            dispatch(fetchUserProfile()).unwrap()
            toast.success('Profile updated', { autoClose: 1500 });
            navigate('/user/profile')
        }
    } catch (err) {
        console.error(err);
        toast.error('Failed to update profile');
    }
};


const getProfile = async () => {
    const response = await getUserProfile()

    setData(response?.data.data)
}


useEffect(() => {
    getProfile()
}, [])


return (
    <>
        <Navbar />

        <div className="edit-container">
            <h2 className="edit-title">Edit Profile</h2>
            <img
                src={
                    selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : data.profileImage
                            ? `${import.meta.env.VITE_API_URL}/assets/${data.profileImage}`
                            : profilePic
                }
                alt="Profile"
                className="profile-avatar"
            />

            <form onSubmit={handleSubmit} className="edit-form">
                <div className="edit-inputs">
                    <label>Upload Profile Image:</label>
                    <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        placeholder="Enter Name"
                    />
                    {errors.name && <p className="error-text">{errors.name}</p>}

                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={data.phone}
                        onChange={handleChange}
                        placeholder="Enter Phone Number"
                    />
                    {errors.phone && <p className="error-text">{errors.phone}</p>}

                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={data.bio}
                        onChange={handleChange}
                        placeholder="Write a short bio"
                    />
                    {errors.bio && <p className="error-text">{errors.bio}</p>}

                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={data.location}
                        onChange={handleChange}
                        placeholder="Enter Location"
                    />
                    {errors.location && <p className="error-text">{errors.location}</p>}

                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={data.dob}
                        onChange={handleChange}
                    />
                    {errors.dob && <p className="error-text">{errors.dob}</p>}

                    <label>Gender</label>
                    <select
                        name="gender"
                        value={data.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                </div>
                <div className="submit-btn">
                    <button  type="submit" disabled={Object.values(errors).some(Boolean)}>Save Changes</button>
                </div>
            </form>
        </div>

    </>
)
}

export default EditProfile
