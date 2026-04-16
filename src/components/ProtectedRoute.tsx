import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userStr = localStorage.getItem("dreamDriveUser");
  
  if (!userStr) {
    // Show a polite warning that they must log in to access this page
    toast.error("Please login to access your profile");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
