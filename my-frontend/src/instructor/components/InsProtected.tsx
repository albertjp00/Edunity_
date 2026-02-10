import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const InstProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("instructor");

  if (!token) {
    return <Navigate to="/instructor/login" replace />;
  }

  return <>{children}</>;
};

export default InstProtectedRoute;
