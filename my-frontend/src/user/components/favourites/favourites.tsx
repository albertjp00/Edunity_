import { useEffect, useState } from 'react'
import './favourites.css'
import Navbar from '../navbar/navbar';
import { useNavigate } from 'react-router-dom';
import type { Favourite } from '../../interfaces';
import { addToFavourites, getFavouriteCourses } from '../../services/courseServices';
import { toast } from 'react-hot-toast';


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
  <div className="min-h-screen bg-gray-50">
    <Navbar />

    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold mb-6">My Favourites</h2>

      {favourites.length === 0 ? (
        <p className="text-gray-500 text-center">No favourites yet</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favourites.map((fav) => {
            return (
              <div
                key={fav._id}
                onClick={() => gotoDetails(fav.course._id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 cursor-pointer overflow-hidden group"
              >
                {/* IMAGE */}
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/assets/${fav.course.thumbnail}`}
                    alt={fav.course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="text-md font-semibold text-gray-800 line-clamp-1">
                    {fav.course.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {fav.course.description}
                  </p>

                  {/* BUTTON */}
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovefavourites(fav.course._id);
                      }}
                      className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                    >
                      Remove
                    </button>

                    <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);
}

export default Favourites
