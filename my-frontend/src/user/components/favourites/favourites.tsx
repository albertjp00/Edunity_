import { useEffect, useState } from 'react'
import './favourites.css'
import Navbar from '../navbar/navbar';
import { useNavigate } from 'react-router-dom';
import type { Favourite } from '../../interfaces';
import { addToFavourites, getFavouriteCourses } from '../../services/courseServices';
import { toast } from 'react-toastify';


const Favourites = () => {
  const [favourites, setFavourites] = useState<Favourite[]>([]) 
  const navigate = useNavigate()

  const getFavourites = async () => {
    try {
      const res = await getFavouriteCourses()
      if (!res) return
      if (res.data.success) {
        console.log("Favourites:", res.data.favourites)
        setFavourites(res.data.favourites)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const gotoDetails = (id: string) => {
    navigate(`/user/CourseDetails/${id}`)
  }

  const handleRemovefavourites = async (id: string) => {
    try {
      const res = await addToFavourites(id)
      if (!res) return
      console.log('added fav ', res);

      if (res.data.success) {
          setFavourites((prev)=> prev.filter((course)=>course._id!==id))
          
          toast.success('Removed from favourites')
          getFavourites()
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getFavourites()
  }, [])

  return (
    <div className='favourites'>
      <Navbar />
      <h2>My Favourites</h2>
      {favourites.length === 0 ? (
        <p>No favourites yet</p>
      ) : (
        favourites.map((fav) => {


          return (
            <div key={fav._id} className="favourite-card" onClick={() => gotoDetails(fav.course._id)}>
              {fav.course.thumbnail && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/assets/${fav.course.thumbnail}`}
                  alt={fav.course.title}
                  className="img-thumbnail"
                />
              )}
              <h3>{fav.course.title}</h3>
              <p>{fav.course.description}</p>
              <div className="button-section">
                <button onClick={(e) => {
                  e.stopPropagation()
                  handleRemovefavourites(fav.course._id)}}>
                    Remove
                  </button>
                
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default Favourites
