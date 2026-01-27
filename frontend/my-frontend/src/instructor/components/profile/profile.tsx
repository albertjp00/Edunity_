import profilePic from './../../../assets/profilePic.png';
import { Link } from 'react-router-dom';
import './profile.css'
import type { IInstructor } from '../../interterfaces/instructorInterfaces';
import { useAppSelector } from '../../../redux/hooks';


const InstructorProfile: React.FC = () => {


  const user = useAppSelector((state)=>
    state.auth.role === 'instructor' ? state.auth.user  : null
  ) as IInstructor | null
  
  return (
      <>
      

      <div className="profile-container1">
        {/* LEFT */}
        <div className="profile-left">
          <div className="profile-card1">
            <div className="user-name-card">
              <img
                src={
                  user?.profileImage
                    ? `${import.meta.env.VITE_API_URL}/assets/${user.profileImage}`
                    : profilePic
                }
                alt="Profile"
                className="profile-avatar"
              />
              <div>
                <h2>{user?.name}</h2>
                <h5>Email: {user?.email}</h5>
                <Link to="/instructor/editProfile">
                  <button className="edit-btn">Edit</button>
                </Link>
              </div>
            </div>

            <div className="about-me">
              <h4>Bio</h4>
              <p>{user?.bio}</p>
            </div>

            <div className="user-details-box">
              <p>
                <i className="fas fa-user"></i> <strong>Role:</strong> Instructor
              </p>
              <p>
                <i className="fas fa-certificate"></i>{' '}
                <strong>Expertise:</strong> {user?.expertise}
              </p>
              <p>
                <i className="fas fa-check-circle"></i> <strong>KYC:</strong>
                {user?.KYCstatus === 'verified' ? (
                  <span style={{ color: 'green', fontWeight: 'bold' }}> Verified</span>
                ) : user?.KYCstatus === 'pending' ? (
                  <span style={{ color: 'orange', fontWeight: 'bold' }}> Pending</span>
                ) : user?.KYCstatus === 'rejected' ? (
                  <>
                    <span style={{ color: 'red', fontWeight: 'bold' }}> Rejected</span>
                    <Link to="/instructor/kyc" style={{ marginLeft: '10px' }}>
                      <button className="kyc-button">Re-Submit</button>
                    </Link>
                  </>
                ) : (
                  <Link to="/instructor/kyc">
                    <button className="kyc-button">Verify</button>
                  </Link>
                )}
              </p>
            </div>

            <div className="user-details-box">
              {user?.skills  ? <span>skills : {user?.skills?.join(', ')}</span>
               : 'No skills added'}
            </div>



            <div className="btn-edit">
              <Link to="/instrcutor/passwordChange">
                <button className="pass-btn">Change Password</button>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="profile-right">
          <div className="education-box">
            <h3>Education</h3>
            <p>{user?.education || 'Not added yet'}</p>

            <h3>Experience</h3>
            <p>{user?.work}</p>
          </div>


          <div className="dashboard-section">
            <h3>Your Instructor Dashboard</h3>
            <p>View your earnings, courses, and analytics in one place.</p>
            <Link to="/instructor/dashboard">
              <button className="dashboard-btn">Go to Dashboard</button>
            </Link>


          </div>

          <div className="dashboard-section">
            <h3>Your Wallet</h3>
            <Link to="/instructor/wallet">
              <button className="dashboard-btn">Wallet</button>
            </Link>


          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorProfile;
