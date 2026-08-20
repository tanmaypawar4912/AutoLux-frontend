import { useEffect, useRef, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

import Reveal from "../components/Reveal";
import { API } from "../utils/api";

// =====================================================
// STEPS
// =====================================================

const STEPS = [
  "Vehicle Details",
  "Photos & Description",
];

// =====================================================
// TYPES
// =====================================================

type CarImages = {
  front: string;
  back: string;
  left: string;
  right: string;
};

type UploadingState = {
  front: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
};

type DynamicOptions = {
  fuelTypes: string[];
  transmissions: string[];
  bodyTypes: string[];
  colors: string[];
  seats: string[];
  owners: string[];
  hubs: string[];
  carCategories: string[];
};

type CarOption = {
  category?: unknown;
  name?: unknown;
  value?: unknown;
  active?: unknown;
};

// =====================================================
// EMPTY VALUES
// =====================================================

const EMPTY_IMAGES: CarImages = {
  front: "",
  back: "",
  left: "",
  right: "",
};

const EMPTY_UPLOADING: UploadingState = {
  front: false,
  back: false,
  left: false,
  right: false,
};

const EMPTY_OPTIONS: DynamicOptions = {
  fuelTypes: [],
  transmissions: [],
  bodyTypes: [],
  colors: [],
  seats: [],
  owners: [],
  hubs: [],
  carCategories: [],
};

const CURRENT_YEAR = new Date().getFullYear();

// =====================================================
// SELLER CAR FEATURE CHECKBOX OPTIONS
// =====================================================

const FEATURE_OPTIONS = [
  "Sunroof",
  "Leather Seats",
  "Navigation",
  "Parking Sensors",
  "Alloy Wheels",
  "Cruise Control",
  "Automatic Climate Control",
  "Apple CarPlay",
  "Android Auto",
  "360° Camera",
  "Ventilated Seats",
  "Power Seats",
];

const SAFETY_FEATURE_OPTIONS = [
  "ABS",
  "Airbags",
  "ESP",
  "Blind Spot Monitor",
  "Lane Assist",
  "Traction Control",
  "Hill Hold Assist",
  "Rear Camera",
  "ISOFIX",
  "Tyre Pressure Monitoring",
  "Collision Warning",
  "Adaptive Cruise Control",
];


// =====================================================
// HELPERS
// =====================================================

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));

// =====================================================
// DYNAMIC OPTION HELPER
// Handles different backend response shapes safely
// =====================================================

const extractOptionNames = (
  value: unknown
): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (
        item &&
        typeof item === "object" &&
        "name" in item
      ) {
        return String(
          (item as { name?: unknown }).name || ""
        );
      }

      if (
        item &&
        typeof item === "object" &&
        "value" in item
      ) {
        return String(
          (item as { value?: unknown }).value || ""
        );
      }

      return "";
    })
    .map((item) => item.trim())
    .filter(Boolean);
};

// Converts dynamic numeric options safely.
// "5 Seats" -> 5
// "7 Seater" -> 7
// "1 Owner" -> 1
// "2 Owners" -> 2
const extractNumber = (
  value: unknown
): number | null => {
  const match = String(value ?? "").match(/\d+/);

  if (!match) {
    return null;
  }

  const number = Number(match[0]);

  return Number.isFinite(number)
    ? number
    : null;
};

// =====================================================
// REUSABLE SELECT
//
// IMPORTANT: This component is defined OUTSIDE of
// SellCar on purpose. If it were defined inside the
// SellCar component (as a nested function), React would
// treat it as a brand-new component type on every
// re-render (e.g. when moving from Step 1 -> Step 2).
// That causes React to unmount the old <select> DOM node
// and mount a fresh one, wiping out whatever the user had
// already selected (fuelType / transmission / etc. would
// reset to "" right before submit, which is exactly what
// was causing "Missing fields: fuelType, transmission").
//
// Defining it here, at module scope, keeps the component
// reference stable across renders so React reuses the
// same <select> DOM node and the selected value persists.
// =====================================================

