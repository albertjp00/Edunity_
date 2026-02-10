import InstructorNavbar from '../../components/navbar/navbar'
import MyCourses from '../../components/myCourses/myCourses'
import InstructorEventList from '../../components/events/myEvents'
import { useLocation } from 'react-router-dom'

const InstructorHome = () => {
  const location = useLocation()
  return (
    <div key={location.key}>
      
      <InstructorNavbar />
      <MyCourses />
      <InstructorEventList />
    </div>
  )
}

export default InstructorHome
