import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  Heart,
  Star,
  MessageSquare,
  Mail,
  Settings,
  House,
  LogOut,
  X,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useClerk } from "@clerk/clerk-react";

import Swal from "sweetalert2";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (
    section: string
  ) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({
  setActiveSection,
  isOpen,
  onClose,
}: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { signOut } = useClerk();

  // =====================================
  // SIDEBAR MENU
  // =====================================

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      id: "cars",
      label: "Cars",
      icon: Car,
      path: "/admin/cars",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: CalendarCheck,
      path: "/admin/bookings",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      path: "/admin/wishlist",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: Star,
      path: "/admin/reviews",
    },
    {
      id: "enquiries",
      label: "Enquiries",
      icon: MessageSquare,
      path: "/admin/enquiries",
    },
    {
      id: "contact-messages",
      label: "Contact Messages",
      icon: Mail,
      path: "/admin/contact-messages",
    },
  ];

  // =====================================
  // NAVIGATION
  // =====================================

  const handleNavigation = (
    id: string,
    path: string
  ) => {
    setActiveSection(id);
    navigate(path);
    onClose();
  };

  // =====================================
  // ACTIVE ROUTE
  // =====================================

  const isItemActive = (
    id: string,
    path: string
  ) => {
    if (id === "dashboard") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  // =====================================
  // SETTINGS
  // =====================================

  const handleSettings = () => {
    setActiveSection("settings");
    navigate("/admin/settings");
    onClose();
  };

  // =====================================
  // GO TO HOME
  // =====================================

  const handleGoToHome = () => {
    onClose();
    navigate("/");
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#ff4054",
      cancelButtonColor: "#6b7280",

      reverseButtons: true,

      background: "#111111",
      color: "#ffffff",

      customClass: {
        popup: "autolux-logout-popup",
        title: "autolux-logout-title",
        htmlContainer: "autolux-logout-text",
        confirmButton: "autolux-logout-confirm",
        cancelButton: "autolux-logout-cancel",
      },
    });

    // User clicked Cancel
    if (!result.isConfirmed) {
      return;
    }

    try {
      await signOut();

      onClose();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );

      await Swal.fire({
        title: "Logout Failed",
        text: "Unable to logout. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ff4054",
        background: "#111111",
        color: "#ffffff",
      });
    }
  };

  return (
    <>
      <style>{`
        .autolux-admin-sidebar-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
      {/* MOBILE OVERLAY */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          bg-[#111]
          text-white
          shadow-2xl
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* LOGO */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-white/10
            px-5
            py-5
            sm:px-6
            sm:py-6
          "
        >
          <div>
            <h1 className="text-2xl font-black">
              Auto
              <span className="text-[#ff4054]">
                Lux
              </span>
            </h1>

            <p
              className="
                mt-1
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.25em]
                text-gray-500
              "
            >
              Admin Panel
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-white/10
              hover:text-white
              lg:hidden
            "
          >
            <X size={21} />
          </button>
        </div>

        {/* MENU */}

        <nav
          className="
            autolux-admin-sidebar-scroll
            flex-1
            overflow-y-auto
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            px-3
            py-5
            sm:px-4
            sm:py-6
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <p
            className="
              mb-3
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-gray-500
              sm:mb-4
              sm:text-xs
            "
          >
            Management
          </p>

          <div className="space-y-1.5 sm:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active = isItemActive(
                item.id,
                item.path
              );

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleNavigation(
                      item.id,
                      item.path
                    )
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    text-sm
                    font-semibold
                    transition-all
                    duration-200
                    sm:gap-4
                    sm:px-4
                    sm:py-3.5

                    ${
                      active
                        ? `
                          bg-[#ff4054]
                          text-white
                          shadow-lg
                          shadow-[#ff4054]/20
                        `
                        : `
                          text-gray-400
                          hover:bg-white/10
                          hover:text-white
                        `
                    }
                  `}
                >
                  <Icon
                    size={19}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM */}

        <div
          className="
            shrink-0
            border-t
            border-white/10
            p-3
            sm:p-4
          "
        >
          {/* GO TO HOME */}

          <button
            type="button"
            onClick={handleGoToHome}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              font-semibold
              text-gray-400
              transition
              hover:bg-white/10
              hover:text-white
              sm:gap-4
              sm:px-4
              sm:py-3.5
            "
          >
            <House
              size={19}
              className="shrink-0"
            />

            <span>Go to Home</span>
          </button>

          {/* SETTINGS */}

          <button
            type="button"
            onClick={handleSettings}
            className={`
              mt-1.5
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              font-semibold
              transition
              sm:gap-4
              sm:px-4
              sm:py-3.5

              ${
                location.pathname ===
                "/admin/settings"
                  ? "bg-[#ff4054] text-white"
                  : `
                    text-gray-400
                    hover:bg-white/10
                    hover:text-white
                  `
              }
            `}
          >
            <Settings
              size={19}
              className="shrink-0"
            />

            <span>Settings</span>
          </button>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              mt-1.5
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              font-semibold
              text-gray-400
              transition
              hover:bg-red-500/10
              hover:text-red-400
              sm:gap-4
              sm:px-4
              sm:py-3.5
            "
          >
            <LogOut
              size={19}
              className="shrink-0"
            />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;