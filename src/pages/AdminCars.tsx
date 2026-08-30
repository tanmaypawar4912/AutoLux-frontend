import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Check,
  X,
  Star,
  PackageCheck,
  RefreshCw,
  ImagePlus,
  CarFront,
} from "lucide-react";

const AVAILABILITY_VALUES = ["Stock", "Reserved", "Sold"] as const;
type AvailabilityValue = (typeof AVAILABILITY_VALUES)[number];

const normalizeAvailability = (value?: string | null): AvailabilityValue => {
  const normalized = String(value || "").trim().toLowerCase();

  if (
    normalized === "reserved" ||
    normalized === "reserve"
  ) {
    return "Reserved";
  }

  if (
    normalized === "sold" ||
    normalized === "sold out" ||
    normalized === "soldout"
  ) {
    return "Sold";
  }

  return "Stock";
};

import { useAuth } from"@clerk/clerk-react";
import { toast } from "sonner";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { API } from "../utils/api";

// =====================================================
// TYPES
// =====================================================

interface Car {
  _id: string;

  sellerName: string;
  sellerEmail: string;

  brand: string;
  model: string;

  year: number;
  price: number;
  kilometers: number;

  fuelType: string;
  transmission: string;

  bodyType: string;
  color: string;
  seats: number;
  owners: number;
  hub: string;
  availability: string;
  carCategory: string;
  safetyFeatures: string[];
  features: string[];

  description: string;
  image: string;

  images?: {
    front?: string;
    back?: string;
    left?: string;
    right?: string;
  };

  city: string;

  views: number;

  status:
    | "pending"
    | "approved"
    | "rejected";

  addedBy:
    | "seller"
    | "admin";

  featured: boolean;
  stock: boolean;

  createdAt: string;
}

interface CarForm {
  sellerName: string;
  sellerEmail: string;

  brand: string;
  model: string;

  year: number;
  price: number;
  kilometers: number;

  fuelType: string;
  transmission: string;

  bodyType: string;
  color: string;
  seats: number;
  owners: number;
  hub: string;
  availability: string;
  carCategory: string;
  safetyFeatures: string[];
  features: string[];

  description: string;
  image: string;

  images: {
    front: string;
    back: string;
    left: string;
    right: string;
  };

  city: string;

  featured: boolean;
  stock: boolean;
}

// =====================================================
// EMPTY FORM
// =====================================================

const emptyForm: CarForm = {
  sellerName: "",
  sellerEmail: "",

  brand: "",
  model: "",

  year: new Date().getFullYear(),
  price: 0,
  kilometers: 0,

  fuelType: "",
  transmission: "",

  bodyType: "",
  color: "",
  seats: 5,
  owners: 1,
  hub: "",
  availability: "Stock",
  carCategory: "",
  safetyFeatures: [],
  features: [],

  description: "",
  image: "",

  images: {
    front: "",
    back: "",
    left: "",
    right: "",
  },

  city: "",

  featured: true,
  stock: true,
};

// =====================================================
// ADMIN CARS
// =====================================================

