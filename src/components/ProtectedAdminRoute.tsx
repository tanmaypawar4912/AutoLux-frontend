import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ProtectedAdminRoute = ({ children }: Props) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-bold">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  const role = user?.publicMetadata?.role;

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;