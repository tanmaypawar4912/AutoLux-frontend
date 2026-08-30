import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  Mail,
  Phone,
  RefreshCw,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { API } from "../utils/api";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  interestedCar?: string;
  preferredContact?: string;
  message: string;
  status: "New" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Normal" | "High";
  createdAt?: string;
}

interface ContactResponse {
  success: boolean;
  count: number;
  contacts: ContactMessage[];
}

const AdminContactMessages = () => {
  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    "contact-messages"
  );

  const fetchContacts = async (showToast = false) => {
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

      const response = await fetch(
        `${API}/contacts/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: ContactResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          "Failed to load contact messages."
        );
      }

      setContacts(
        Array.isArray(data.contacts)
          ? data.contacts
          : []
      );

      if (showToast) {
        toast.success("Contact messages refreshed.");
      }
    } catch (error) {
      console.error(
        "Fetch Contact Messages Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load contact messages.";

      setError(message);
      toast.error("Failed to load contact messages.", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setLoading(false);
      setError("Please login first.");
      return;
    }

    fetchContacts();
  }, [isLoaded, isSignedIn, getToken]);

  const updateContact = async (
    id: string,
    field: "status" | "priority",
    value: string
  ) => {
    try {
      setLoadingId(id);

      const token = await getToken();

      if (!token) {
        throw new Error(
          "Authentication token not available."
        );
      }

      const response = await fetch(
        `${API}/contacts/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [field]: value,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update contact message."
        );
      }

      setContacts((previous) =>
        previous.map((contact) =>
          contact._id === id
            ? {
                ...contact,
                [field]: value,
              }
            : contact
        )
      );

      toast.success("Contact message updated.");
    } catch (error) {
      console.error(
        "Update Contact Message Error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update contact message."
      );
    } finally {
      setLoadingId("");
    }
  };

  const deleteContact = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoadingId(id);

      const token = await getToken();

      if (!token) {
        throw new Error(
          "Authentication token not available."
        );
      }

      const response = await fetch(
        `${API}/contacts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete contact message."
        );
      }

      setContacts((previous) =>
        previous.filter(
          (contact) => contact._id !== id
        )
      );

      toast.success("Contact message deleted.");
    } catch (error) {
      console.error(
        "Delete Contact Message Error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete contact message."
      );
    } finally {
      setLoadingId("");
    }
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "Unknown";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const newCount = contacts.filter(
    (item) => item.status === "New"
  ).length;

  const inProgressCount = contacts.filter(
    (item) => item.status === "In Progress"
  ).length;

  const highPriorityCount = contacts.filter(
    (item) => item.priority === "High"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen lg:ml-64">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="px-6 py-8 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff4054]">
                Management
              </p>

              <h1 className="mt-2 text-4xl font-black text-gray-900">
                Contact Messages
              </h1>

              <p className="mt-2 text-gray-500">
                Manage messages sent through the AutoLux contact form.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchContacts(true)}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#ff4054] px-5 py-3 font-bold text-white transition hover:bg-[#e9364a] disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="font-bold text-red-700">
                Failed to load contact messages
              </p>
              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
              <button
                type="button"
                onClick={() => fetchContacts()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                Total
              </p>
              <p className="mt-2 text-4xl font-black text-gray-900">
                {contacts.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                New
              </p>
              <p className="mt-2 text-4xl font-black text-yellow-600">
                {newCount}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                In Progress
              </p>
              <p className="mt-2 text-4xl font-black text-blue-600">
                {inProgressCount}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                High Priority
              </p>
              <p className="mt-2 text-4xl font-black text-red-600">
                {highPriorityCount}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {loading && contacts.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                Loading contact messages...
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-10 text-center">
                <Mail
                  size={42}
                  className="mx-auto text-gray-300"
                />
                <h2 className="mt-4 text-xl font-black text-gray-900">
                  No Contact Messages
                </h2>
                <p className="mt-2 text-gray-500">
                  New contact form submissions will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[1250px] w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Customer
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Subject
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Car / Contact
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Message
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Date
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Status
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Priority
                      </th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {contacts.map((contact) => {
                      const isLoading =
                        loadingId === contact._id;

                      return (
                        <tr
                          key={contact._id}
                          className="border-t border-gray-100 align-top transition hover:bg-gray-50"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff4054]/10 text-[#ff4054]">
                                <User size={18} />
                              </div>

                              <div>
                                <p className="font-bold text-gray-900">
                                  {contact.name}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {contact.email}
                                </p>
                                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                  <Phone size={12} />
                                  {contact.phone}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="max-w-[230px] px-5 py-5">
                            <p className="font-bold text-gray-900">
                              {contact.subject}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {contact.preferredContact || "Any"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-semibold text-gray-800">
                              {contact.interestedCar || "Not specified"}
                            </p>
                          </td>

                          <td className="max-w-[320px] px-5 py-5">
                            <div className="rounded-xl bg-gray-50 p-3">
                              <p className="line-clamp-4 text-sm leading-6 text-gray-600">
                                {contact.message}
                              </p>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-gray-700">
                            {formatDate(contact.createdAt)}
                          </td>

                          <td className="px-5 py-5">
                            <select
                              value={contact.status}
                              disabled={isLoading}
                              onChange={(e) =>
                                updateContact(
                                  contact._id,
                                  "status",
                                  e.target.value
                                )
                              }
                              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-[#ff4054]"
                            >
                              <option>New</option>
                              <option>In Progress</option>
                              <option>Resolved</option>
                              <option>Closed</option>
                            </select>
                          </td>

                          <td className="px-5 py-5">
                            <select
                              value={contact.priority}
                              disabled={isLoading}
                              onChange={(e) =>
                                updateContact(
                                  contact._id,
                                  "priority",
                                  e.target.value
                                )
                              }
                              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-[#ff4054]"
                            >
                              <option>Low</option>
                              <option>Normal</option>
                              <option>High</option>
                            </select>
                          </td>

                          <td className="px-5 py-5">
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                deleteContact(contact._id)
                              }
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                              title="Delete contact message"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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

export default AdminContactMessages;
