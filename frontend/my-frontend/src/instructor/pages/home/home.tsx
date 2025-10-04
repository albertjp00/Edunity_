import React from 'react'
import InstructorNavbar from '../../components/navbar/navbar'
import MyCourses from '../../components/myCourses/myCourses'
import InstructorEventList from '../../components/events/myEvents'

const InstructorHome = () => {
  return (
    <div>
      
      <InstructorNavbar />
      <MyCourses />
      <InstructorEventList />
    </div>
  )
}

export default InstructorHome
