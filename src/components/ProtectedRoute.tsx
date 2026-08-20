import {
  useAuth,
} from "@clerk/clerk-react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({
  children,
}: ProtectedRouteProps) => {
  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  const location = useLocation();

  // =====================================
  // CLERK LOADING
  // =====================================

  if (!isLoaded) {
    return null;
  }

  // =====================================
  // USER NOT LOGGED IN
  // =====================================

  if (!isSignedIn) {
    const currentPath =
      `${location.pathname}${location.search}${location.hash}`;

    const redirectUrl =
      encodeURIComponent(currentPath);

    return (
      <Navigate
        to={`/sign-in?redirect=${redirectUrl}`}
        replace
      />
    );
  }

  // =====================================
  // USER LOGGED IN
  // =====================================

  return <>{children}</>;
};

export default ProtectedRoute;