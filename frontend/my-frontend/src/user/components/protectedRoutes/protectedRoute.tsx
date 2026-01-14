// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {

  const {isAuthenticated , loading , user } = useAppSelector((state)=>state.auth)





  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }


    if(user?.blocked){
    localStorage.removeItem('token')
    return <Navigate to='/user/login' replace />;
  }

  return <>{children}</>;
};


export default ProtectedRoute;
