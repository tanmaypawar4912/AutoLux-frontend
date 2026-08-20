import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Toaster } from "sonner";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import LoadingScreen from "./components/LoadingScreen";
import AppRoutes from "./routes/AppRoutes";

// =====================================================
// GLOBAL AUTH CONTEXT
// =====================================================
// Public users can view the website.
// Action components can use useAppAuth() before
// wishlist, booking, enquiry and other submissions.
// Backend APIs must also verify Clerk authentication.
// =====================================================

type AppAuthContextValue = {
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  getAuthToken: () => Promise<string | null>;
};

const AppAuthContext =
  createContext<AppAuthContextValue | null>(null);

export const useAppAuth = (): AppAuthContextValue => {
  const context = useContext(AppAuthContext);

  if (!context) {
    throw new Error(
      "useAppAuth must be used inside AppAuthProvider."
    );
  }

  return context;
};

type AppAuthProviderProps = {
  children: ReactNode;
};

const AppAuthProvider = ({
  children,
}: AppAuthProviderProps) => {
  const { isLoaded: userLoaded, isSignedIn } =
    useUser();

  const { isLoaded: authLoaded, getToken } =
    useAuth();

  const getAuthToken = async () => {
    if (
      !userLoaded ||
      !authLoaded ||
      !isSignedIn
    ) {
      return null;
    }

    try {
      return await getToken();
    } catch (error) {
      console.error(
        "Authentication token error:",
        error
      );
      return null;
    }
  };

  return (
    <AppAuthContext.Provider
      value={{
        isAuthenticated: Boolean(isSignedIn),
        isAuthLoaded: userLoaded && authLoaded,
        getAuthToken,
      }}
    >
      {children}
    </AppAuthContext.Provider>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  const {
    isLoaded: userLoaded,
    isSignedIn,
  } = useUser();

  const {
    isLoaded: authLoaded,
    getToken,
  } = useAuth();

  const location = useLocation();

  const isAdminPage =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // =========================================
  // SYNC CLERK USER TO MONGODB
  // =========================================

  useEffect(() => {
    if (
      !userLoaded ||
      !authLoaded ||
      !isSignedIn
    ) {
      return;
    }

    const syncUser = async () => {
      try {
        const token = await getToken();

        if (!token) {
          console.error(
            "User Sync Error: Clerk token not available"
          );
          return;
        }

        console.log(
          "USER SYNC TOKEN: TOKEN RECEIVED ✅"
        );

        const response = await fetch(
          "http://localhost:5000/api/users/sync",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          console.error(
            "User Sync Failed:",
            data.message ||
              "Unable to sync user"
          );
          return;
        }

        console.log(
          "✅ User synced with MongoDB"
        );
      } catch (error) {
        console.error(
          "User Sync Error:",
          error
        );
      }
    };

    syncUser();
  }, [
    userLoaded,
    authLoaded,
    isSignedIn,
    getToken,
  ]);

  if (
    loading ||
    !userLoaded ||
    !authLoaded
  ) {
    return <LoadingScreen />;
  }

  return (
    <AppAuthProvider>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3500}
        expand={false}
        visibleToasts={4}
      />

      {!isAdminPage && <Navbar />}

      <main className="min-h-screen">
        <AppRoutes />
      </main>

      {!isAdminPage && (
        <div className="relative z-30 bg-[#111]">
          <Footer />
        </div>
      )}

      <ScrollToTop />
    </AppAuthProvider>
  );
};

export default App;