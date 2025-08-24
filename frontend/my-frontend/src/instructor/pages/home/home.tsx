import React from 'react'
import InstructorNavbar from '../../components/navbar/navbar'
import MyCourses from '../../components/myCourses/myCourses'
import EventList from '../../components/events/myEvents'

const InstructorHome = () => {
  return (
    <div>
      <InstructorNavbar />
      <MyCourses />
      <EventList />
    </div>
  )
}

export default InstructorHome
