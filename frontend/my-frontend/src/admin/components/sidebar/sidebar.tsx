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
      </ul>
    </div>
  )
}

export default Sidebar
