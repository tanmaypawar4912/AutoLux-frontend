import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";
import BuyCars from "../pages/BuyCars";
import CarDetails from "../pages/CarDetails";
import SellCar from "../pages/SellCar";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import MyCars from "../pages/MyCars";
import EditCar from "../pages/EditCar";
import MyBookings from "../pages/MyBookings";
import Wishlist from "../pages/Wishlist";
import Compare from "../pages/Compare";
import Valuation from "../pages/Valuation";

const AppRoutes = () => {

  return (

    <Routes>

      {/* HOME PAGE */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* BUY CARS PAGE */}

      <Route
        path="/cars"
        element={<BuyCars />}
      />


      {/* DYNAMIC CAR DETAILS PAGE */}

      <Route
        path="/cars/:id"
        element={<CarDetails />}
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      {/* SELL YOUR CAR PAGE */}

      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <SellCar />
          </ProtectedRoute>
        }
      />


      {/* ABOUT PAGE */}

      <Route
        path="/about"
        element={<About />}
      />


      {/* CONTACT PAGE */}

      <Route
        path="/contact"
        element={<Contact />}
      />


      {/* 404 PAGE */}

      <Route
        path="*"
        element={<NotFound />}
      />

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/my-cars"
        element={
          <ProtectedRoute>
            <MyCars />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-car/:id"
        element={
          <ProtectedRoute>
            <EditCar />
          </ProtectedRoute>
        }
      />

      {/* WISHLIST PAGE */}

      <Route
        path="/wishlist"
        element={<Wishlist />}
      />

      {/* COMPARE CARS PAGE */}

      <Route
        path="/compare"
        element={<Compare />}
      />

      {/* INSTANT VALUATION PAGE */}

      <Route
        path="/sell/estimate"
        element={<Valuation />}
      />

    </Routes>


  );

};


export default AppRoutes;