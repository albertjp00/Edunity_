import './sidebar.css'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/admin/dashboard" className="sidebar-option">
            <p>Dashboard</p>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/users" className="sidebar-option">
            <p>Users</p>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/instructors" className="sidebar-option">
            <p>Instructors</p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/courses" className="sidebar-option">
            <p>Courses</p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/purchases" className="sidebar-option">
            <p>Purchases</p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/earnings" className="sidebar-option">
            <p>Earnings</p>
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
