import {
  Settings,
  User,
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  Fuel,
  Gauge,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Lock,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Car,
} from "lucide-react";

import {
  useClerk,
  useAuth,
  useUser,
} from "@clerk/clerk-react";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import AdminSidebar from "../components/admin/AdminSidebar";
import { API } from "../utils/api";

// =====================================================
// TYPES
// =====================================================

interface FuelType {
  _id: string;
  name: string;
  active: boolean;
}

interface Transmission {
  _id: string;
  name: string;
  active: boolean;
}

interface CarOption {
  _id: string;
  category: string;
  name: string;
  active: boolean;
}

type CarOptionCategory =
  | "bodyType"
  | "color"
  | "seats"
  | "owners"
  | "hub"
  | "availability"
  | "carCategory"
  | "safetyFeatures"
  | "features";

// =====================================================
// ADMIN SETTINGS
// =====================================================

const AdminSettings = () => {
  const navigate = useNavigate();

  const { signOut } = useClerk();

  const {
    isLoaded: authLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const { user } = useUser();

  // ===================================================
  // SIDEBAR
  // ===================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("settings");

  // ===================================================
  // VEHICLE OPTIONS
  // ===================================================

  const [fuelTypes, setFuelTypes] =
    useState<FuelType[]>([]);

  const [transmissions, setTransmissions] =
    useState<Transmission[]>([]);

  const [carOptions, setCarOptions] =
    useState<CarOption[]>([]);

  const [optionsLoading, setOptionsLoading] =
    useState(true);

  const [addingFuel, setAddingFuel] =
    useState(false);

  const [addingTransmission, setAddingTransmission] =
    useState(false);

  const [addingCarOption, setAddingCarOption] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState("");

  const [newFuelType, setNewFuelType] =
    useState("");

  const [newTransmission, setNewTransmission] =
    useState("");

  const [newCarOption, setNewCarOption] =
    useState("");

  const [
    selectedOptionCategory,
    setSelectedOptionCategory,
  ] = useState<CarOptionCategory>("bodyType");

  // ===================================================
  // PASSWORD
  // ===================================================

  const [
    showPasswordSection,
    setShowPasswordSection,
  ] = useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  // ===================================================
  // NOTIFICATIONS
  // ===================================================

  const [
    bookingNotifications,
    setBookingNotifications,
  ] = useState(true);

  const [
    enquiryNotifications,
    setEnquiryNotifications,
  ] = useState(true);

  const [
    reviewNotifications,
    setReviewNotifications,
  ] = useState(true);

  const [
    userNotifications,
    setUserNotifications,
  ] = useState(true);

  // ===================================================
  // LOAD NOTIFICATION SETTINGS
  // ===================================================

  useEffect(() => {
    const savedSettings =
      localStorage.getItem(
        "autolux_admin_notifications"
      );

    if (savedSettings) {
      try {
        const settings =
          JSON.parse(savedSettings);

        setBookingNotifications(
          settings.booking ?? true
        );

        setEnquiryNotifications(
          settings.enquiry ?? true
        );

        setReviewNotifications(
          settings.review ?? true
        );

        setUserNotifications(
          settings.user ?? true
        );
      } catch (error) {
        console.error(
          "Notification settings error:",
          error
        );
      }
    }
  }, []);

  // ===================================================
  // NOTIFICATION
  // ===================================================

  const showNotification = (
    type: "success" | "error",
    message: string
  ) => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  // ===================================================
  // SAVE NOTIFICATION SETTINGS
  // ===================================================

  const saveNotificationSettings = (
    type:
      | "booking"
      | "enquiry"
      | "review"
      | "user",
    value: boolean
  ) => {
    const settings = {
      booking:
        type === "booking"
          ? value
          : bookingNotifications,

      enquiry:
        type === "enquiry"
          ? value
          : enquiryNotifications,

      review:
        type === "review"
          ? value
          : reviewNotifications,

      user:
        type === "user"
          ? value
          : userNotifications,
    };

    localStorage.setItem(
      "autolux_admin_notifications",
      JSON.stringify(settings)
    );

    if (type === "booking") {
      setBookingNotifications(value);
    }

    if (type === "enquiry") {
      setEnquiryNotifications(value);
    }

    if (type === "review") {
      setReviewNotifications(value);
    }

    if (type === "user") {
      setUserNotifications(value);
    }

    showNotification(
      "success",
      "Notification preference updated."
    );
  };

  // ===================================================
  // AUTH HEADERS
  // ===================================================

  const getAuthHeaders = async () => {
    if (!authLoaded) {
      throw new Error(
        "Authentication is still loading."
      );
    }

    if (!isSignedIn) {
      throw new Error(
        "Please login first."
      );
    }

    const token = await getToken();

    if (!token) {
      throw new Error(
        "Authentication token not available."
      );
    }

    return {
      "Content-Type":
        "application/json",

      Authorization:
        `Bearer ${token}`,
    };
  };

  // ===================================================
  // FETCH OPTIONS
  // ===================================================

  const fetchOptions = async () => {
    try {
      setOptionsLoading(true);

      const headers =
        await getAuthHeaders();

      const [
        fuelResponse,
        transmissionResponse,
        carOptionsResponse,
      ] = await Promise.all([
        fetch(
          `${API}/options/fuel-types/admin`,
          {
            method: "GET",
            headers,
            credentials: "include",
          }
        ),

        fetch(
          `${API}/options/transmissions/admin`,
          {
            method: "GET",
            headers,
            credentials: "include",
          }
        ),

        fetch(
          `${API}/options/car-options/admin`,
          {
            method: "GET",
            headers,
            credentials: "include",
          }
        ),
      ]);

      const fuelData =
        await fuelResponse.json();

      const transmissionData =
        await transmissionResponse.json();

      const carOptionsData =
        await carOptionsResponse.json();

      if (
        !fuelResponse.ok ||
        !fuelData.success
      ) {
        throw new Error(
          fuelData.message ||
            "Failed to load fuel types."
        );
      }

      if (
        !transmissionResponse.ok ||
        !transmissionData.success
      ) {
        throw new Error(
          transmissionData.message ||
            "Failed to load transmissions."
        );
      }

      if (
        !carOptionsResponse.ok ||
        !carOptionsData.success
      ) {
        throw new Error(
          carOptionsData.message ||
            "Failed to load car options."
        );
      }

      setFuelTypes(
        Array.isArray(
          fuelData.fuelTypes
        )
          ? fuelData.fuelTypes
          : []
      );

      setTransmissions(
        Array.isArray(
          transmissionData.transmissions
        )
          ? transmissionData.transmissions
          : []
      );

      setCarOptions(
        Array.isArray(
          carOptionsData.options
        )
          ? carOptionsData.options
          : []
      );
    } catch (error) {
      console.error(
        "Fetch Options Error:",
        error
      );

      showNotification(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to load vehicle options."
      );
    } finally {
      setOptionsLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    if (
      !authLoaded ||
      !isSignedIn
    ) {
      return;
    }

    fetchOptions();
  }, [
    authLoaded,
    isSignedIn,
  ]);

  // ===================================================
  // CHANGE PASSWORD
  // ===================================================

  const handleChangePassword =
    async () => {
      if (!user) {
        showNotification(
          "error",
          "Admin account not available."
        );

        return;
      }

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        showNotification(
          "error",
          "Please fill all password fields."
        );

        return;
      }

      if (
        newPassword.length < 8
      ) {
        showNotification(
          "error",
          "New password must contain at least 8 characters."
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        showNotification(
          "error",
          "New passwords do not match."
        );

        return;
      }

      if (
        currentPassword ===
        newPassword
      ) {
        showNotification(
          "error",
          "New password must be different from the current password."
        );

        return;
      }

      try {
        setChangingPassword(true);

        await user.updatePassword({
          currentPassword,
          newPassword,
          signOutOfOtherSessions: false,
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setShowPasswordSection(false);

        showNotification(
          "success",
          "Password changed successfully."
        );
      } catch (error) {
        console.error(
          "Change Password Error:",
          error
        );

        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Unable to change password."
        );
      } finally {
        setChangingPassword(false);
      }
    };

  // ===================================================
  // ADD FUEL TYPE
  // ===================================================

  const handleAddFuelType =
    async () => {
      const name =
        newFuelType.trim();

      if (!name) {
        showNotification(
          "error",
          "Please enter a fuel type."
        );

        return;
      }

      try {
        setAddingFuel(true);

        const headers =
          await getAuthHeaders();

        const response =
          await fetch(
            `${API}/options/fuel-types`,
            {
              method: "POST",
              headers,
              credentials:
                "include",
              body:
                JSON.stringify({
                  name,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to add fuel type."
          );
        }

        setFuelTypes(
          (previous) =>
            [
              ...previous,
              data.fuelType,
            ].sort((a, b) =>
              a.name.localeCompare(
                b.name
              )
            )
        );

        setNewFuelType("");

        showNotification(
          "success",
          `"${name}" fuel type added successfully.`
        );
      } catch (error) {
        console.error(
          "Add Fuel Type Error:",
          error
        );

        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to add fuel type."
        );
      } finally {
        setAddingFuel(false);
      }
    };

  // ===================================================
  // ADD TRANSMISSION
  // ===================================================

  const handleAddTransmission =
    async () => {
      const name =
        newTransmission.trim();

      if (!name) {
        showNotification(
          "error",
          "Please enter a transmission."
        );

        return;
      }

      try {
        setAddingTransmission(true);

        const headers =
          await getAuthHeaders();

        const response =
          await fetch(
            `${API}/options/transmissions`,
            {
              method: "POST",
              headers,
              credentials:
                "include",
              body:
                JSON.stringify({
                  name,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to add transmission."
          );
        }

        setTransmissions(
          (previous) =>
            [
              ...previous,
              data.transmission,
            ].sort((a, b) =>
              a.name.localeCompare(
                b.name
              )
            )
        );

        setNewTransmission("");

        showNotification(
          "success",
          `"${name}" transmission added successfully.`
        );
      } catch (error) {
        console.error(
          "Add Transmission Error:",
          error
        );

        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to add transmission."
        );
      } finally {
        setAddingTransmission(false);
      }
    };

  // ===================================================
  // ADD CAR OPTION
  // ===================================================

  const handleAddCarOption =
    async () => {
      const name =
        newCarOption.trim();

      if (!name) {
        showNotification(
          "error",
          "Please enter an option name."
        );

        return;
      }

      try {
        setAddingCarOption(true);

        const headers =
          await getAuthHeaders();

        const response =
          await fetch(
            `${API}/options/car-options`,
            {
              method: "POST",
              headers,
              credentials:
                "include",
              body:
                JSON.stringify({
                  category:
                    selectedOptionCategory,
                  name,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to add car option."
          );
        }

        setCarOptions(
          (previous) =>
            [
              ...previous,
              data.option,
            ].sort((a, b) =>
              a.name.localeCompare(
                b.name
              )
            )
        );

        setNewCarOption("");

        showNotification(
          "success",
          `"${name}" added successfully.`
        );
      } catch (error) {
        console.error(
          "Add Car Option Error:",
          error
        );

        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to add car option."
        );
      } finally {
        setAddingCarOption(false);
      }
    };

  // ===================================================
  // TOGGLE FUEL TYPE
  // ===================================================

  const toggleFuelType =
    async (
      item: FuelType
    ) => {
      try {
        setUpdatingId(
          item._id
        );

        const headers =
          await getAuthHeaders();

        const response =
          await fetch(
            `${API}/options/fuel-types/${item._id}`,
            {
              method: "PUT",
              headers,
              credentials:
                "include",
              body:
                JSON.stringify({
                  active:
                    !item.active,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to update fuel type."
          );
        }

        setFuelTypes(
          (previous) =>
            previous.map(
              (fuel) =>
                fuel._id ===
                  item._id
                  ? data.fuelType
                  : fuel
            )
        );

        showNotification(
          "success",
          item.active
            ? `"${item.name}" disabled.`
            : `"${item.name}" activated.`
        );
      } catch (error) {
        console.error(
          "Toggle Fuel Type Error:",
          error
        );

        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to update fuel type."
        );
      } finally {
        setUpdatingId("");
      }
    };

  // ===================================================
  // TOGGLE TRANSMISSION
  // ===================================================

  const toggleTransmission =
    async (
      item: Transmission
    ) => {
      try {
        setUpdatingId(
          item._id
        );

        const headers =
          await getAuthHeaders();

        const response =
          await fetch(
            `${API}/options/transmissions/${item._id}`,
            {
              method: "PUT",
              headers,
              credentials:
                "include",
              body:
                JSON.stringify({
                  active:
                    !item.active,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to update transmission."
          );
        }

        setTransmissions(
          (previous) =>
            previous.map(
              (transmission) =>
                transmission._id ===
                  item._id
                  ? data.transmission
                  : transmission
            )
        );

        showNotification(
          "success",
          item.active
            ? `"${item.name}" disabled.`
            : `"${item.name}" activated.`
        );
      } catch (error) {
        console.error(
          "Toggle Transmission Error:",
          error
        );

        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to update transmission."
        );
      } finally {
        setUpdatingId("");
      }
    };

  // ===================================================
  // TOGGLE CAR OPTION
  // ===================================================

  const toggleCarOption =
    async (
      item: CarOption
    ) => {
      try {
        setUpdatingId(
          item._id
        );

        const headers =
          await getAuthHeaders();

        const response =
          await fetch(
            `${API}/options/car-options/${item._id}`,
            {
              method: "PUT",
              headers,
              credentials:
                "include",
              body:
                JSON.stringify({
                  active:
                    !item.active,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to update car option."
          );
        }

        setCarOptions(
          (previous) =>
            previous.map(
              (option) =>
                option._id ===
                  item._id
                  ? data.option
                  : option
            )
        );

        showNotification(
          "success",
          item.active
            ? `"${item.name}" disabled.`
            : `"${item.name}" activated.`
        );
      } catch (error) {
        console.error(
          "Toggle Car Option Error:",
          error
        );

        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to update car option."
        );
      } finally {
        setUpdatingId("");
      }
    };

  // ===================================================
  // DELETE FUEL TYPE
  // ===================================================

  const deleteFuelType =
    async (
      item: FuelType
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${item.name}"?\n\nIf cars are using this fuel type, deletion will be blocked.`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          item._id
        );

        const headers =
          await getAuthHeaders();

        const response =
          await fetch(
            `${API}/options/fuel-types/${item._id}`,
            {
              method: "DELETE",
              headers,
              credentials:
                "include",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to delete fuel type."
          );
        }

        setFuelTypes(
          (previous) =>
            previous.filter(
              (fuel) =>
                fuel._id !==
                item._id
            )
        );

        showNotification(
          "success",
          `"${item.name}" deleted successfully.`
        );
      } catch (error) {
        console.error(
          "Delete Fuel Type Error:",
          error
        );

        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to delete fuel type."
        );
      } finally {
        setDeletingId("");
      }
    };

  // ===================================================
  // DELETE TRANSMISSION
  // ===================================================

  const deleteTransmission =
    async (
      item: Transmission
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${item.name}"?\n\nIf cars are using this transmission, deletion will be blocked.`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          item._id
        );

        const headers =
          await getAuthHeaders();

        const response =
          await fetch(
            `${API}/options/transmissions/${item._id}`,
            {
              method: "DELETE",
              headers,
              credentials:
                "include",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to delete transmission."
          );
        }

        setTransmissions(
          (previous) =>
            previous.filter(
              (transmission) =>
                transmission._id !==
                item._id
            )
        );

        showNotification(
          "success",
          `"${item.name}" deleted successfully.`
        );
      } catch (error) {
        console.error(
          "Delete Transmission Error:",
          error
        );

        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to delete transmission."
        );
      } finally {
        setDeletingId("");
      }
    };

  // ===================================================
  // DELETE CAR OPTION
  // ===================================================

  const deleteCarOption =
    async (
      item: CarOption
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${item.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          item._id
        );

        const headers =
          await getAuthHeaders();

        const response =
          await fetch(
            `${API}/options/car-options/${item._id}`,
            {
              method: "DELETE",
              headers,
              credentials:
                "include",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to delete car option."
          );
        }

        setCarOptions(
          (previous) =>
            previous.filter(
              (option) =>
                option._id !==
                item._id
            )
        );

        showNotification(
          "success",
          `"${item.name}" deleted successfully.`
        );
      } catch (error) {
        console.error(
          "Delete Car Option Error:",
          error
        );

        showNotification(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to delete car option."
        );
      } finally {
        setDeletingId("");
      }
    };

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout =
    async () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to logout?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await signOut();

        navigate(
          "/login",
          {
            replace: true,
          }
        );
      } catch (error) {
        console.error(
          "Logout Error:",
          error
        );

        showNotification(
          "error",
          "Unable to logout. Please try again."
        );
      }
    };

  // ===================================================
  // AUTH LOADING
  // ===================================================

  if (!authLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <RefreshCw
          className="animate-spin text-[#ff4054]"
          size={30}
        />
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar
        activeSection={
          activeSection
        }
        setActiveSection={
          setActiveSection
        }
        isOpen={
          sidebarOpen
        }
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        className="
          min-h-screen
          min-w-0
          lg:ml-64
          lg:w-[calc(100%-16rem)]
        "
      >

        {/* MOBILE HEADER */}

        <div className="border-b border-gray-200 bg-white px-4 py-4 lg:hidden">

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="
              rounded-xl
              bg-gray-900
              px-4
              py-2
              text-sm
              font-bold
              text-white
            "
          >
            ☰ Admin Menu
          </button>

        </div>

        <div
          className="
            mx-auto
            w-full
            max-w-[1200px]
            px-4
            py-6
            sm:px-6
            sm:py-8
            lg:px-8
            lg:py-10
          "
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#ff4054]
              "
            >
              Administration
            </p>

            <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

              <div>

                <h1
                  className="
                    text-3xl
                    font-black
                    text-gray-900
                    sm:text-4xl
                  "
                >
                  Settings
                </h1>

                <p className="mt-2 text-gray-500">
                  Manage your admin account,
                  security, notifications and
                  vehicle options.
                </p>

              </div>

              <button
                type="button"
                onClick={fetchOptions}
                disabled={optionsLoading}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-gray-700
                  shadow-sm
                  hover:bg-gray-50
                  disabled:opacity-50
                "
              >

                <RefreshCw
                  size={16}
                  className={
                    optionsLoading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh Options

              </button>

            </div>

          </div>

          {/* =================================================
              ACCOUNT + SECURITY
          ================================================= */}

          <div className="grid gap-6 lg:grid-cols-2">

            {/* ACCOUNT */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#ff4054]/10
                    text-[#ff4054]
                  "
                >
                  <User size={22} />
                </div>

                <div className="min-w-0">

                  <h2 className="text-lg font-black text-gray-900">
                    Admin Account
                  </h2>

                  <p className="text-sm text-gray-500">
                    Your authenticated admin
                    account.
                  </p>

                </div>

              </div>

              <div className="mt-6 rounded-xl bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <ShieldCheck
                    size={20}
                    className="text-green-600"
                  />

                  <div className="min-w-0">

                    <p className="text-sm font-bold text-gray-900">
                      Clerk Authentication
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user?.primaryEmailAddress?.emailAddress ||
                        "Authenticated admin"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* SECURITY */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <Settings size={22} />
                </div>

                <div>

                  <h2 className="text-lg font-black text-gray-900">
                    Security
                  </h2>

                  <p className="text-sm text-gray-500">
                    Account security controls.
                  </p>

                </div>

              </div>

              <div className="mt-6 rounded-xl border border-gray-100 p-4">

                <div className="flex items-center justify-between gap-3">

                  <div>

                    <p className="text-sm font-bold text-gray-900">
                      Authentication Status
                    </p>

                    <div className="mt-3 flex items-center gap-2">

                      <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                      <span className="text-sm font-semibold text-green-600">
                        Active
                      </span>

                    </div>

                  </div>

                  <ShieldCheck
                    size={28}
                    className="text-green-500"
                  />

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordSection(
                      !showPasswordSection
                    )
                  }
                  className="
                    mt-5
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-gray-700
                    transition
                    hover:bg-gray-50
                  "
                >

                  <Lock size={16} />

                  {showPasswordSection
                    ? "Close Password Settings"
                    : "Change Password"}

                </button>

                {showPasswordSection && (
                  <div className="mt-5 space-y-4">

                    <PasswordInput
                      label="Current Password"
                      value={currentPassword}
                      onChange={
                        setCurrentPassword
                      }
                      show={
                        showCurrentPassword
                      }
                      setShow={
                        setShowCurrentPassword
                      }
                    />

                    <PasswordInput
                      label="New Password"
                      value={newPassword}
                      onChange={
                        setNewPassword
                      }
                      show={
                        showNewPassword
                      }
                      setShow={
                        setShowNewPassword
                      }
                    />

                    <PasswordInput
                      label="Confirm New Password"
                      value={confirmPassword}
                      onChange={
                        setConfirmPassword
                      }
                      show={
                        showConfirmPassword
                      }
                      setShow={
                        setShowConfirmPassword
                      }
                    />

                    <p className="text-xs text-gray-500">
                      Password must contain at
                      least 8 characters.
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleChangePassword
                      }
                      disabled={
                        changingPassword
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#ff4054]
                        px-4
                        py-3
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-[#e9364a]
                        disabled:opacity-50
                      "
                    >

                      {changingPassword ? (
                        <RefreshCw
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Lock size={16} />
                      )}

                      {changingPassword
                        ? "Changing Password..."
                        : "Update Password"}

                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="mt-6">

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-purple-50
                    text-purple-600
                  "
                >
                  <Bell size={22} />
                </div>

                <div>

                  <h2 className="text-lg font-black text-gray-900">
                    Notifications
                  </h2>

                  <p className="text-sm text-gray-500">
                    Control which admin notifications
                    you want to receive.
                  </p>

                </div>

              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                <NotificationToggle
                  title="New Bookings"
                  description="Notify about new car bookings."
                  enabled={
                    bookingNotifications
                  }
                  onChange={(value) =>
                    saveNotificationSettings(
                      "booking",
                      value
                    )
                  }
                />

                <NotificationToggle
                  title="New Enquiries"
                  description="Notify about new customer enquiries."
                  enabled={
                    enquiryNotifications
                  }
                  onChange={(value) =>
                    saveNotificationSettings(
                      "enquiry",
                      value
                    )
                  }
                />

                <NotificationToggle
                  title="New Reviews"
                  description="Notify about new customer reviews."
                  enabled={
                    reviewNotifications
                  }
                  onChange={(value) =>
                    saveNotificationSettings(
                      "review",
                      value
                    )
                  }
                />

                <NotificationToggle
                  title="New Users"
                  description="Notify about newly registered users."
                  enabled={
                    userNotifications
                  }
                  onChange={(value) =>
                    saveNotificationSettings(
                      "user",
                      value
                    )
                  }
                />

              </div>

            </div>

          </div>

          {/* =================================================
              VEHICLE OPTIONS
          ================================================= */}

          <div className="mt-6">

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
                sm:p-7
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#ff4054]/10
                    text-[#ff4054]
                  "
                >
                  <Settings size={21} />
                </div>

                <div>

                  <h2 className="text-xl font-black text-gray-900">
                    Vehicle Options
                  </h2>

                  <p className="text-sm text-gray-500">
                    Manage Fuel Types,
                    Transmissions and Buy Cars
                    filter options.
                  </p>

                </div>

              </div>

              {optionsLoading ? (

                <div className="flex min-h-[180px] items-center justify-center">

                  <div className="text-center">

                    <RefreshCw
                      size={28}
                      className="
                        mx-auto
                        animate-spin
                        text-[#ff4054]
                      "
                    />

                    <p className="mt-3 text-sm font-semibold text-gray-500">
                      Loading vehicle options...
                    </p>

                  </div>

                </div>

              ) : (

                <>

                  {/* =================================================
                      FUEL + TRANSMISSION
                  ================================================= */}

                  <div className="mt-7 grid gap-6 lg:grid-cols-2">

                    {/* FUEL TYPES */}

                    <OptionManager
                      title="Fuel Types"
                      description="These options appear in car forms and filters."
                      icon={
                        <Fuel size={21} />
                      }
                      inputValue={
                        newFuelType
                      }
                      setInputValue={
                        setNewFuelType
                      }
                      onAdd={
                        handleAddFuelType
                      }
                      adding={
                        addingFuel
                      }
                      placeholder="e.g. Petrol, Diesel, CNG"
                    >

                      {fuelTypes.length ===
                        0 ? (

                        <EmptyOptions
                          text="No fuel types found."
                        />

                      ) : (

                        fuelTypes.map(
                          (item) => (

                            <OptionRow
                              key={
                                item._id
                              }
                              name={
                                item.name
                              }
                              active={
                                item.active
                              }
                              updating={
                                updatingId ===
                                item._id
                              }
                              deleting={
                                deletingId ===
                                item._id
                              }
                              onToggle={() =>
                                toggleFuelType(
                                  item
                                )
                              }
                              onDelete={() =>
                                deleteFuelType(
                                  item
                                )
                              }
                            />

                          )
                        )

                      )}

                    </OptionManager>

                    {/* TRANSMISSIONS */}

                    <OptionManager
                      title="Transmissions"
                      description="These options appear in car forms and filters."
                      icon={
                        <Gauge size={21} />
                      }
                      inputValue={
                        newTransmission
                      }
                      setInputValue={
                        setNewTransmission
                      }
                      onAdd={
                        handleAddTransmission
                      }
                      adding={
                        addingTransmission
                      }
                      placeholder="e.g. Manual, Automatic, AMT"
                    >

                      {transmissions.length ===
                        0 ? (

                        <EmptyOptions
                          text="No transmissions found."
                        />

                      ) : (

                        transmissions.map(
                          (item) => (

                            <OptionRow
                              key={
                                item._id
                              }
                              name={
                                item.name
                              }
                              active={
                                item.active
                              }
                              updating={
                                updatingId ===
                                item._id
                              }
                              deleting={
                                deletingId ===
                                item._id
                              }
                              onToggle={() =>
                                toggleTransmission(
                                  item
                                )
                              }
                              onDelete={() =>
                                deleteTransmission(
                                  item
                                )
                              }
                            />

                          )
                        )

                      )}

                    </OptionManager>

                  </div>

                  {/* =================================================
                      BUY CARS FILTER OPTIONS
                  ================================================= */}

                  <div className="mt-8 border-t border-gray-100 pt-8">

                    <div className="mb-6">

                      <h3 className="text-lg font-black text-gray-900">
                        Buy Cars Filters
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Manage the filter values shown
                        in the Buy Cars sidebar.
                      </p>

                    </div>

                    {/* FILTER CATEGORY BUTTONS */}

                    <div className="mb-6 flex flex-wrap gap-2">

                      <FilterCategoryButton
                        value="bodyType"
                        label="Body Type"
                        selected={
                          selectedOptionCategory
                        }
                        setSelected={
                          setSelectedOptionCategory
                        }
                      />

                      <FilterCategoryButton
                        value="color"
                        label="Color"
                        selected={
                          selectedOptionCategory
                        }
                        setSelected={
                          setSelectedOptionCategory
                        }
                      />

                      <FilterCategoryButton
                        value="seats"
                        label="Seats"
                        selected={
                          selectedOptionCategory
                        }
                        setSelected={
                          setSelectedOptionCategory
                        }
                      />

                      <FilterCategoryButton
                        value="owners"
                        label="Owners"
                        selected={
                          selectedOptionCategory
                        }
                        setSelected={
                          setSelectedOptionCategory
                        }
                      />

                      <FilterCategoryButton
                        value="hub"
                        label="AutoLux Hubs"
                        selected={
                          selectedOptionCategory
                        }
                        setSelected={
                          setSelectedOptionCategory
                        }
                      />

                      <FilterCategoryButton
                        value="availability"
                        label="Availability"
                        selected={
                          selectedOptionCategory
                        }
                        setSelected={
                          setSelectedOptionCategory
                        }
                      />

                      <FilterCategoryButton
                        value="carCategory"
                        label="Car Category"
                        selected={
                          selectedOptionCategory
                        }
                        setSelected={
                          setSelectedOptionCategory
                        }
                      />

                      <FilterCategoryButton
                        value="safetyFeatures"
                        label="Safety Features"
                        selected={
                          selectedOptionCategory
                        }
                        setSelected={
                          setSelectedOptionCategory
                        }
                      />

                      <FilterCategoryButton
                        value="features"
                        label="Features"
                        selected={
                          selectedOptionCategory
                        }
                        setSelected={
                          setSelectedOptionCategory
                        }
                      />

                    </div>

                    {/* SELECTED CATEGORY */}

                    <OptionManager
                      title={getCategoryTitle(
                        selectedOptionCategory
                      )}
                      description="These options will appear in the Buy Cars filters."
                      icon={
                        <Car size={21} />
                      }
                      inputValue={
                        newCarOption
                      }
                      setInputValue={
                        setNewCarOption
                      }
                      onAdd={
                        handleAddCarOption
                      }
                      adding={
                        addingCarOption
                      }
                      placeholder={getCategoryPlaceholder(
                        selectedOptionCategory
                      )}
                    >

                      {carOptions.filter(
                        (item) =>
                          item.category ===
                          selectedOptionCategory
                      ).length ===
                        0 ? (

                        <EmptyOptions
                          text={`No ${getCategoryTitle(
                            selectedOptionCategory
                          ).toLowerCase()} found.`}
                        />

                      ) : (

                        carOptions
                          .filter(
                            (item) =>
                              item.category ===
                              selectedOptionCategory
                          )
                          .map(
                            (item) => (

                              <OptionRow
                                key={
                                  item._id
                                }
                                name={
                                  item.name
                                }
                                active={
                                  item.active
                                }
                                updating={
                                  updatingId ===
                                  item._id
                                }
                                deleting={
                                  deletingId ===
                                  item._id
                                }
                                onToggle={() =>
                                  toggleCarOption(
                                    item
                                  )
                                }
                                onDelete={() =>
                                  deleteCarOption(
                                    item
                                  )
                                }
                              />

                            )
                          )

                      )}

                    </OptionManager>

                  </div>

                </>

              )}

              {/* SAFE MANAGEMENT */}

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">

                <div className="flex gap-3">

                  <ShieldCheck
                    size={20}
                    className="
                      mt-0.5
                      shrink-0
                      text-blue-600
                    "
                  />

                  <div>

                    <p className="text-sm font-black text-blue-900">
                      Safe option management
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      Active options appear in
                      website forms and Buy Cars
                      filters. Deactivate an option
                      when you want to stop showing
                      it without removing existing
                      database values.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              LOGOUT
          ================================================= */}

          <div
            className="
              mt-6
              rounded-2xl
              border
              border-red-100
              bg-white
              p-6
              shadow-sm
            "
          >

            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>

                <h2 className="text-lg font-black text-gray-900">
                  Logout
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Sign out from your AutoLux
                  admin account.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-red-600
                "
              >

                <LogOut size={17} />

                Logout

              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

// =====================================================
// CATEGORY TITLE
// =====================================================

const getCategoryTitle = (
  category: CarOptionCategory
) => {
  const titles: Record<
    CarOptionCategory,
    string
  > = {
    bodyType: "Body Types",
    color: "Colors",
    seats: "Seats",
    owners: "Owners",
    hub: "AutoLux Hubs",
    availability: "Availability",
    carCategory: "Car Categories",
    safetyFeatures: "Safety Features",
    features: "Features",
  };

  return titles[category];
};

// =====================================================
// CATEGORY PLACEHOLDER
// =====================================================

const getCategoryPlaceholder = (
  category: CarOptionCategory
) => {
  const placeholders: Record<
    CarOptionCategory,
    string
  > = {
    bodyType:
      "e.g. SUV, Sedan, Hatchback",

    color:
      "e.g. Black, White, Red",

    seats:
      "e.g. 4 Seats, 5 Seats, 7 Seats",

    owners:
      "e.g. 1st Owner, 2nd Owner",

    hub:
      "e.g. Pune, Mumbai, Nashik",

    availability:
      "e.g. In Stock, Reserved, Sold",

    carCategory:
      "e.g. Luxury, Premium, Family",

    safetyFeatures:
      "e.g. ABS, Airbags, ESP",

    features:
      "e.g. Sunroof, Cruise Control, Leather Seats",
  };

  return placeholders[category];
};

// =====================================================
// FILTER CATEGORY BUTTON
// =====================================================

interface FilterCategoryButtonProps {
  value: CarOptionCategory;
  label: string;
  selected: CarOptionCategory;
  setSelected: (
    value: CarOptionCategory
  ) => void;
}

const FilterCategoryButton = ({
  value,
  label,
  selected,
  setSelected,
}: FilterCategoryButtonProps) => {
  return (
    <button
      type="button"
      onClick={() =>
        setSelected(value)
      }
      className={`
        rounded-full
        border
        px-4
        py-2
        text-xs
        font-bold
        transition
        ${
          selected === value
            ? "border-[#ff4054] bg-[#ff4054] text-white"
            : "border-gray-200 bg-white text-gray-600 hover:border-[#ff4054] hover:text-[#ff4054]"
        }
      `}
    >
      {label}
    </button>
  );
};

// =====================================================
// PASSWORD INPUT
// =====================================================

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  show: boolean;
  setShow: (
    value: boolean
  ) => void;
}

const PasswordInput = ({
  label,
  value,
  onChange,
  show,
  setShow,
}: PasswordInputProps) => {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold text-gray-700">
        {label}
      </label>

      <div className="relative">

        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="
            w-full
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-3
            pr-11
            text-sm
            outline-none
            transition
            focus:border-[#ff4054]
            focus:ring-2
            focus:ring-[#ff4054]/10
          "
          placeholder="Enter password"
        />

        <button
          type="button"
          onClick={() =>
            setShow(!show)
          }
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-lg
            p-1
            text-gray-400
            hover:bg-gray-100
            hover:text-gray-700
          "
        >

          {show ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}

        </button>

      </div>

    </div>
  );
};

// =====================================================
// NOTIFICATION TOGGLE
// =====================================================

interface NotificationToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (
    value: boolean
  ) => void;
}

const NotificationToggle = ({
  title,
  description,
  enabled,
  onChange,
}: NotificationToggleProps) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-xl
        border
        border-gray-100
        bg-gray-50
        p-4
      "
    >

      <div className="flex min-w-0 items-center gap-3">

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${
              enabled
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-400"
            }
          `}
        >

          {enabled ? (
            <Bell size={18} />
          ) : (
            <BellOff size={18} />
          )}

        </div>

        <div className="min-w-0">

          <p className="text-sm font-bold text-gray-900">
            {title}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>

        </div>

      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!enabled)
        }
        className={`
          relative
          h-6
          w-11
          shrink-0
          rounded-full
          transition
          ${
            enabled
              ? "bg-[#ff4054]"
              : "bg-gray-300"
          }
        `}
      >

        <span
          className={`
            absolute
            top-1
            h-4
            w-4
            rounded-full
            bg-white
            shadow
            transition
            ${
              enabled
                ? "left-6"
                : "left-1"
            }
          `}
        />

      </button>

    </div>
  );
};

// =====================================================
// OPTION MANAGER
// =====================================================

interface OptionManagerProps {
  title: string;
  description: string;
  icon: React.ReactNode;

  inputValue: string;

  setInputValue: (
    value: string
  ) => void;

  onAdd: () => void;

  adding: boolean;

  placeholder: string;

  children: React.ReactNode;
}

const OptionManager = ({
  title,
  description,
  icon,
  inputValue,
  setInputValue,
  onAdd,
  adding,
  placeholder,
  children,
}: OptionManagerProps) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-100
        bg-gray-50
        p-5
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-white
            text-[#ff4054]
            shadow-sm
          "
        >
          {icon}
        </div>

        <div>

          <h3 className="font-black text-gray-900">
            {title}
          </h3>

          <p className="text-xs text-gray-500">
            {description}
          </p>

        </div>

      </div>

      <div className="mt-5 flex gap-2">

        <input
          type="text"
          value={inputValue}
          onChange={(event) =>
            setInputValue(
              event.target.value
            )
          }
          onKeyDown={(event) => {

            if (
              event.key ===
              "Enter"
            ) {
              event.preventDefault();
              onAdd();
            }

          }}
          placeholder={placeholder}
          className="
            min-w-0
            flex-1
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-3
            text-sm
            outline-none
            transition
            focus:border-[#ff4054]
            focus:ring-2
            focus:ring-[#ff4054]/10
          "
        />

        <button
          type="button"
          onClick={onAdd}
          disabled={adding}
          className="
            inline-flex
            shrink-0
            items-center
            gap-2
            rounded-xl
            bg-[#ff4054]
            px-4
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-[#e9364a]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          {adding ? (
            <RefreshCw
              size={16}
              className="animate-spin"
            />
          ) : (
            <Plus size={16} />
          )}

          <span className="hidden sm:inline">
            Add
          </span>

        </button>

      </div>

      <div className="mt-4 space-y-2">
        {children}
      </div>

    </div>
  );
};

// =====================================================
// OPTION ROW
// =====================================================

interface OptionRowProps {
  name: string;
  active: boolean;
  updating: boolean;
  deleting: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

const OptionRow = ({
  name,
  active,
  updating,
  deleting,
  onToggle,
  onDelete,
}: OptionRowProps) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
        rounded-xl
        border
        border-gray-100
        bg-white
        px-4
        py-3
        shadow-sm
      "
    >

      <div className="flex min-w-0 items-center gap-3">

        <span
          className={`
            h-2.5
            w-2.5
            shrink-0
            rounded-full
            ${
              active
                ? "bg-green-500"
                : "bg-gray-300"
            }
          `}
        />

        <div className="min-w-0">

          <p
            className={`
              truncate
              text-sm
              font-bold
              ${
                active
                  ? "text-gray-800"
                  : "text-gray-400 line-through"
              }
            `}
          >
            {name}
          </p>

          <p
            className={`
              text-[11px]
              font-semibold
              ${
                active
                  ? "text-green-600"
                  : "text-gray-400"
              }
            `}
          >
            {active
              ? "Active"
              : "Inactive"}
          </p>

        </div>

      </div>

      <div className="flex shrink-0 items-center gap-1.5">

        <button
          type="button"
          title={
            active
              ? "Deactivate"
              : "Activate"
          }
          disabled={
            updating ||
            deleting
          }
          onClick={onToggle}
          className={`
            rounded-lg
            p-2
            transition
            disabled:cursor-not-allowed
            disabled:opacity-50
            ${
              active
                ? "bg-green-50 text-green-600 hover:bg-green-100"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }
          `}
        >

          {updating ? (
            <RefreshCw
              size={15}
              className="animate-spin"
            />
          ) : active ? (
            <CheckCircle2
              size={16}
            />
          ) : (
            <XCircle
              size={16}
            />
          )}

        </button>

        <button
          type="button"
          title="Delete"
          disabled={
            deleting ||
            updating
          }
          onClick={onDelete}
          className="
            rounded-lg
            bg-red-50
            p-2
            text-red-600
            transition
            hover:bg-red-100
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          {deleting ? (
            <RefreshCw
              size={15}
              className="animate-spin"
            />
          ) : (
            <Trash2
              size={16}
            />
          )}

        </button>

      </div>

    </div>
  );
};

// =====================================================
// EMPTY OPTIONS
// =====================================================

const EmptyOptions = ({
  text,
}: {
  text: string;
}) => {
  return (
    <div
      className="
        rounded-xl
        border
        border-dashed
        border-gray-200
        bg-white
        px-4
        py-6
        text-center
      "
    >

      <p className="text-sm font-semibold text-gray-400">
        {text}
      </p>

    </div>
  );
};

export default AdminSettings;