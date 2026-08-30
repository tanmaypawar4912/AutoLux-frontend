import { useEffect, useState } from "react";
import {
  Users,
  Mail,
  Search,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { API } from "../utils/api";

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  imageUrl: string;
  role: string;
  createdAt: number;
  updatedAt: number;
  banned: boolean;
}

const AdminUsers = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [activeSection, setActiveSection] =
    useState("users");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // =====================================
  // FETCH USERS
  // =====================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      if (!isLoaded || !isSignedIn) {
        throw new Error("Please login first.");
      }

      const token = await getToken();

      if (!token) {
        throw new Error(
          "Authentication token not available."
        );
      }

      console.log(
        "ADMIN USERS TOKEN: TOKEN RECEIVED ✅"
      );

      const response = await fetch(
        `${API}/admin/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
            "Failed to load users"
        );
      }

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : []
      );
    } catch (error) {
      console.error(
        "Fetch Users Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setLoading(false);
      setError("Please login first.");
      return;
    }

    fetchUsers();
  }, [
    isLoaded,
    isSignedIn,
    getToken,
  ]);

  // =====================================
  // SEARCH
  // =====================================

  const filteredUsers =
    users.filter((user) => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      if (!searchText) {
        return true;
      }

      return (
        user.fullName
          .toLowerCase()
          .includes(searchText) ||
        user.email
          .toLowerCase()
          .includes(searchText) ||
        user.role
          .toLowerCase()
          .includes(searchText)
      );
    });

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (
    timestamp: number
  ) => {
    if (!timestamp) {
      return "Unknown";
    }

    return new Date(
      timestamp
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">

      {/* SIDEBAR */}

      <AdminSidebar
        activeSection={
          activeSection
        }
        setActiveSection={
          setActiveSection
        }
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* MAIN */}

      <main
        className="
          min-h-screen
          min-w-0
          lg:ml-64
          lg:w-[calc(100%-16rem)]
        "
      >
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />
        {/* CONTENT */}

        <div
          className="
            mx-auto
            w-full
            max-w-[1600px]
            min-w-0
            px-4
            py-6
            sm:px-6
            sm:py-8
            lg:px-8
            lg:py-10
          "
        >

          {/* HEADER */}

          <div
            className="
              mb-8
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#ff4054]
                "
              >
                Management
              </p>

              <h1
                className="
                  mt-2
                  text-3xl
                  font-black
                  text-gray-900
                  sm:text-4xl
                "
              >
                Users
              </h1>

              <p className="mt-2 text-gray-500">
                Manage registered AutoLux
                users.
              </p>

            </div>

            <button
              type="button"
              onClick={fetchUsers}
              disabled={loading}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#ff4054]
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-[#e9364a]
                disabled:opacity-50
              "
            >

              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              {loading
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>

          {/* STATISTICS */}

          <div
            className="
              mb-6
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-gray-500">
                    Total Users
                  </p>

                  <p className="mt-2 text-4xl font-black text-gray-900">
                    {users.length}
                  </p>

                </div>

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
                  <Users size={23} />
                </div>

              </div>

            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-gray-500">
                    Admin Users
                  </p>

                  <p className="mt-2 text-4xl font-black text-gray-900">
                    {
                      users.filter(
                        (user) =>
                          user.role ===
                          "admin"
                      ).length
                    }
                  </p>

                </div>

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-50
                    text-[#ff4054]
                  "
                >
                  <ShieldCheck size={23} />
                </div>

              </div>

            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-gray-500">
                    Regular Users
                  </p>

                  <p className="mt-2 text-4xl font-black text-gray-900">
                    {
                      users.filter(
                        (user) =>
                          user.role !==
                          "admin"
                      ).length
                    }
                  </p>

                </div>

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-50
                    text-green-600
                  "
                >
                  <User size={23} />
                </div>

              </div>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                mb-6
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-5
              "
            >

              <p className="font-bold text-red-700">
                Failed to load users
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

            </div>
          )}

          {/* USERS */}

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

            {/* HEADER */}

            <div
              className="
                flex
                flex-col
                gap-4
                border-b
                border-gray-100
                px-5
                py-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>

                <h2 className="text-xl font-black text-gray-900">
                  All Users
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {filteredUsers.length} users found
                </p>

              </div>

              {/* SEARCH */}

              <div className="relative w-full sm:w-80">

                <Search
                  size={18}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search users..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    transition
                    focus:border-[#ff4054]
                    focus:bg-white
                  "
                />

              </div>

            </div>

            {/* LOADING */}

            {loading ? (
              <div className="p-12 text-center">

                <div
                  className="
                    mx-auto
                    h-10
                    w-10
                    animate-spin
                    rounded-full
                    border-4
                    border-gray-200
                    border-t-[#ff4054]
                  "
                />

                <p className="mt-4 font-semibold text-gray-600">
                  Loading users...
                </p>

              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center">

                <Users
                  size={42}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 text-xl font-black text-gray-800">
                  No Users Found
                </h3>

                <p className="mt-2 text-gray-500">
                  No users match your search.
                </p>

              </div>
            ) : (
              <div className="w-full overflow-x-auto">

                <table className="w-full min-w-[850px]">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Email
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Role
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Joined
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredUsers.map(
                      (user) => (
                        <tr
                          key={user.id}
                          className="
                            border-t
                            border-gray-100
                            hover:bg-gray-50
                          "
                        >

                          {/* USER */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-3">

                              {user.imageUrl ? (
                                <img
                                  src={
                                    user.imageUrl
                                  }
                                  alt={
                                    user.fullName
                                  }
                                  className="
                                    h-11
                                    w-11
                                    rounded-full
                                    object-cover
                                  "
                                />
                              ) : (
                                <div
                                  className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#ff4054]/10
                                    text-[#ff4054]
                                  "
                                >
                                  <User
                                    size={19}
                                  />
                                </div>
                              )}

                              <div className="min-w-0">

                                <p className="font-bold text-gray-900">
                                  {user.fullName}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  {user.id}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* EMAIL */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2 text-sm text-gray-600">

                              <Mail
                                size={15}
                                className="shrink-0"
                              />

                              <span>
                                {user.email}
                              </span>

                            </div>

                          </td>

                          {/* ROLE */}

                          <td className="px-5 py-5">

                            <span
                              className={`
                                inline-flex
                                items-center
                                rounded-full
                                px-3
                                py-1.5
                                text-[11px]
                                font-bold
                                uppercase
                                ${
                                  user.role ===
                                  "admin"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                                }
                              `}
                            >
                              {user.role}
                            </span>

                          </td>

                          {/* JOINED */}

                          <td className="px-5 py-5 text-sm font-medium text-gray-500">
                            {formatDate(
                              user.createdAt
                            )}
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-5">

                            <span
                              className={`
                                inline-flex
                                rounded-full
                                px-3
                                py-1.5
                                text-[11px]
                                font-bold
                                ${
                                  user.banned
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                                }
                              `}
                            >
                              {user.banned
                                ? "Banned"
                                : "Active"}
                            </span>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminUsers;