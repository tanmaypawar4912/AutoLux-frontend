import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

interface Props {
  children: React.ReactNode;
}

const ADMIN_USER_ID = "user_3HUi3th0CqRgPDJqmnNYA5LwPGm";

const AdminRoute = ({ children }: Props) => {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  if (userId !== ADMIN_USER_ID) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;