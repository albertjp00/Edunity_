import React from 'react'
import InstructorAllEventList from '../../components/events/allEvents'
import InstructorNavbar from '../../components/navbar/navbar'

const AllEventsPage = () => {
  return (
    <div>
        <InstructorNavbar />
      <InstructorAllEventList />
    </div>
  )
}

export default AllEventsPage