const AdminCars = () => {
  const {
    isLoaded: authLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  // ===================================================
  // SIDEBAR
  // ===================================================

  const [activeSection, setActiveSection] =
    useState("cars");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // ===================================================
  // CARS
  // ===================================================

  const [cars, setCars] =
    useState<Car[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // SAVE
  // ===================================================

  const [saving, setSaving] =
    useState(false);

  const [loadingId, setLoadingId] =
    useState("");

  // ===================================================
  // CLOUDINARY
  // ===================================================

  const [uploadingImage, setUploadingImage] =
    useState(false);

  // ===================================================
  // SEARCH
  // ===================================================

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [fuelFilter, setFuelFilter] =
    useState("all");

  const [transmissionFilter, setTransmissionFilter] =
    useState("all");

  const [bodyTypeFilter, setBodyTypeFilter] =
    useState("all");

  const [colorFilter, setColorFilter] =
    useState("all");

  const [hubFilter, setHubFilter] =
    useState("all");

  const [availabilityFilter, setAvailabilityFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  // ===================================================
  // DYNAMIC OPTIONS
  // ===================================================

  const [fuelTypes, setFuelTypes] =
    useState<string[]>([]);

  const [transmissions, setTransmissions] =
    useState<string[]>([]);

  const [carOptions, setCarOptions] =
    useState<Record<string, string[]>>({});

  // ===================================================
  // FORM
  // ===================================================

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<CarForm>({
      ...emptyForm,
    });

  // ===================================================
  // PAGINATION
  // ===================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const carsPerPage = 8;

  // ===================================================
  // AUTH HEADERS
  // ===================================================

  const getAuthHeaders = async () => {
    if (!authLoaded) {
      throw new Error(
        "Clerk authentication is still loading."
      );
    }

    if (!isSignedIn) {
      throw new Error(
        "Please login first."
      );
    }

    const token =
      await getToken();

    console.log(
      "ADMIN FRONTEND TOKEN:",
      token
        ? "TOKEN RECEIVED ✅"
        : "TOKEN NOT RECEIVED ❌"
    );

    if (!token) {
      throw new Error(
        "Clerk authentication token not available."
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
  // FETCH ALL CARS
  // ===================================================

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError("");

      const headers =
        await getAuthHeaders();

      const response =
        await fetch(
          `${API}/cars/admin`,
          {
            method: "GET",
            headers,
            credentials: "include",
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
            "Failed to load cars."
        );
      }

      setCars(
        Array.isArray(data.cars)
          ? data.cars
          : []
      );

    } catch (err) {
      console.error(
        "Admin Cars Error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : "Failed to load cars.";

      setError(message);

      toast.error("Failed to load cars.", {
        description: message,
      });

      setCars([]);

    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FETCH DYNAMIC FUEL TYPES + TRANSMISSIONS
  // ===================================================

  const fetchOptions = async () => {
    try {
      const [
        fuelResponse,
        transmissionResponse,
        carOptionsResponse,
      ] = await Promise.all([
        fetch(`${API}/options/fuel-types`),
        fetch(`${API}/options/transmissions`),
        fetch(`${API}/options/car-options`),
      ]);

      const fuelData = await fuelResponse.json();
      const transmissionData = await transmissionResponse.json();
      const carOptionsData = await carOptionsResponse.json();

      // ===============================================
      // FUEL TYPES
      // ===============================================

      if (
        fuelResponse.ok &&
        fuelData.success &&
        Array.isArray(fuelData.fuelTypes)
      ) {
        const names = fuelData.fuelTypes
          .map((item: { name: string }) => item.name)
          .filter((name: string) => Boolean(name?.trim()))
          .map((name: string) => name.trim());

        setFuelTypes(names);
      } else {
        setFuelTypes([]);
      }

      // ===============================================
      // TRANSMISSIONS
      // ===============================================

      if (
        transmissionResponse.ok &&
        transmissionData.success &&
        Array.isArray(transmissionData.transmissions)
      ) {
        const names = transmissionData.transmissions
          .map((item: { name: string }) => item.name)
          .filter((name: string) => Boolean(name?.trim()))
          .map((name: string) => name.trim());

        setTransmissions(names);
      } else {
        setTransmissions([]);
      }

      // ===============================================
      // OTHER CAR OPTIONS
      // ===============================================

      if (
        carOptionsResponse.ok &&
        carOptionsData.success &&
        Array.isArray(carOptionsData.carOptions)
      ) {
        const grouped: Record<string, string[]> = {};

        carOptionsData.carOptions.forEach(
          (item: {
            category: string;
            name: string;
            active?: boolean;
          }) => {
            if (!item?.category || !item?.name?.trim()) {
              return;
            }

            const key = item.category
              .toLowerCase()
              .replace(/[\s_-]/g, "");

            if (!grouped[key]) {
              grouped[key] = [];
            }

            if (!grouped[key].includes(item.name.trim())) {
              grouped[key].push(item.name.trim());
            }
          }
        );

        Object.keys(grouped).forEach((key) => {
          grouped[key].sort((a, b) => a.localeCompare(b));
        });

        setCarOptions(grouped);
      } else {
        setCarOptions({});
      }
    } catch (error) {
      console.error("Dynamic Options Error:", error);

      setFuelTypes([]);
      setTransmissions([]);
      setCarOptions({});

      toast.error("Failed to load car options.", {
        description:
          "Fuel types, transmissions and vehicle options could not be loaded.",
      });
    }
  };

  const getCarOptionList = (category: string) => {
    const key = category
      .toLowerCase()
      .replace(/[\s_-]/g, "");

    return carOptions[key] || [];
  };

  // Admin Settings uses labels such as "5 Seats" and "1st Owner",
  // but the Car schema stores these values as numbers.
  // Keep the existing labels in the UI and use only the leading
  // number as the actual <select> value.
  const getNumericOptionValue = (option: string) => {
    const match = String(option).trim().match(/^(\d+)/);
    return match ? match[1] : "";
  };

  const getNumericCarOptionList = (category: string) => {
    return getCarOptionList(category).filter(
      (option) => getNumericOptionValue(option) !== ""
    );
  };

  // ===================================================
  // AVAILABILITY OPTIONS
  // ===================================================

  const getAvailabilityOptions = () => {
    const dynamicOptions = getCarOptionList("availability");

    return Array.from(
      new Set([
        ...AVAILABILITY_VALUES,
        ...dynamicOptions,
      ])
    );
  };

  const getAvailabilityStyle = (value?: string) => {
    switch (normalizeAvailability(value)) {
      case "Sold":
        return "bg-red-100 text-red-700 border-red-200";
      case "Reserved":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Stock":
      default:
        return "bg-green-100 text-green-700 border-green-200";
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

    fetchCars();
    fetchOptions();

  }, [
    authLoaded,
    isSignedIn,
    getToken,
  ]);

  // ===================================================
  // RESET PAGE
  // ===================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    fuelFilter,
    transmissionFilter,
    bodyTypeFilter,
    colorFilter,
    hubFilter,
    availabilityFilter,
    categoryFilter,
  ]);

  // ===================================================
  // STATISTICS
  // ===================================================

  const totalCars =
    cars.length;

  const approvedCars =
    cars.filter(
      (car) =>
        car.status ===
        "approved"
    ).length;

  const pendingCars =
    cars.filter(
      (car) =>
        car.status ===
        "pending"
    ).length;

  const rejectedCars =
    cars.filter(
      (car) =>
        car.status ===
        "rejected"
    ).length;

  const stockCars = cars.filter(
    (car) => normalizeAvailability(car.availability) === "Stock"
  ).length;

  const reservedCars = cars.filter(
    (car) => normalizeAvailability(car.availability) === "Reserved"
  ).length;

  const soldCars = cars.filter(
    (car) => normalizeAvailability(car.availability) === "Sold"
  ).length;

  // ===================================================
  // FILTER CARS
  // ===================================================

  const filteredCars =
    cars.filter(
      (car) => {
        const searchText =
          search
            .trim()
            .toLowerCase();

        const matchesSearch =
          !searchText ||
          `${car.brand} ${car.model}`
            .toLowerCase()
            .includes(
              searchText
            ) ||
          car.city
            ?.toLowerCase()
            .includes(
              searchText
            ) ||
          car.sellerName
            ?.toLowerCase()
            .includes(
              searchText
            ) ||
          car.sellerEmail
            ?.toLowerCase()
            .includes(
              searchText
            );

        const matchesStatus =
          statusFilter ===
            "all" ||
          car.status ===
            statusFilter;

        const matchesFuelType =
          fuelFilter ===
            "all" ||
          car.fuelType ===
            fuelFilter;

        const matchesTransmission =
          transmissionFilter ===
            "all" ||
          car.transmission ===
            transmissionFilter;

        const matchesBodyType =
          bodyTypeFilter === "all" ||
          car.bodyType === bodyTypeFilter;

        const matchesColor =
          colorFilter === "all" ||
          car.color === colorFilter;

        const matchesHub =
          hubFilter === "all" ||
          car.hub === hubFilter;

        const matchesAvailability =
          availabilityFilter === "all" ||
          normalizeAvailability(car.availability) ===
            normalizeAvailability(availabilityFilter);

        const matchesCategory =
          categoryFilter === "all" ||
          car.carCategory === categoryFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesFuelType &&
          matchesTransmission &&
          matchesBodyType &&
          matchesColor &&
          matchesHub &&
          matchesAvailability &&
          matchesCategory
        );
      }
    );

  // ===================================================
  // PAGINATION
  // ===================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredCars.length /
          carsPerPage
      )
    );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );

  const startIndex =
    (safeCurrentPage - 1) *
      carsPerPage;

  const currentCars =
    filteredCars.slice(
      startIndex,
      startIndex +
        carsPerPage
    );

  // ===================================================
  // CLOUDINARY UPLOAD
  // ===================================================

  type ImagePosition =
    | "front"
    | "back"
    | "left"
    | "right";

  const uploadImage = async (
    event: ChangeEvent<HTMLInputElement>,
    position: ImagePosition
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      const cloudName =
        import.meta.env
          .VITE_CLOUD_NAME;

      const uploadPreset =
        import.meta.env
          .VITE_UPLOAD_PRESET;

      if (
        !cloudName ||
        !uploadPreset
      ) {
        throw new Error(
          "Cloudinary configuration is missing."
        );
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "upload_preset",
        uploadPreset
      );

      const response =
        await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.secure_url
      ) {
        throw new Error(
          data.error?.message ||
            "Image upload failed."
        );
      }

      setForm(
        (previous) => ({
          ...previous,

          image:
            position === "front"
              ? data.secure_url
              : previous.image,

          images: {
            ...previous.images,
            [position]:
              data.secure_url,
          },
        })
      );

      toast.success("Image uploaded successfully.", {
        description: `${position.charAt(0).toUpperCase() + position.slice(1)} view is ready.`,
      });

    } catch (err) {
      console.error(
        "Cloudinary Error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : "Failed to upload image.";

      setError(message);

      toast.error("Image upload failed.", {
        description: message,
      });

    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  // ===================================================
  // REMOVE IMAGE
  // ===================================================

  const removeImage = (
    position: ImagePosition
  ) => {
    setForm(
      (previous) => ({
        ...previous,

        image:
          position === "front"
            ? ""
            : previous.image,

        images: {
          ...previous.images,
          [position]: "",
        },
      })
    );
  };

  // ===================================================
  // FORM CHANGE
  // ===================================================

  const handleChange = (
    event:
      ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
      >
  ) => {
    const {
      name,
      value,
      type,
    } = event.target;

    const checked =
      "checked" in
        event.target
        ? event.target.checked
        : false;

    setForm(
      (previous) => ({
        ...previous,

        [name]:
          type === "number"
            ? Number(value)
            : type === "checkbox"
              ? checked
              : value,
      })
    );
  };

  // ===================================================
  // OPEN ADD FORM
  // ===================================================

  const openAddForm = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      images: {
        ...emptyForm.images,
      },
    });

    setError("");
    setShowForm(true);

    // Refresh options whenever Add Car opens
    fetchOptions();
  };

  // ===================================================
  // OPEN EDIT FORM
  // ===================================================

  const openEditForm = (
    car: Car
  ) => {
    setEditingId(
      car._id
    );

    setForm({
      sellerName:
        car.sellerName || "",

      sellerEmail:
        car.sellerEmail || "",

      brand:
        car.brand || "",

      model:
        car.model || "",

      year:
        car.year ||
        new Date().getFullYear(),

      price:
        car.price || 0,

      kilometers:
        car.kilometers || 0,

      fuelType:
        car.fuelType || "",

      transmission:
        car.transmission || "",

      bodyType:
        car.bodyType || "",

      color:
        car.color || "",

      seats:
        Number(car.seats) || 5,

      owners:
        Number(car.owners) || 1,

      hub:
        car.hub || "",

      availability:
        normalizeAvailability(car.availability),

      carCategory:
        car.carCategory || "",

      safetyFeatures:
        Array.isArray(car.safetyFeatures)
          ? car.safetyFeatures
          : [],

      features:
        Array.isArray(car.features)
          ? car.features
          : [],

      description:
        car.description || "",

      image:
        car.images?.front ||
        car.image ||
        "",

      images: {
        front:
          car.images?.front ||
          car.image ||
          "",

        back:
          car.images?.back ||
          "",

        left:
          car.images?.left ||
          "",

        right:
          car.images?.right ||
          "",
      },

      city:
        car.city || "",

      featured:
        Boolean(
          car.featured
        ),

      stock:
        Boolean(
          car.stock
        ),
    });

    setError("");
    setShowForm(true);

    // Refresh options whenever Edit opens
    fetchOptions();
  };

  // ===================================================
  // CLOSE FORM
  // ===================================================

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);

    setForm({
      ...emptyForm,
      images: {
        ...emptyForm.images,
      },
    });
  };

  // ===================================================
  // SAVE CAR
  // ===================================================

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (
      !form.fuelType ||
      !form.transmission ||
      !form.images.front ||
      !form.images.back ||
      !form.images.left ||
      !form.images.right ||
      !form.bodyType ||
      !form.color ||
      !form.hub ||
      !form.availability ||
      !form.carCategory
    ) {
      toast.warning("Complete the car details first.", {
        description:
          "Select all required vehicle options and upload all 4 car photos.",
      });
      return;
    }

    try {
      setSaving(true);
      setError("");

      const headers =
        await getAuthHeaders();

      const url =
        editingId
          ? `${API}/cars/${editingId}`
          : `${API}/cars/admin`;

      const method =
        editingId
          ? "PUT"
          : "POST";

      const response =
        await fetch(
          url,
          {
            method,
            headers,

            credentials:
              "include",

            body:
              JSON.stringify({
                ...form,

                year:
                  Number(
                    form.year
                  ),

                price:
                  Number(
                    form.price
                  ),

                kilometers:
                  Number(
                    form.kilometers
                  ),

                seats:
                  Number(form.seats),

                owners:
                  Number(form.owners),

                addedBy:
                  "admin",

                availability:
                  normalizeAvailability(form.availability),

                // Keep the legacy boolean stock field in sync
                // with the new availability authority.
                stock:
                  normalizeAvailability(form.availability) ===
                  "Stock",

                image:
                  form.images.front ||
                  form.image ||
                  "",

                images: {
                  front:
                    form.images.front ||
                    form.image ||
                    "",

                  back:
                    form.images.back ||
                    "",

                  left:
                    form.images.left ||
                    "",

                  right:
                    form.images.right ||
                    "",
                },
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
            "Failed to save car."
        );
      }

      closeForm();

      await fetchCars();
      await fetchOptions();

      toast.success(
        editingId
          ? "Car updated successfully! 🚗"
          : "Car added successfully! 🚗",
        {
          description: editingId
            ? "The car details have been updated."
            : "The new car has been added to your database.",
        }
      );

    } catch (err) {
      console.error(
        "Save Car Error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : "Failed to save car.";

      setError(message);

      toast.error(
        editingId
          ? "Failed to update car."
          : "Failed to add car.",
        {
          description: message,
        }
      );

    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // UPDATE CAR
  // ===================================================

  const updateCar = async (
    id: string,
    payload: Partial<Car>
  ) => {
    try {
      setLoadingId(id);

      const headers =
        await getAuthHeaders();

      const response =
        await fetch(
          `${API}/cars/${id}/status`,
          {
            method: "PUT",

            headers,

            credentials:
              "include",

            body:
              JSON.stringify(
                payload
              ),
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
            "Failed to update car."
        );
      }

      setCars(
        (previous) =>
          previous.map(
            (car) =>
              car._id === id
                ? data.car
                : car
          )
      );

      if (payload.status === "approved") {
        toast.success("Car approved successfully! 🚗");
      } else if (payload.status === "rejected") {
        toast.success("Car rejected successfully.");
      } else if (payload.featured !== undefined) {
        toast.success(
          payload.featured
            ? "Car marked as featured."
            : "Car removed from featured."
        );
      } else if (payload.availability !== undefined) {
        toast.success(
          `Car availability changed to ${normalizeAvailability(
            String(payload.availability)
          )}.`
        );
      } else if (payload.stock !== undefined) {
        toast.success(
          payload.stock
            ? "Car marked as in stock."
            : "Car marked as out of stock."
        );
      } else {
        toast.success("Car updated successfully.");
      }

    } catch (err) {
      console.error(
        "Update Car Error:",
        err
      );

      toast.error("Failed to update car.", {
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong.",
      });

    } finally {
      setLoadingId("");
    }
  };

  // ===================================================
  // QUICK AVAILABILITY CONTROL
  // ===================================================

  const updateAvailability = async (
    id: string,
    value: AvailabilityValue
  ) => {
    await updateCar(id, {
      availability: value,
      // Keep the old boolean stock field compatible with
      // existing frontend/backend logic.
      stock: value === "Stock",
    });
  };

  // ===================================================
  // DELETE CAR
  // ===================================================

  const deleteCar = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this car?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoadingId(id);

      const headers =
        await getAuthHeaders();

      const response =
        await fetch(
          `${API}/cars/${id}`,
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
            "Failed to delete car."
        );
      }

      setCars(
        (previous) =>
          previous.filter(
            (car) =>
              car._id !== id
          )
      );

      toast.success("Car deleted successfully! 🗑️", {
        description: "The car has been removed from the dealership.",
      });

    } catch (err) {
      console.error(
        "Delete Car Error:",
        err
      );

      toast.error("Failed to delete car.", {
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong.",
      });

    } finally {
      setLoadingId("");
    }
  };

  // ===================================================
  // RESET FILTER
  // ===================================================

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setFuelFilter("all");
    setTransmissionFilter("all");
    setBodyTypeFilter("all");
    setColorFilter("all");
    setHubFilter("all");
    setAvailabilityFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  // ===================================================
  // STATUS STYLE
  // ===================================================

  const getStatusStyle = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ===================================================
  // AUTH LOADING
  // ===================================================

  if (!authLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="font-bold text-gray-700">
          Loading Admin Panel...
        </p>
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">

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
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />


      <main className="min-h-screen lg:ml-64">

        <div className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          {/* HEADER */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff4054]">
                Management
              </p>

              <h1 className="mt-1 text-3xl font-black text-gray-900 sm:text-4xl">
                Cars
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage all vehicles
                from your database.
              </p>
            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={async () => {
                  try {
                    await Promise.all([
                      fetchCars(),
                      fetchOptions(),
                    ]);
                    toast.success("Car data refreshed.");
                  } catch {
                    toast.error("Refresh failed.");
                  }
                }}
                disabled={loading}
                className="
                  flex
                  items-center
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
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>

              <button
                type="button"
                onClick={
                  openAddForm
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#ff4054]
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-[#ff4054]/20
                  hover:bg-[#e9364a]
                "
              >
                <Plus size={17} />
                Add Car
              </button>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              <span>
                {error}
              </span>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* STATS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <CarStat
              label="Total"
              value={totalCars}
              icon={
                <CarFront size={20} />
              }
              className="bg-gray-100 text-gray-700"
            />

            <CarStat
              label="Approved"
              value={approvedCars}
              icon={
                <Check size={20} />
              }
              className="bg-green-50 text-green-600"
            />

            <CarStat
              label="Pending"
              value={pendingCars}
              icon={
                <RefreshCw size={20} />
              }
              className="bg-yellow-50 text-yellow-600"
            />

            <CarStat
              label="Rejected"
              value={rejectedCars}
              icon={
                <X size={20} />
              }
              className="bg-red-50 text-red-600"
            />

          </div>

          {/* AVAILABILITY SUMMARY */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <AvailabilityStat
              label="In Stock"
              value={stockCars}
              className="bg-green-50 text-green-600"
            />
            <AvailabilityStat
              label="Reserved"
              value={reservedCars}
              className="bg-yellow-50 text-yellow-600"
            />
            <AvailabilityStat
              label="Sold"
              value={soldCars}
              className="bg-red-50 text-red-600"
            />
          </div>

          {/* SEARCH + FILTER */}

          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">

              <div className="relative lg:col-span-2">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search by brand, model, city or seller..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    py-3
                    pl-11
                    pr-4
                    text-sm
                    outline-none
                    focus:border-[#ff4054]
                    focus:ring-2
                    focus:ring-[#ff4054]/10
                  "
                />

              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  outline-none
                  focus:border-[#ff4054]
                "
              >
                <option value="all">
                  All Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="approved">
                  Approved
                </option>

                <option value="rejected">
                  Rejected
                </option>
              </select>

              {/* DYNAMIC FUEL */}

              <select
                value={fuelFilter}
                onChange={(event) =>
                  setFuelFilter(
                    event.target.value
                  )
                }
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  outline-none
                  focus:border-[#ff4054]
                  focus:ring-2
                  focus:ring-[#ff4054]/10
                "
              >
                <option value="all">
                  All Fuel Types
                </option>

                {fuelTypes.map(
                  (fuelType) => (
                    <option
                      key={fuelType}
                      value={fuelType}
                    >
                      {fuelType}
                    </option>
                  )
                )}
              </select>

              {/* DYNAMIC TRANSMISSION */}

              <select
                value={
                  transmissionFilter
                }
                onChange={(event) =>
                  setTransmissionFilter(
                    event.target.value
                  )
                }
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  outline-none
                  focus:border-[#ff4054]
                  focus:ring-2
                  focus:ring-[#ff4054]/10
                "
              >
                <option value="all">
                  All Transmissions
                </option>

                {transmissions.map(
                  (transmission) => (
                    <option
                      key={transmission}
                      value={transmission}
                    >
                      {transmission}
                    </option>
                  )
                )}
              </select>

              <select
                value={bodyTypeFilter}
                onChange={(event) =>
                  setBodyTypeFilter(event.target.value)
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#ff4054]"
              >
                <option value="all">All Body Types</option>
                {getCarOptionList("bodyType").map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <select
                value={colorFilter}
                onChange={(event) =>
                  setColorFilter(event.target.value)
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#ff4054]"
              >
                <option value="all">All Colors</option>
                {getCarOptionList("color").map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <select
                value={hubFilter}
                onChange={(event) =>
                  setHubFilter(event.target.value)
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#ff4054]"
              >
                <option value="all">All Hubs</option>
                {getCarOptionList("hub").map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <select
                value={availabilityFilter}
                onChange={(event) =>
                  setAvailabilityFilter(event.target.value)
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#ff4054]"
              >
                <option value="all">All Availability</option>
                {getAvailabilityOptions().map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#ff4054]"
              >
                <option value="all">All Categories</option>
                {getCarOptionList("carCategory").map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={resetFilters}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-gray-600
                  hover:border-[#ff4054]
                  hover:bg-[#fff7f8]
                  hover:text-[#ff4054]
                "
              >
                Reset
              </button>

            </div>

            <div className="mt-3 text-xs text-gray-400">
              Fuel Type, Transmission, Body Type, Color, Hub, Availability and Category are loaded dynamically from MongoDB.
            </div>

          </div>

          {/* TABLE */}

          <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">

                <div className="text-center">

                  <RefreshCw
                    size={30}
                    className="mx-auto animate-spin text-[#ff4054]"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-500">
                    Loading cars
                    from MongoDB...
                  </p>

                </div>

              </div>
            ) : currentCars.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <CarFront size={28} />
                </div>

                <h2 className="mt-4 text-xl font-black text-gray-900">
                  No cars found
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new car
                  or change your
                  filters.
                </p>

              </div>
            ) : (
              <div className="w-full overflow-x-auto">

                <table className="w-full min-w-[1040px]">

                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Car
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Details
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Price
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Controls
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {currentCars.map(
                      (car) => (
                        <tr
                          key={
                            car._id
                          }
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                        >

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-4">

                              {car.image ? (
                                <img
                                  src={
                                    car.image
                                  }
                                  alt={`${car.brand} ${car.model}`}
                                  className="h-16 w-24 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                                  <CarFront
                                    size={22}
                                  />
                                </div>
                              )}

                              <div className="min-w-0">

                                <p className="font-black text-gray-900">
                                  {
                                    car.brand
                                  }{" "}
                                  {
                                    car.model
                                  }
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {
                                    car.year
                                  }{" "}
                                  •{" "}
                                  {
                                    car.city ||
                                    "No city"
                                  }
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-5">

                            <p className="text-sm font-semibold text-gray-700">
                              {
                                car.fuelType
                              }
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {
                                car.transmission
                              }{" "}
                              •{" "}
                              {Number(
                                car.kilometers
                              ).toLocaleString(
                                "en-IN"
                              )}{" "}
                              km
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {car.bodyType || "Body type not set"} •{" "}
                              {car.color || "Color not set"}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Seller:{" "}
                              {
                                car.sellerName
                              }
                            </p>

                          </td>

                          <td className="px-5 py-5">

                            <p className="font-black text-gray-900">
                              ₹
                              {Number(
                                car.price
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </td>

                          <td className="px-5 py-5">

                            <span
                              className={`
                                inline-flex
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-bold
                                uppercase
                                ${getStatusStyle(
                                  car.status
                                )}
                              `}
                            >
                              {
                                car.status
                              }
                            </span>

                            <span
                              className={`mt-2 inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${getAvailabilityStyle(
                                car.availability
                              )}`}
                            >
                              {normalizeAvailability(
                                car.availability
                              )}
                            </span>

                          </td>

                          <td className="px-5 py-5">

                            <div className="flex gap-2">

                              <button
                                type="button"
                                title="Approve"
                                disabled={
                                  loadingId ===
                                  car._id
                                }
                                onClick={() =>
                                  updateCar(
                                    car._id,
                                    {
                                      status:
                                        "approved",
                                    }
                                  )
                                }
                                className={`
                                  rounded-lg
                                  p-2
                                  ${
                                    car.status ===
                                    "approved"
                                      ? "bg-green-500 text-white"
                                      : "bg-green-50 text-green-600 hover:bg-green-100"
                                  }
                                  disabled:opacity-50
                                `}
                              >
                                <Check
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                title="Reject"
                                disabled={
                                  loadingId ===
                                  car._id
                                }
                                onClick={() =>
                                  updateCar(
                                    car._id,
                                    {
                                      status:
                                        "rejected",
                                    }
                                  )
                                }
                                className={`
                                  rounded-lg
                                  p-2
                                  ${
                                    car.status ===
                                    "rejected"
                                      ? "bg-red-500 text-white"
                                      : "bg-red-50 text-red-600 hover:bg-red-100"
                                  }
                                  disabled:opacity-50
                                `}
                              >
                                <X
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                title="Toggle Featured"
                                disabled={
                                  loadingId ===
                                  car._id
                                }
                                onClick={() =>
                                  updateCar(
                                    car._id,
                                    {
                                      featured:
                                        !car.featured,
                                    }
                                  )
                                }
                                className={`
                                  rounded-lg
                                  p-2
                                  ${
                                    car.featured
                                      ? "bg-yellow-100 text-yellow-600"
                                      : "bg-gray-100 text-gray-400"
                                  }
                                `}
                              >
                                <Star
                                  size={16}
                                  fill={
                                    car.featured
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              </button>

                              <div className="relative">
                                <select
                                  value={normalizeAvailability(
                                    car.availability
                                  )}
                                  disabled={
                                    loadingId ===
                                    car._id
                                  }
                                  onChange={(event) =>
                                    updateAvailability(
                                      car._id,
                                      event.target.value as AvailabilityValue
                                    )
                                  }
                                  title="Change car availability"
                                  className={`
                                    h-9
                                    min-w-[92px]
                                    appearance-none
                                    rounded-lg
                                    border
                                    px-2.5
                                    pr-7
                                    text-[11px]
                                    font-black
                                    outline-none
                                    transition
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    ${getAvailabilityStyle(
                                      car.availability
                                    )}
                                  `}
                                >
                                  {getAvailabilityOptions().map(
                                    (option) => (
                                      <option
                                        key={option}
                                        value={option}
                                      >
                                        {option}
                                      </option>
                                    )
                                  )}
                                </select>

                                <PackageCheck
                                  size={13}
                                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                                />
                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-5">

                            <div className="flex gap-2">

                              <button
                                type="button"
                                title="Edit"
                                onClick={() =>
                                  openEditForm(
                                    car
                                  )
                                }
                                className="rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                              >
                                <Pencil
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                title="Delete"
                                disabled={
                                  loadingId ===
                                  car._id
                                }
                                onClick={() =>
                                  deleteCar(
                                    car._id
                                  )
                                }
                                className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

          {/* PAGINATION */}

          {filteredCars.length > 0 && (
            <div className="mt-5 flex flex-col items-center gap-3 pb-6">

              <p className="text-sm text-gray-500">
                Showing{" "}
                {startIndex + 1}{" "}
                to{" "}
                {Math.min(
                  startIndex +
                    carsPerPage,
                  filteredCars.length
                )}{" "}
                of{" "}
                {filteredCars.length}{" "}
                cars
              </p>

              <div className="flex items-center justify-center gap-2">

                <button
                  type="button"
                  disabled={
                    safeCurrentPage ===
                    1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                  className="
                    rounded-lg
                    bg-gray-800
                    px-4
                    py-2
                    text-sm
                    font-bold
                    text-white
                    hover:bg-gray-700
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Previous
                </button>

                <span className="
                  rounded-lg
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-gray-700
                  shadow-sm
                ">
                  {safeCurrentPage} /{" "}
                  {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    safeCurrentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                  className="
                    rounded-lg
                    bg-[#ff4054]
                    px-4
                    py-2
                    text-sm
                    font-bold
                    text-white
                    hover:bg-[#e9364a]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Next
                </button>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showForm && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">

          <div className="mx-auto my-8 w-full max-w-4xl rounded-3xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-7">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff4054]">
                  Car Management
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-900">
                  {editingId
                    ? "Edit Car"
                    : "Add New Car"}
                </h2>

              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                disabled={
                  saving
                }
                className="rounded-xl bg-gray-100 p-2.5 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="p-5 sm:p-7"
            >

              <div className="grid gap-5 md:grid-cols-2">

                <FormField
                  label="Seller Name"
                  name="sellerName"
                  value={
                    form.sellerName
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <FormField
                  label="Seller Email"
                  name="sellerEmail"
                  type="email"
                  value={
                    form.sellerEmail
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <FormField
                  label="Brand"
                  name="brand"
                  value={
                    form.brand
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <FormField
                  label="Model"
                  name="model"
                  value={
                    form.model
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <FormField
                  label="Year"
                  name="year"
                  type="number"
                  value={
                    form.year
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <FormField
                  label="Price"
                  name="price"
                  type="number"
                  value={
                    form.price
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <FormField
                  label="Kilometers"
                  name="kilometers"
                  type="number"
                  value={
                    form.kilometers
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <FormField
                  label="City"
                  name="city"
                  value={
                    form.city
                  }
                  onChange={
                    handleChange
                  }
                />

                {/* DYNAMIC FUEL TYPE */}

                <SelectField
                  label="Fuel Type"
                  name="fuelType"
                  value={
                    form.fuelType
                  }
                  onChange={
                    handleChange
                  }
                  options={
                    form.fuelType &&
                    !fuelTypes.includes(
                      form.fuelType
                    )
                      ? [
                          form.fuelType,
                          ...fuelTypes,
                        ]
                      : fuelTypes
                  }
                  placeholder="Select Fuel Type"
                  required
                />

                {/* DYNAMIC TRANSMISSION */}

                <SelectField
                  label="Transmission"
                  name="transmission"
                  value={
                    form.transmission
                  }
                  onChange={
                    handleChange
                  }
                  options={
                    form.transmission &&
                    !transmissions.includes(
                      form.transmission
                    )
                      ? [
                          form.transmission,
                          ...transmissions,
                        ]
                      : transmissions
                  }
                  placeholder="Select Transmission"
                  required
                />

                <SelectField
                  label="Body Type"
                  name="bodyType"
                  value={form.bodyType}
                  onChange={handleChange}
                  options={
                    form.bodyType !== undefined &&
                    String(form.bodyType) !== "" &&
                    !getCarOptionList("bodyType").includes(String(form.bodyType))
                      ? [String(form.bodyType), ...getCarOptionList("bodyType")]
                      : getCarOptionList("bodyType")
                  }
                  placeholder="Select Body Type"
                  required
                />

                <SelectField
                  label="Color"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  options={
                    form.color !== undefined &&
                    String(form.color) !== "" &&
                    !getCarOptionList("color").includes(String(form.color))
                      ? [String(form.color), ...getCarOptionList("color")]
                      : getCarOptionList("color")
                  }
                  placeholder="Select Color"
                  required
                />

                <SelectField
                  label="Hub"
                  name="hub"
                  value={form.hub}
                  onChange={handleChange}
                  options={
                    form.hub !== undefined &&
                    String(form.hub) !== "" &&
                    !getCarOptionList("hub").includes(String(form.hub))
                      ? [String(form.hub), ...getCarOptionList("hub")]
                      : getCarOptionList("hub")
                  }
                  placeholder="Select AutoLux Hub"
                  required
                />

                <SelectField
                  label="Availability"
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  options={getAvailabilityOptions()}
                  placeholder="Select Availability"
                  required
                />

                <SelectField
                  label="Car Category"
                  name="carCategory"
                  value={form.carCategory}
                  onChange={handleChange}
                  options={
                    form.carCategory !== undefined &&
                    String(form.carCategory) !== "" &&
                    !getCarOptionList("carCategory").includes(String(form.carCategory))
                      ? [String(form.carCategory), ...getCarOptionList("carCategory")]
                      : getCarOptionList("carCategory")
                  }
                  placeholder="Select Car Category"
                  required
                />

                <SelectField
                  label="Seats"
                  name="seats"
                  value={String(form.seats)}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      seats: Number(
                        getNumericOptionValue(event.target.value)
                      ),
                    }))
                  }
                  options={getNumericCarOptionList("seats")}
                  getOptionValue={getNumericOptionValue}
                  placeholder="Select Seats"
                  required
                />

                <SelectField
                  label="Owners"
                  name="owners"
                  value={String(form.owners)}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      owners: Number(
                        getNumericOptionValue(event.target.value)
                      ),
                    }))
                  }
                  options={getNumericCarOptionList("owners")}
                  getOptionValue={getNumericOptionValue}
                  placeholder="Select Owners"
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={5}
                  required
                  placeholder="Enter car description..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-[#ff4054]
                  "
                />

              </div>

              {/* CAR PHOTOS */}

              <div className="mt-5">

                <div className="mb-2 flex items-center justify-between gap-3">

                  <div>
                    <label className="block text-sm font-bold text-gray-700">
                      Car Photos
                    </label>

                    <p className="mt-1 text-xs text-gray-400">
                      Upload 4 photos: Front, Back, Left Side and Right Side.
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                    4 Photos
                  </span>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <CarImageUpload
                    label="1. Front View"
                    value={
                      form.images.front
                    }
                    onUpload={(event) =>
                      uploadImage(
                        event,
                        "front"
                      )
                    }
                    onRemove={() =>
                      removeImage(
                        "front"
                      )
                    }
                    uploading={
                      uploadingImage
                    }
                  />

                  <CarImageUpload
                    label="2. Back View"
                    value={
                      form.images.back
                    }
                    onUpload={(event) =>
                      uploadImage(
                        event,
                        "back"
                      )
                    }
                    onRemove={() =>
                      removeImage(
                        "back"
                      )
                    }
                    uploading={
                      uploadingImage
                    }
                  />

                  <CarImageUpload
                    label="3. Left Side View"
                    value={
                      form.images.left
                    }
                    onUpload={(event) =>
                      uploadImage(
                        event,
                        "left"
                      )
                    }
                    onRemove={() =>
                      removeImage(
                        "left"
                      )
                    }
                    uploading={
                      uploadingImage
                    }
                  />

                  <CarImageUpload
                    label="4. Right Side View"
                    value={
                      form.images.right
                    }
                    onUpload={(event) =>
                      uploadImage(
                        event,
                        "right"
                      )
                    }
                    onRemove={() =>
                      removeImage(
                        "right"
                      )
                    }
                    uploading={
                      uploadingImage
                    }
                  />

                </div>

              </div>

              {/* CHECKBOXES */}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">

                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      form.featured
                    }
                    onChange={
                      handleChange
                    }
                    className="h-5 w-5 accent-[#ff4054]"
                  />

                  <div>

                    <p className="font-bold text-gray-800">
                      Featured Car
                    </p>

                    <p className="text-xs text-gray-500">
                      Show this car
                      as featured.
                    </p>

                  </div>

                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">

                  <PackageCheck
                    size={22}
                    className="text-[#ff4054]"
                  />

                  <div>

                    <p className="font-bold text-gray-800">
                      Availability Authority
                    </p>

                    <p className="text-xs text-gray-500">
                      Stock, Reserved or Sold is controlled by the
                      Availability field above. The legacy stock flag
                      is synced automatically.
                    </p>

                  </div>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  disabled={
                    saving
                  }
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    px-6
                    py-3
                    font-bold
                    text-gray-700
                    hover:bg-gray-50
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    uploadingImage ||
                    !form.images.front ||
                    !form.images.back ||
                    !form.images.left ||
                    !form.images.right ||
                    !form.fuelType ||
                    !form.transmission ||
                    !form.bodyType ||
                    !form.color ||
                    !form.hub ||
                    !form.availability ||
                    !form.carCategory
                  }
                  className="
                    rounded-xl
                    bg-[#ff4054]
                    px-7
                    py-3
                    font-bold
                    text-white
                    hover:bg-[#e9364a]
                    disabled:opacity-50
                  "
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Car"
                      : "Add Car"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

// =====================================================
// CAR IMAGE UPLOAD
// =====================================================

interface CarImageUploadProps {
  label: string;
  value: string;
  onUpload: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onRemove: () => void;
  uploading: boolean;
}

const CarImageUpload = ({
  label,
  value,
  onUpload,
  onRemove,
  uploading,
}: CarImageUploadProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">

      <div className="mb-3 flex items-center justify-between gap-2">

        <p className="text-sm font-bold text-gray-700">
          {label}
        </p>

        {value && (
          <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase text-green-700">
            Uploaded
          </span>
        )}

      </div>

      {value ? (
        <div className="relative overflow-hidden rounded-xl bg-white">

          <img
            src={value}
            alt={label}
            className="h-44 w-full object-cover"
          />

          <button
            type="button"
            onClick={onRemove}
            disabled={uploading}
            className="absolute right-2 top-2 rounded-lg bg-red-500 p-2 text-white shadow-lg hover:bg-red-600 disabled:opacity-50"
          >
            <X size={16} />
          </button>

        </div>
      ) : (
        <label className="flex min-h-[176px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white px-4 text-center hover:border-[#ff4054] hover:bg-[#fff7f8]">

          <ImagePlus
            size={30}
            className="text-gray-400"
          />

          <p className="mt-3 text-sm font-bold text-gray-700">
            Click to upload
          </p>

          <p className="mt-1 text-xs text-gray-400">
            PNG, JPG or WEBP
          </p>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onUpload}
            disabled={uploading}
            className="hidden"
          />

        </label>
      )}

    </div>
  );
};

// =====================================================
// FORM FIELD
// =====================================================

interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  required?: boolean;

  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}

const FormField = ({
  label,
  name,
  value,
  type = "text",
  required = false,
  onChange,
}: FormFieldProps) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full
          rounded-xl
          border
          border-gray-200
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

    </div>
  );
};

// =====================================================
// SELECT FIELD
// =====================================================

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  getOptionValue?: (option: string) => string;
  placeholder: string;
  required?: boolean;

  onChange: (
    event: ChangeEvent<HTMLSelectElement>
  ) => void;
}

const SelectField = ({
  label,
  name,
  value,
  options,
  getOptionValue,
  placeholder,
  required = false,
  onChange,
}: SelectFieldProps) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full
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
      >

        <option value="">
          {placeholder}
        </option>

        {options.map(
          (option) => (
            <option
              key={option}
              value={
                getOptionValue
                  ? getOptionValue(option)
                  : option
              }
            >
              {option}
            </option>
          )
        )}

      </select>

    </div>
  );
};

// =====================================================
 // AVAILABILITY STAT
 // =====================================================

 interface AvailabilityStatProps {
   label: string;
   value: number;
   className: string;
 }

 const AvailabilityStat = ({
   label,
   value,
   className,
 }: AvailabilityStatProps) => {
   return (
     <div className="rounded-2xl bg-white p-4 shadow-sm">
       <div className="flex items-center justify-between">
         <div>
           <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
             {label}
           </p>
           <p className="mt-1 text-2xl font-black text-gray-900">
             {value.toLocaleString("en-IN")}
           </p>
         </div>

         <div
           className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
         >
           <PackageCheck size={19} />
         </div>
       </div>
     </div>
   );
 };

 // =====================================================
// STAT CARD
// =====================================================

interface CarStatProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  className: string;
}

const CarStat = ({
  label,
  value,
  icon,
  className,
}: CarStatProps) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-gray-900">
            {value.toLocaleString(
              "en-IN"
            )}
          </p>

        </div>

        <div
          className={`
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            ${className}
          `}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default AdminCars;