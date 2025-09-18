import React, { useEffect, useState } from 'react'
import api from '../../../api/userApi';
import './favourites.css'
import Navbar from '../navbar/navbar';
import { useNavigate } from 'react-router-dom';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  modules?: string[];
}

interface Favourite {
  _id: string;
  userId: string;
  courseId: string;
  course: Course;
  progress: {
    completedModules: string[];
  };
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL

const Favourites = () => {
  const [favourites, setFavourites] = useState<Favourite[]>([]) // 👈 store as array
  const navigate = useNavigate()

  const getFavourites = async () => {
    try {
      const res = await api.get('/user/getFavourites')
      if (res.data.success) {
        console.log("Favourites:", res.data.favourites)
        setFavourites(res.data.favourites)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const gotoDetails = (id:string)=>{
    navigate(`/user/CourseDetails/${id}`)
  }

  useEffect(() => {
    getFavourites()
  }, [])

  return (
    <div>
        <Navbar/>
      <h2>My Favourites</h2>
      {favourites.length === 0 ? (
        <p>No favourites yet</p>
      ) : (
        favourites.map((fav) => {
        //   const completed = fav.progress.completedModules.length
        //   const total = fav.course.modules?.length || 0
        //   const percent = total > 0 ? Math.round((completed / total) * 100) : 0

          return (
            <div key={fav._id} className="favourite-card" onClick={()=>gotoDetails(fav.course._id)}>
              {fav.course.thumbnail && (
                <img
                  src={`${API_URL}/assets/${fav.course.thumbnail}`}
                  alt={fav.course.title}
                  className="thumbnail"
                />
              )}
              <h3>{fav.course.title}</h3>
              <p>{fav.course.description}</p>
              {/* <p>Progress: {completed}/{total} ({percent}%)</p> */}
              {/* <small>Added on: {new Date(fav.createdAt).toLocaleDateString()}</small> */}
            </div>
          )
        })
      )}
    </div>
  )
}

export default Favourites