const DynamicSelect = ({
  name,
  label,
  values,
  placeholder,
  numeric = false,
  optionsLoading,
  isSignedIn,
}: {
  name: string;
  label: string;
  values: string[];
  placeholder: string;
  numeric?: boolean;
  optionsLoading: boolean;
  isSignedIn: boolean | undefined;
}) => {
  const selectOptions = numeric
    ? values
      .map((value) => ({
        label: value,
        value: extractNumber(value),
      }))
      .filter(
        (
          option
        ): option is {
          label: string;
          value: number;
        } => option.value !== null
      )
    : values.map((value) => ({
      label: value,
      value,
    }));

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        name={name}
        required
        disabled={
          optionsLoading ||
          !isSignedIn
        }
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#ff4054]"
      >
        <option value="">
          {optionsLoading
            ? "Loading..."
            : placeholder}
        </option>

        {selectOptions.map((option) => (
          <option
            key={`${name}-${option.value}`}
            value={String(option.value)}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// =====================================================
// SELL CAR
// =====================================================

const SellCar = () => {
  const { user, isSignedIn } = useUser();

  // ===================================================
  // LOGIN GUARD
  // ===================================================

  const requireLogin = () => {
    if (!isSignedIn) {
      toast.warning(
        "Please login to continue.",
        {
          description:
            "You can view this page, but selling a car requires login.",
        }
      );

      return false;
    }

    return true;
  };

  // ===================================================
  // REFS
  // ===================================================

  const formRef =
    useRef<HTMLFormElement>(null);

  const step1Ref =
    useRef<HTMLDivElement>(null);

  // ===================================================
  // BASIC STATE
  // ===================================================

  const [step, setStep] = useState(1);

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ===================================================
  // IMAGES
  // ===================================================

  const [images, setImages] =
    useState<CarImages>(EMPTY_IMAGES);

  const [uploading, setUploading] =
    useState<UploadingState>(
      EMPTY_UPLOADING
    );

  // ===================================================
  // DYNAMIC OPTIONS
  // ===================================================

  const [options, setOptions] =
    useState<DynamicOptions>(
      EMPTY_OPTIONS
    );

  const [optionsLoading, setOptionsLoading] =
    useState(true);

  const [selectedFeatures, setSelectedFeatures] =
    useState<string[]>([]);

  const [selectedSafetyFeatures, setSelectedSafetyFeatures] =
    useState<string[]>([]);

  // ===================================================
  // INSTANT VALUATION
  // ===================================================

  const [estimateBrand, setEstimateBrand] =
    useState("");

  const [estimateModel, setEstimateModel] =
    useState("");

  const [estimateYear, setEstimateYear] =
    useState("");

  const [estimateKilometers, setEstimateKilometers] =
    useState("");

  const [estimateFuel, setEstimateFuel] =
    useState("");

  const [estimateTransmission, setEstimateTransmission] =
    useState("");

  const [estimateCondition, setEstimateCondition] =
    useState("Good");

  const [estimatedPrice, setEstimatedPrice] =
    useState<number | null>(null);

  const [estimateRange, setEstimateRange] =
    useState<{
      min: number;
      max: number;
    } | null>(null);

  const [isValuationOpen, setIsValuationOpen] =
    useState(false);

  // ===================================================
  // FETCH ALL DYNAMIC OPTIONS
  // ===================================================

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setOptionsLoading(true);

        const [
          fuelResponse,
          transmissionResponse,
          carOptionsResponse,
        ] = await Promise.all([
          fetch(`${API}/options/fuel-types`),
          fetch(`${API}/options/transmissions`),
          fetch(`${API}/options/car-options`),
        ]);

        const fuelData =
          await fuelResponse.json();

        const transmissionData =
          await transmissionResponse.json();

        const carOptionsData =
          await carOptionsResponse.json();

        if (!fuelResponse.ok) {
          throw new Error(
            fuelData.message ||
            "Failed to load fuel types."
          );
        }

        if (!transmissionResponse.ok) {
          throw new Error(
            transmissionData.message ||
            "Failed to load transmissions."
          );
        }

        if (!carOptionsResponse.ok) {
          throw new Error(
            carOptionsData.message ||
            "Failed to load car options."
          );
        }

        // ===========================================
        // FUEL TYPES
        // ===========================================

        const fuelTypes =
          extractOptionNames(
            fuelData.fuelTypes
          );

        // ===========================================
        // TRANSMISSIONS
        // ===========================================

        const transmissions =
          extractOptionNames(
            transmissionData.transmissions
          );

        // ===========================================
        // CAR OPTIONS
        //
        // Supports:
        // carOptions.bodyTypes
        // carOptions.colors
        // carOptions.seats
        // etc.
        //
        // Also supports direct response.
        // ===========================================

        // The car-options API currently returns:
        // { success: true, options: [{ category, name, active }] }
        // So group the active options by category before building selects.
        const rawCarOptions: CarOption[] =
          Array.isArray(carOptionsData.options)
            ? carOptionsData.options as CarOption[]
            : Array.isArray(carOptionsData.carOptions)
              ? carOptionsData.carOptions as CarOption[]
              : Array.isArray(carOptionsData)
                ? carOptionsData as CarOption[]
                : [];
        const getCategoryNames = (
          category: string
        ): string[] => {
          const normalizedCategory =
            category.trim().toLowerCase();

          const isNumericCategory =
            normalizedCategory === "seats" ||
            normalizedCategory === "owners";

          const names = rawCarOptions
            .filter((item: CarOption) => {
              const itemCategory = String(
                item.category ?? ""
              )
                .trim()
                .toLowerCase();

              const itemName = String(
                item.name ?? item.value ?? ""
              ).trim();

              if (
                item.active === false ||
                itemCategory !== normalizedCategory ||
                !itemName
              ) {
                return false;
              }

              // Never show invalid numeric options
              // such as "NaN".
              if (isNumericCategory) {
                return extractNumber(itemName) !== null;
              }

              return true;
            })
            .map((item: CarOption): string => {
              return String(
                item.name ?? item.value ?? ""
              ).trim();
            })
            .filter(
              (item): item is string =>
                Boolean(item)
            );

          const uniqueNames = Array.from(
            new Set<string>(names)
          );

          return uniqueNames.sort(
            (a: string, b: string) => {
              if (isNumericCategory) {
                return (
                  (extractNumber(a) ?? 0) -
                  (extractNumber(b) ?? 0)
                );
              }

              return a.localeCompare(b);
            }
          );
        };

        const bodyTypes =
          getCategoryNames("bodyType");

        const colors =
          getCategoryNames("color");

        const seats =
          getCategoryNames("seats");

        const owners =
          getCategoryNames("owners");

        const hubs =
          getCategoryNames("hub");

        const carCategories =
          getCategoryNames("carCategory");

        setOptions({
          fuelTypes,
          transmissions,
          bodyTypes,
          colors,
          seats,
          owners,
          hubs,
          carCategories,
        });

        // ===========================================
        // VALUATION DEFAULTS
        // ===========================================

        if (fuelTypes.length > 0) {
          setEstimateFuel(
            fuelTypes[0]
          );
        }

        if (transmissions.length > 0) {
          setEstimateTransmission(
            transmissions[0]
          );
        }
      } catch (error) {
        console.error(
          "Sell Car Options Error:",
          error
        );

        setOptions(EMPTY_OPTIONS);

        toast.error(
          "Unable to load vehicle options."
        );
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // ===================================================
  // INSTANT VALUATION
  // ===================================================

  const calculateEstimate = () => {
    if (!requireLogin()) {
      return;
    }

    const year =
      Number(estimateYear);

    const kilometers =
      Number(estimateKilometers);

    if (
      !estimateBrand.trim() ||
      !estimateModel.trim() ||
      !year ||
      year < 2000 ||
      year > CURRENT_YEAR ||
      !estimateKilometers ||
      kilometers < 0 ||
      !estimateFuel ||
      !estimateTransmission
    ) {
      toast.warning(
        "Please complete all valuation details."
      );

      return;
    }

    const age = Math.max(
      0,
      CURRENT_YEAR - year
    );

    const brand =
      estimateBrand
        .trim()
        .toLowerCase();

    const premiumBrands = [
      "bmw",
      "mercedes",
      "mercedes-benz",
      "audi",
      "porsche",
      "land rover",
      "range rover",
      "jaguar",
      "volvo",
      "lexus",
      "bentley",
      "lamborghini",
      "ferrari",
      "bugatti",
    ];

    const massMarketBrands = [
      "maruti",
      "hyundai",
      "tata",
      "honda",
      "toyota",
      "kia",
      "mahindra",
      "renault",
      "nissan",
      "volkswagen",
    ];

    let basePrice = 1200000;

    if (
      premiumBrands.some(
        (item) =>
          brand.includes(item)
      )
    ) {
      basePrice = 3500000;
    } else if (
      massMarketBrands.some(
        (item) =>
          brand.includes(item)
      )
    ) {
      basePrice = 900000;
    }

    const model =
      estimateModel.toLowerCase();

    if (
      /m4|m5|m3|q8|q7|glc|amg|911|huracan|urus|roma|defender/.test(
        model
      )
    ) {
      basePrice *= 1.25;
    }

    const ageFactor =
      Math.max(
        0.35,
        1 - age * 0.085
      );

    const kilometerFactor =
      Math.max(
        0.55,
        1 -
        (Math.min(
          kilometers,
          200000
        ) /
          200000) *
        0.25
      );

    const fuelFactor =
      estimateFuel
        .toLowerCase()
        .includes("electric")
        ? 1.08
        : estimateFuel
          .toLowerCase()
          .includes("diesel")
          ? 1.03
          : 1;

    const transmissionFactor =
      /automatic|dct|cvt/i.test(
        estimateTransmission
      )
        ? 1.05
        : 1;

    const conditionFactor =
      estimateCondition === "Excellent"
        ? 1.1
        : estimateCondition === "Good"
          ? 1
          : estimateCondition === "Fair"
            ? 0.88
            : 0.75;

    const price =
      basePrice *
      ageFactor *
      kilometerFactor *
      fuelFactor *
      transmissionFactor *
      conditionFactor;

    const finalPrice = Math.max(
      150000,
      Math.round(price / 10000) *
      10000
    );

    setEstimatedPrice(
      finalPrice
    );

    setEstimateRange({
      min:
        Math.round(
          (finalPrice * 0.93) /
          10000
        ) * 10000,

      max:
        Math.round(
          (finalPrice * 1.07) /
          10000
        ) * 10000,
    });

    toast.success(
      "Your instant estimate is ready."
    );
  };

  // ===================================================
  // SCROLL TO SELL FORM
  // ===================================================

  const scrollToSellForm = () => {
    if (!requireLogin()) {
      return;
    }

    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ===================================================
  // CLOUDINARY UPLOAD
  // ===================================================

  const uploadImage = async (
    event: ChangeEvent<HTMLInputElement>,
    type: keyof CarImages
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!requireLogin()) {
      event.target.value = "";
      return;
    }

    setError("");

    // ================================================
    // TYPE VALIDATION
    // ================================================

    if (!file.type.startsWith("image/")) {
      const message =
        "Please select a valid image file.";

      setError(message);
      toast.warning(message);

      event.target.value = "";

      return;
    }

    // ================================================
    // SIZE VALIDATION
    // ================================================

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      const message =
        "Image size must be less than 5MB.";

      setError(message);
      toast.warning(message);

      event.target.value = "";

      return;
    }

    // ================================================
    // CLOUDINARY CONFIG
    // ================================================

    const cloudName =
      import.meta.env.VITE_CLOUD_NAME;

    const uploadPreset =
      import.meta.env.VITE_UPLOAD_PRESET;

    if (
      !cloudName ||
      !uploadPreset
    ) {
      const message =
        "Cloudinary configuration is missing. Please check your .env file.";

      setError(message);
      toast.error(message);

      event.target.value = "";

      return;
    }

    setUploading(
      (previous) => ({
        ...previous,
        [type]: true,
      })
    );

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

    try {
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

      setImages(
        (previous) => ({
          ...previous,
          [type]:
            data.secure_url,
        })
      );

      toast.success(
        `${type
          .charAt(0)
          .toUpperCase() +
        type.slice(1)
        } image uploaded successfully.`
      );
    } catch (error) {
      console.error(
        "Cloudinary Upload Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : `Failed to upload ${type} image.`;

      setError(message);
      toast.error(message);
    } finally {
      setUploading(
        (previous) => ({
          ...previous,
          [type]: false,
        })
      );

      event.target.value = "";
    }
  };

  // ===================================================
  // REMOVE IMAGE
  // ===================================================

  const removeImage = (
    type: keyof CarImages
  ) => {
    if (!requireLogin()) {
      return;
    }

    setImages(
      (previous) => ({
        ...previous,
        [type]: "",
      })
    );

    setError("");

    toast.info(
      `${type.charAt(0).toUpperCase() +
      type.slice(1)
      } image removed.`
    );
  };

  // ===================================================
  // IMAGE STATUS
  // ===================================================

  const allImagesUploaded =
    Boolean(
      images.front &&
      images.back &&
      images.left &&
      images.right
    );

  const isAnyImageUploading =
    Object.values(
      uploading
    ).some(Boolean);

  // ===================================================
  // CHECKBOX HELPERS
  // ===================================================

  const toggleFeature = (feature: string) => {
    if (!requireLogin()) {
      return;
    }

    setSelectedFeatures((previous) =>
      previous.includes(feature)
        ? previous.filter((item) => item !== feature)
        : [...previous, feature]
    );
  };

  const toggleSafetyFeature = (feature: string) => {
    if (!requireLogin()) {
      return;
    }

    setSelectedSafetyFeatures((previous) =>
      previous.includes(feature)
        ? previous.filter((item) => item !== feature)
        : [...previous, feature]
    );
  };

  // ===================================================
  // SUBMIT CAR
  // ===================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    // ================================================
    // LOGIN
    // ================================================

    if (!requireLogin()) {
      return;
    }

    if (!user) {
      const message =
        "Please login before submitting your car.";

      setError(message);
      toast.warning(message);

      return;
    }

    // ================================================
    // IMAGE CHECK
    // ================================================

    if (!allImagesUploaded) {
      const message =
        "Please upload all 4 car images: Front, Back, Left Side and Right Side.";

      setError(message);
      toast.warning(message);

      return;
    }

    // ================================================
    // UPLOAD CHECK
    // ================================================

    if (isAnyImageUploading) {
      const message =
        "Please wait until all images finish uploading.";

      setError(message);
      toast.warning(message);

      return;
    }

    setIsLoading(true);

    const form =
      event.currentTarget;

    // Step 2 is hidden/visible independently from Step 1.
    // Prevent browser native validation from trying to focus
    // hidden Step-1 required controls. Step 1 is already
    // validated by the existing "Continue" button.
    const descriptionField =
      form.elements.namedItem(
        "description"
      ) as HTMLTextAreaElement | null;

    if (
      !descriptionField ||
      !descriptionField.value.trim()
    ) {
      const message =
        "Please enter a description for your car.";

      setError(message);
      toast.warning(message);
      return;
    }

    const formData =
      new FormData(form);

    // ================================================
    // FEATURES
    // ================================================

    const features = formData
      .getAll("features")
      .map((item) => String(item).trim())
      .filter(Boolean);

    // ================================================
    // SAFETY FEATURES
    // ================================================

    const safetyFeatures = formData
      .getAll("safetyFeatures")
      .map((item) => String(item).trim())
      .filter(Boolean);

    // ================================================
    // COMPLETE CAR DATA
    // ================================================

    const carData = {
      // ----------------------------------------------
      // SELLER
      // ----------------------------------------------

      sellerName:
        user.fullName ||
        "User",

      sellerEmail:
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        "",

      // ----------------------------------------------
      // BASIC CAR INFORMATION
      // ----------------------------------------------

      brand: String(
        formData.get(
          "brand"
        ) || ""
      ).trim(),

      model: String(
        formData.get(
          "model"
        ) || ""
      ).trim(),

      year: Number(
        formData.get(
          "year"
        )
      ),

      price: Number(
        formData.get(
          "price"
        )
      ),

      kilometers: Number(
        formData.get(
          "kilometers"
        )
      ),

      // ----------------------------------------------
      // DYNAMIC CAR OPTIONS
      // ----------------------------------------------

      fuelType: String(
        formData.get(
          "fuelType"
        ) || ""
      ).trim(),

      transmission: String(
        formData.get(
          "transmission"
        ) || ""
      ).trim(),

      bodyType: String(
        formData.get(
          "bodyType"
        ) || ""
      ).trim(),

      color: String(
        formData.get(
          "color"
        ) || ""
      ).trim(),

      seats:
        extractNumber(
          formData.get("seats")
        ) ?? 0,

      owners:
        extractNumber(
          formData.get("owners")
        ) ?? 0,

      hub: String(
        formData.get(
          "hub"
        ) || ""
      ).trim(),

      carCategory: String(
        formData.get(
          "carCategory"
        ) || ""
      ).trim(),

      // ----------------------------------------------
      // CITY
      // ----------------------------------------------

      city: String(
        formData.get(
          "city"
        ) || ""
      ).trim(),

      // ----------------------------------------------
      // FEATURES
      // ----------------------------------------------

      features,

      safetyFeatures,

      // ----------------------------------------------
      // DESCRIPTION
      // ----------------------------------------------

      description: String(
        formData.get(
          "description"
        ) || ""
      ).trim(),

      // ----------------------------------------------
      // OLD IMAGE FIELD
      // ----------------------------------------------

      image:
        images.front,

      // ----------------------------------------------
      // FOUR IMAGE GALLERY
      // ----------------------------------------------

      images: {
        front:
          images.front,

        back:
          images.back,

        left:
          images.left,

        right:
          images.right,
      },

      // ----------------------------------------------
      // ADMIN CONTROLLED VALUES
      // Seller does NOT control these
      // ----------------------------------------------

      featured: false,

      stock: true,

      // ----------------------------------------------
      // SELLER LISTING
      // ----------------------------------------------

      addedBy: "seller",

      status: "pending",
    };

    console.log(
      "COMPLETE SELLER CAR DATA:",
      carData
    );

    try {
      const response =
        await fetch(
          `${API}/cars/add`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                carData
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.missingFields?.length
            ? `Missing: ${data.missingFields.join(", ")}`
            : data.message ||
            "Failed to submit car."
        );
      }

      // ==============================================
      // SUCCESS
      // ==============================================

      setIsSubmitted(
        true
      );

      form.reset();

      setStep(1);

      setImages({
        ...EMPTY_IMAGES,
      });

      setUploading({
        ...EMPTY_UPLOADING,
      });

      setSelectedFeatures([]);
      setSelectedSafetyFeatures([]);

      toast.success(
        "Car submitted successfully! 🚗",
        {
          description:
            "Your complete listing has been sent for review.",
        }
      );
    } catch (error) {
      console.error(
        "Submit Car Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your car.";

      setError(message);

      toast.error(
        "Unable to submit car.",
        {
          description:
            message,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ===================================================
  // IMAGE UPLOAD BOX
  // ===================================================

  const ImageUploadBox = ({
    type,
    title,
    description,
  }: {
    type: keyof CarImages;
    title: string;
    description: string;
  }) => {
    const hasImage =
      Boolean(images[type]);

    const isUploading =
      uploading[type];

    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

        <div className="mb-4 flex items-start justify-between gap-3">

          <div>
            <p className="font-bold text-gray-900">
              {title}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {description}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-[#ff4054]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#ff4054]">
            Required
          </span>

        </div>

        <label
          className={`block ${isSignedIn
            ? "cursor-pointer"
            : "cursor-not-allowed"
            }`}
          onClick={(event) => {
            if (!isSignedIn) {
              event.preventDefault();
              requireLogin();
            }
          }}
        >

          <div
            className={`relative flex min-h-40 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-white transition ${hasImage
              ? "border-green-400"
              : "border-gray-300 hover:border-[#ff4054]"
              }`}
          >

            {hasImage ? (
              <>
                <img
                  src={images[type]}
                  alt={`${title} preview`}
                  className="h-36 w-full object-cover sm:h-40"
                />

                <div className="absolute left-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow">
                  ✓ Uploaded
                </div>

                {!isUploading && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-xs font-bold text-white">
                    Click to Replace
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">

                <div className="text-4xl">
                  📷
                </div>

                <p className="mt-2 text-sm font-bold text-gray-700">
                  Choose Image
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  JPG, PNG, WEBP
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  Maximum 5MB
                </p>

              </div>
            )}

          </div>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={isUploading}
            onChange={(event) =>
              uploadImage(
                event,
                type
              )
            }
          />

        </label>

        {isUploading && (
          <div className="mt-3 rounded-xl bg-[#fff5f6] px-4 py-3">

            <div className="flex items-center gap-3">

              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#ff4054]" />

              <p className="text-sm font-semibold text-[#ff4054]">
                Uploading {title}...
              </p>

            </div>

          </div>
        )}

        {hasImage &&
          !isUploading && (
            <button
              type="button"
              onClick={() =>
                removeImage(type)
              }
              className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
            >
              Remove Image
            </button>
          )}

        {hasImage &&
          !isUploading && (
            <p className="mt-2 text-center text-xs font-semibold text-green-600">
              Image ready
            </p>
          )}

      </div>
    );
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pb-20 pt-20 sm:px-6 lg:pt-24">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HERO
        ================================================= */}

        <Reveal>

          <div className="relative w-full">

            <button
              type="button"
              onClick={() => {
                if (!requireLogin()) {
                  return;
                }

                setEstimatedPrice(
                  null
                );

                setEstimateRange(
                  null
                );

                setIsValuationOpen(
                  true
                );
              }}
              className="absolute right-0 top-0 rounded-xl bg-[#ff4054] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#ff4054]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#e9364a] hover:shadow-xl"
            >
              Get Instant Estimate →
            </button>

            <div className="max-w-3xl">

              <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#ff4054]">
                Sell With AutoLux
              </p>

              <h1 className="mt-5 text-5xl font-black leading-tight text-gray-900 md:text-7xl">
                Sell Your
                <span className="text-[#ff4054]">
                  {" "}Car.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500">
                Get the best value for your vehicle with a smooth,
                transparent and premium selling experience.
              </p>

            </div>

          </div>

        </Reveal>

        {/* =================================================
            VALUATION MODAL
        ================================================= */}

        {isValuationOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setIsValuationOpen(
                  false
                );
              }
            }}
          >

            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

              <button
                type="button"
                onClick={() =>
                  setIsValuationOpen(
                    false
                  )
                }
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-600 transition hover:bg-[#fff5f6] hover:text-[#ff4054]"
                aria-label="Close valuation"
              >
                ×
              </button>

              <div className="pr-12">

                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ff4054]">
                  Sell Smarter
                </p>

                <h2
                  className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl"
                >
                  Instant Car Valuation
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Enter your car details to get a quick ballpark estimate.
                </p>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Brand Name
                  </label>

                  <input
                    value={
                      estimateBrand
                    }
                    onChange={(event) =>
                      setEstimateBrand(
                        event.target.value
                      )
                    }
                    placeholder="e.g. BMW"
                    disabled={
                      !isSignedIn
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Car Model
                  </label>

                  <input
                    value={
                      estimateModel
                    }
                    onChange={(event) =>
                      setEstimateModel(
                        event.target.value
                      )
                    }
                    placeholder="e.g. M4"
                    disabled={
                      !isSignedIn
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Year of Purchase
                  </label>

                  <input
                    type="number"
                    min="2000"
                    max={
                      CURRENT_YEAR
                    }
                    value={
                      estimateYear
                    }
                    onChange={(event) =>
                      setEstimateYear(
                        event.target.value
                      )
                    }
                    placeholder={`e.g. ${CURRENT_YEAR - 2
                      }`}
                    disabled={
                      !isSignedIn
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Kilometers Driven
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      estimateKilometers
                    }
                    onChange={(event) =>
                      setEstimateKilometers(
                        event.target.value
                      )
                    }
                    placeholder="e.g. 40000"
                    disabled={
                      !isSignedIn
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Fuel Type
                  </label>

                  <select
                    value={
                      estimateFuel
                    }
                    onChange={(event) =>
                      setEstimateFuel(
                        event.target.value
                      )
                    }
                    disabled={
                      optionsLoading ||
                      !isSignedIn
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                  >

                    <option value="">
                      {optionsLoading
                        ? "Loading..."
                        : "Select Fuel Type"}
                    </option>

                    {options.fuelTypes.map(
                      (fuel) => (
                        <option
                          key={fuel}
                          value={fuel}
                        >
                          {fuel}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Transmission
                  </label>

                  <select
                    value={
                      estimateTransmission
                    }
                    onChange={(event) =>
                      setEstimateTransmission(
                        event.target.value
                      )
                    }
                    disabled={
                      optionsLoading ||
                      !isSignedIn
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                  >

                    <option value="">
                      {optionsLoading
                        ? "Loading..."
                        : "Select Transmission"}
                    </option>

                    {options.transmissions.map(
                      (
                        transmission
                      ) => (
                        <option
                          key={
                            transmission
                          }
                          value={
                            transmission
                          }
                        >
                          {
                            transmission
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Overall Condition
                  </label>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                    {[
                      "Excellent",
                      "Good",
                      "Fair",
                      "Poor",
                    ].map(
                      (condition) => (
                        <button
                          key={
                            condition
                          }
                          type="button"
                          onClick={() => {
                            if (
                              !requireLogin()
                            ) {
                              return;
                            }

                            setEstimateCondition(
                              condition
                            );
                          }}
                          disabled={
                            !isSignedIn
                          }
                          className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${estimateCondition ===
                            condition
                            ? "border-[#ff4054] bg-[#fff5f6] text-[#ff4054]"
                            : "border-gray-200 text-gray-600 hover:border-[#ff4054]/50"
                            }`}
                        >
                          {
                            condition
                          }
                        </button>
                      )
                    )}

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={
                  calculateEstimate
                }
                className="mt-6 w-full rounded-xl bg-[#ff4054] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#ff4054]/20 transition hover:bg-[#e9364a]"
              >
                Get My Estimate
              </button>

              {estimatedPrice !==
                null &&
                estimateRange && (
                  <div className="mt-5 rounded-2xl bg-[#f8f8f8] p-5 text-center">

                    <p className="text-sm font-semibold text-gray-500">
                      Estimated Selling Price
                    </p>

                    <p className="mt-1 text-4xl font-black text-[#ff4054]">
                      {formatINR(
                        estimatedPrice
                      )}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Typical range:{" "}
                      {formatINR(
                        estimateRange.min
                      )}{" "}
                      –{" "}
                      {formatINR(
                        estimateRange.max
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setIsValuationOpen(
                          false
                        );

                        window.setTimeout(
                          () => {
                            scrollToSellForm();
                          },
                          100
                        );
                      }}
                      className="mt-5 rounded-full bg-[#111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
                    >
                      List This Car →
                    </button>

                  </div>
                )}

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                *This is a rough automated estimate. Actual value depends on inspection,
                demand and local market conditions.
              </p>

            </div>

          </div>
        )}

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-10">

          {/* =================================================
              LEFT INFORMATION
          ================================================= */}

          <Reveal>

            <div className="rounded-3xl bg-[#111] p-7 text-white lg:sticky lg:top-28">

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff4054]">
                Why Sell With Us?
              </p>

              <h2 className="mt-5 text-3xl font-black">
                Your Car Deserves
                <span className="text-[#ff4054]">
                  {" "}More.
                </span>
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                At AutoLux, we connect your
                vehicle with serious buyers
                looking for quality premium cars.
              </p>

              <div className="mt-10 space-y-6">

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054]/10 text-[#ff4054]">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold">
                      Premium Buyers
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Reach verified and serious
                      car buyers.
                    </p>

                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054]/10 text-[#ff4054]">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold">
                      Transparent Process
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Simple and clear selling
                      process.
                    </p>

                  </div>

                </div>

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054]/10 text-[#ff4054]">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold">
                      Expert Support
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Our team helps you throughout
                      the process.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </Reveal>

          {/* =================================================
              FORM
          ================================================= */}

          <Reveal>

            <div className="rounded-3xl bg-white p-7 shadow-xl sm:p-8">

              {/* FORM HEADER */}

              <div className="mb-8">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff4054]">
                  Vehicle Information
                </p>

                <h2 className="mt-3 text-3xl font-black text-gray-900">
                  Tell Us About Your Car
                </h2>

                <p className="mt-2 text-gray-500">
                  Fill in the details below and
                  our team will get back to you.
                </p>

              </div>

              {/* SELLER */}

              <div className="mb-6 rounded-2xl border border-[#ff4054]/20 bg-[#fff5f6] p-4">

                <p className="text-xs font-bold uppercase tracking-wider text-[#ff4054]">
                  Seller Information
                </p>

                <p className="mt-3 font-bold text-gray-900">
                  {user?.fullName ||
                    "User"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {user
                    ?.primaryEmailAddress
                    ?.emailAddress ||
                    "Login required to submit a car"}
                </p>

                {!isSignedIn && (
                  <p className="mt-2 text-xs font-semibold text-[#ff4054]">
                    Please login to fill and submit this form.
                  </p>
                )}

              </div>

              {/* SUCCESS */}

              {isSubmitted ? (

                <div className="rounded-2xl bg-green-50 p-8 text-center">

                  <div className="text-5xl">
                    ✓
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-gray-900">
                    Request Submitted Successfully!
                  </h3>

                  <p className="mt-3 text-gray-500">
                    Your complete car details and
                    4 images have been saved successfully.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(
                        false
                      );

                      setError("");

                      setStep(1);

                      setImages({
                        ...EMPTY_IMAGES,
                      });
                    }}
                    className="mt-6 rounded-xl bg-[#ff4054] px-6 py-3 font-bold text-white transition hover:bg-[#e9364a]"
                  >
                    Submit Another Request
                  </button>

                </div>

              ) : (

                <>
                  {/* =================================================
                      PROGRESS
                  ================================================= */}

                  <div className="mb-6 flex items-center gap-3">

                    {STEPS.map(
                      (
                        label,
                        index
                      ) => {

                        const stepNumber =
                          index + 1;

                        const isActive =
                          step ===
                          stepNumber;

                        const isDone =
                          step >
                          stepNumber;

                        return (
                          <div
                            key={
                              label
                            }
                            className="flex flex-1 items-center gap-3"
                          >

                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isActive ||
                                isDone
                                ? "bg-[#ff4054] text-white"
                                : "bg-gray-100 text-gray-400"
                                }`}
                            >
                              {isDone
                                ? "✓"
                                : stepNumber}
                            </div>

                            <div className="hidden sm:block">

                              <p
                                className={`text-sm font-bold ${isActive
                                  ? "text-[#111]"
                                  : "text-gray-400"
                                  }`}
                              >
                                {label}
                              </p>

                            </div>

                            {stepNumber <
                              STEPS.length && (
                                <div
                                  className={`h-0.5 flex-1 ${isDone
                                    ? "bg-[#ff4054]"
                                    : "bg-gray-100"
                                    }`}
                                />
                              )}

                          </div>
                        );
                      }
                    )}

                  </div>

                  {/* =================================================
                      FORM
                  ================================================= */}

                  <form
                    ref={formRef}
                    noValidate
                    onSubmit={
                      handleSubmit
                    }
                    onKeyDown={(
                      event
                    ) => {

                      if (
                        event.key ===
                        "Enter" &&
                        step !== 2
                      ) {
                        event.preventDefault();
                      }

                    }}
                    className="space-y-5"
                  >

                    {/* =================================================
                        STEP 1
                    ================================================= */}

                    <div
                      ref={step1Ref}
                      className={
                        step === 1
                          ? "space-y-6"
                          : "hidden"
                      }
                    >

                      {/* BRAND + MODEL */}

                      <div className="grid gap-4 md:grid-cols-2">

                        <div>

                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Car Brand
                          </label>

                          <input
                            name="brand"
                            type="text"
                            placeholder="e.g. BMW"
                            required
                            disabled={
                              !isSignedIn
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054]"
                          />

                        </div>

                        <div>

                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Car Model
                          </label>

                          <input
                            name="model"
                            type="text"
                            placeholder="e.g. BMW M4"
                            required
                            disabled={
                              !isSignedIn
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054]"
                          />

                        </div>

                      </div>

                      {/* YEAR + PRICE */}

                      <div className="grid gap-4 md:grid-cols-2">

                        <div>

                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Manufacturing Year
                          </label>

                          <input
                            name="year"
                            type="number"
                            min="1900"
                            max={
                              CURRENT_YEAR
                            }
                            placeholder="e.g. 2024"
                            required
                            disabled={
                              !isSignedIn
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054]"
                          />

                        </div>

                        <div>

                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Expected Price
                          </label>

                          <input
                            name="price"
                            type="number"
                            min="1"
                            placeholder="e.g. 7500000"
                            required
                            disabled={
                              !isSignedIn
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054]"
                          />

                        </div>

                      </div>

                      {/* KM + FUEL */}

                      <div className="grid gap-4 md:grid-cols-2">

                        <div>

                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Kilometers Driven
                          </label>

                          <input
                            name="kilometers"
                            type="number"
                            min="0"
                            placeholder="e.g. 25000"
                            required
                            disabled={
                              !isSignedIn
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054]"
                          />

                        </div>

                        <DynamicSelect
                          name="fuelType"
                          label="Fuel Type"
                          values={
                            options.fuelTypes
                          }
                          placeholder="Select Fuel Type"
                          optionsLoading={optionsLoading}
                          isSignedIn={isSignedIn}
                        />

                      </div>

                      {/* TRANSMISSION + BODY TYPE */}

                      <div className="grid gap-4 md:grid-cols-2">

                        <DynamicSelect
                          name="transmission"
                          label="Transmission"
                          values={
                            options.transmissions
                          }
                          placeholder="Select Transmission"
                          optionsLoading={optionsLoading}
                          isSignedIn={isSignedIn}
                        />

                        <DynamicSelect
                          name="bodyType"
                          label="Body Type"
                          values={
                            options.bodyTypes
                          }
                          placeholder="Select Body Type"
                          optionsLoading={optionsLoading}
                          isSignedIn={isSignedIn}
                        />

                      </div>

                      {/* COLOR + SEATS */}

                      <div className="grid gap-4 md:grid-cols-2">

                        <DynamicSelect
                          name="color"
                          label="Color"
                          values={
                            options.colors
                          }
                          placeholder="Select Color"
                          optionsLoading={optionsLoading}
                          isSignedIn={isSignedIn}
                        />

                        <DynamicSelect
                          name="seats"
                          label="Seats"
                          values={
                            options.seats
                          }
                          placeholder="Select Seats"
                          numeric
                          optionsLoading={optionsLoading}
                          isSignedIn={isSignedIn}
                        />

                      </div>

                      {/* PREVIOUS OWNERS + CAR CATEGORY */}

                      <div className="grid gap-4 md:grid-cols-2">

                        <DynamicSelect
                          name="owners"
                          label="Previous Owners"
                          values={
                            options.owners
                          }
                          placeholder="Select Owners"
                          numeric
                          optionsLoading={optionsLoading}
                          isSignedIn={isSignedIn}
                        />

                        <DynamicSelect
                          name="carCategory"
                          label="Car Category"
                          values={
                            options.carCategories
                          }
                          placeholder="Select Car Category"
                          optionsLoading={optionsLoading}
                          isSignedIn={isSignedIn}
                        />

                      </div>

                      {/* HUB + CITY */}

                      <div className="grid gap-4 md:grid-cols-2">

                        <DynamicSelect
                          name="hub"
                          label="Hub / Location"
                          values={
                            options.hubs
                          }
                          placeholder="Select Hub"
                          optionsLoading={optionsLoading}
                          isSignedIn={isSignedIn}
                        />

                        <div>

                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            City
                          </label>

                          <input
                            name="city"
                            type="text"
                            placeholder="e.g. Pune"
                            required
                            disabled={
                              !isSignedIn
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054]"
                          />

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        STEP 1 BUTTON
                    ================================================= */}

                    {step === 1 && (

                      <button
                        type="button"
                        onClick={() => {

                          if (
                            !requireLogin()
                          ) {
                            return;
                          }

                          const fields =
                            step1Ref.current?.querySelectorAll<
                              HTMLInputElement |
                              HTMLSelectElement
                            >(
                              "input, select"
                            );

                          let valid =
                            true;

                          fields?.forEach(
                            (
                              field
                            ) => {

                              if (
                                !field.reportValidity()
                              ) {
                                valid =
                                  false;
                              }

                            }
                          );

                          if (valid) {

                            setError("");

                            setStep(2);

                            toast.success(
                              "Vehicle details completed."
                            );

                          }

                        }}
                        className="w-full rounded-xl bg-[#111] px-6 py-4 font-bold text-white transition hover:bg-black"
                      >
                        Continue to Photos &
                        Description →
                      </button>

                    )}

                    {/* =================================================
                        STEP 2
                    ================================================= */}

                    <div
                      className={
                        step === 2
                          ? "space-y-6"
                          : "hidden"
                      }
                    >

                      {/* DESCRIPTION */}

                      <div>

                        <label className="mb-2 block text-sm font-bold text-gray-700">
                          Additional Details
                        </label>

                        <textarea
                          name="description"
                          rows={5}
                          placeholder="Tell us more about your car..."
                          required
                          disabled={
                            !isSignedIn
                          }
                          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054]"
                        />

                      </div>

                      {/* =================================================
                          FEATURES
                      ================================================= */}

                      <div>

                        <label className="mb-3 block text-sm font-bold text-gray-700">
                          Car Features
                        </label>

                        <div className="grid gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                          {FEATURE_OPTIONS.map((feature) => (
                            <label
                              key={feature}
                              className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition ${selectedFeatures.includes(feature)
                                ? "border-[#ff4054] bg-[#fff5f6] text-[#ff4054]"
                                : "border-gray-200 bg-white text-gray-700 hover:border-[#ff4054]/50"
                                } ${isSignedIn
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed opacity-60"
                                }`}
                            >
                              <input
                                type="checkbox"
                                name="features"
                                value={feature}
                                checked={selectedFeatures.includes(feature)}
                                onChange={() =>
                                  toggleFeature(feature)
                                }
                                disabled={!isSignedIn}
                                className="h-4 w-4 accent-[#ff4054]"
                              />
                              <span>{feature}</span>
                            </label>
                          ))}
                        </div>

                      </div>

                      {/* =================================================
                          SAFETY FEATURES
                      ================================================= */}

                      <div>

                        <label className="mb-3 block text-sm font-bold text-gray-700">
                          Safety Features
                        </label>

                        <div className="grid gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                          {SAFETY_FEATURE_OPTIONS.map((feature) => (
                            <label
                              key={feature}
                              className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition ${selectedSafetyFeatures.includes(feature)
                                ? "border-[#ff4054] bg-[#fff5f6] text-[#ff4054]"
                                : "border-gray-200 bg-white text-gray-700 hover:border-[#ff4054]/50"
                                } ${isSignedIn
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed opacity-60"
                                }`}
                            >
                              <input
                                type="checkbox"
                                name="safetyFeatures"
                                value={feature}
                                checked={selectedSafetyFeatures.includes(feature)}
                                onChange={() =>
                                  toggleSafetyFeature(feature)
                                }
                                disabled={!isSignedIn}
                                className="h-4 w-4 accent-[#ff4054]"
                              />
                              <span>{feature}</span>
                            </label>
                          ))}
                        </div>

                      </div>

                      {/* =================================================
                          FOUR IMAGES
                      ================================================= */}

                      <div>

                        <div className="mb-4">

                          <label className="block text-sm font-bold text-gray-700">
                            Upload 4 Car Photos
                          </label>

                          <p className="mt-1 text-sm text-gray-500">
                            Add all four views of
                            your car. Each image
                            is required.
                          </p>

                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                          <ImageUploadBox
                            type="front"
                            title="1. Front View"
                            description="Main front view of the car"
                          />

                          <ImageUploadBox
                            type="back"
                            title="2. Back View"
                            description="Rear / back view of the car"
                          />

                          <ImageUploadBox
                            type="left"
                            title="3. Left Side View"
                            description="Left side from front angle"
                          />

                          <ImageUploadBox
                            type="right"
                            title="4. Right Side View"
                            description="Right side from front angle"
                          />

                        </div>

                        {/* IMAGE STATUS */}

                        <div
                          className={`mt-4 rounded-xl p-4 ${allImagesUploaded
                            ? "bg-green-50"
                            : "bg-gray-50"
                            }`}
                        >

                          <p
                            className={`text-sm font-bold ${allImagesUploaded
                              ? "text-green-600"
                              : "text-gray-700"
                              }`}
                          >
                            {allImagesUploaded
                              ? "✓ All 4 images uploaded successfully"
                              : "Please upload all 4 images"}
                          </p>

                          {!allImagesUploaded && (
                            <p className="mt-1 text-xs text-gray-500">
                              Front • Back •
                              Left Side •
                              Right Side
                            </p>
                          )}

                        </div>

                      </div>

                      {/* ERROR */}

                      {error && (

                        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
                          {error}
                        </div>

                      )}

                      {/* BUTTONS */}

                      <div className="flex gap-4">

                        {/* BACK */}

                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setStep(1);
                          }}
                          disabled={
                            isLoading
                          }
                          className="rounded-xl border border-gray-200 px-6 py-4 font-bold text-gray-700 transition hover:border-[#ff4054] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ← Back
                        </button>

                        {/* SUBMIT */}

                        <button
                          type="submit"
                          disabled={
                            !isSignedIn ||
                            isLoading ||
                            !allImagesUploaded ||
                            isAnyImageUploading
                          }
                          className="flex-1 rounded-xl bg-[#ff4054] px-6 py-4 font-bold text-white shadow-lg shadow-[#ff4054]/20 transition hover:bg-[#e9364a] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isLoading
                            ? "Submitting..."
                            : isAnyImageUploading
                              ? "Uploading Images..."
                              : "Submit Your Car →"}
                        </button>

                      </div>

                    </div>

                  </form>

                </>

              )}

            </div>

          </Reveal>

        </div>

      </div>

    </main>
  );
};

export default SellCar;