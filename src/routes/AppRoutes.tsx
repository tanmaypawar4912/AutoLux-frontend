import {
  Routes,
  Route,
} from "react-router-dom";

// ==============================
// PUBLIC PAGES
// ==============================

import Home from "../pages/Home";
import BuyCars from "../pages/BuyCars";
import CarDetails from "../pages/CarDetails";
import About from "../pages/About";
import Contact from "../pages/Contact";
import BookTestDrive from "../pages/BookTestDrive";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/SignIn";

// ==============================
// USER / PROTECTED PAGES
// ==============================

import SellCar from "../pages/SellCar";
import MyCars from "../pages/MyCars";
import EditCar from "../pages/EditCar";
import MyBookings from "../pages/MyBookings";
import Wishlist from "../pages/Wishlist";
import Compare from "../pages/Compare";
import Valuation from "../pages/Valuation";

import ProtectedRoute from "../components/ProtectedRoute";

// ADMIN


import ProtectedAdminRoute from "../components/ProtectedAdminRoute";

import AdminDashboard from "../pages/AdminDashboard";
import AdminBookings from "../pages/AdminBookings";
import AdminCars from "../pages/AdminCars";
import AdminUsers from "../pages/AdminUsers";
import AdminWishlist from "../pages/AdminWishlist";
import AdminReviews from "../pages/AdminReviews";
import AdminEnquiries from "../pages/AdminEnquiries";
import AdminContactMessages from "../pages/AdminContactMessages";
import AdminSettings from "../pages/AdminSettings";

// ==============================
// APP ROUTES
// ==============================

const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================
          HOME
      ====================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* =====================================
          CLERK SIGN IN
      ====================================== */}

      <Route
        path="/sign-in"
        element={<SignIn />}
      />

      {/* =====================================
          BUY CARS
      ====================================== */}

      <Route
        path="/cars"
        element={<BuyCars />}
      />

      {/* =====================================
          CAR DETAILS
      ====================================== */}

      <Route
        path="/cars/:id"
        element={<CarDetails />}
      />

      {/* =====================================
          BOOK TEST DRIVE
      ====================================== */}

      <Route
        path="/book-test-drive"
        element={
          <ProtectedRoute>
            <BookTestDrive />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          MY BOOKINGS
      ====================================== */}

      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          SELL CAR
      ====================================== */}

      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <SellCar />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          MY CARS
      ====================================== */}

      <Route
        path="/my-cars"
        element={
          <ProtectedRoute>
            <MyCars />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          EDIT CAR
      ====================================== */}

      <Route
        path="/edit-car/:id"
        element={
          <ProtectedRoute>
            <EditCar />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          WISHLIST
      ====================================== */}

      <Route
        path="/wishlist"
        element={<Wishlist />}
      />

      {/* =====================================
          COMPARE
      ====================================== */}

      <Route
        path="/compare"
        element={<Compare />}
      />

      {/* =====================================
          CAR VALUATION
      ====================================== */}

      <Route
        path="/sell/estimate"
        element={<Valuation />}
      />

      {/* =====================================
          ABOUT
      ====================================== */}

      <Route
        path="/about"
        element={<About />}
      />

      {/* =====================================
          CONTACT
      ====================================== */}

      <Route
        path="/contact"
        element={<Contact />}
      />

      {/* =====================================
          ADMIN DASHBOARD
      ====================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      {/* =====================================
          ADMIN CARS
      ====================================== */}

      <Route
        path="/admin/cars"
        element={
          <ProtectedAdminRoute>
            <AdminCars />
          </ProtectedAdminRoute>
        }
      />

      {/* =====================================
          ADMIN USERS
      ====================================== */}

      <Route
        path="/admin/users"
        element={
          <ProtectedAdminRoute>
            <AdminUsers />
          </ProtectedAdminRoute>
        }
      />

      {/* =====================================
          ADMIN BOOKINGS
      ====================================== */}

      <Route
        path="/admin/bookings"
        element={
          <ProtectedAdminRoute>
            <AdminBookings />
          </ProtectedAdminRoute>
        }
      />

      {/* =====================================
          ADMIN WISHLIST
      ====================================== */}

      <Route
        path="/admin/wishlist"
        element={
          <ProtectedAdminRoute>
            <AdminWishlist />
          </ProtectedAdminRoute>
        }
      />

      {/* =====================================
          ADMIN REVIEWS
      ====================================== */}

      <Route
        path="/admin/reviews"
        element={
          <ProtectedAdminRoute>
            <AdminReviews />
          </ProtectedAdminRoute>
        }
      />

      {/* =====================================
          ADMIN ENQUIRIES
      ====================================== */}

      <Route
        path="/admin/enquiries"
        element={
          <ProtectedAdminRoute>
            <AdminEnquiries />
          </ProtectedAdminRoute>
        }
      />

      {/* =====================================
          ADMIN CONTACT MESSAGES
      ====================================== */}

      <Route
        path="/admin/contact-messages"
        element={
          <ProtectedAdminRoute>
            <AdminContactMessages />
          </ProtectedAdminRoute>
        }
      />

      {/* =====================================
          ADMIN SETTINGS
      ====================================== */}

      <Route
        path="/admin/settings"
        element={
          <ProtectedAdminRoute>
            <AdminSettings />
          </ProtectedAdminRoute>
        }
      />

      {/* =====================================
          404
      ====================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;