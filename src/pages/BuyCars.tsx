import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

import { API } from "../utils/api";

import {
  addToWishlist,
  removeFromWishlist,
  isWishlisted,
  replaceWishlist,
} from "../utils/storage";

import {
  getCompareList,
  toggleCompare,
  COMPARE_EVENT,
  MAX_COMPARE,
} from "../utils/compare";

import CompareBar from "../components/CompareBar";
import BuyCarSidebar from "../components/BuyCarSidebar";
import Reveal from "../components/Reveal";

// ==============================
// BACKEND CAR
// ==============================

interface BackendCar {
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

  bodyType?: string;
  color?: string;
  seats?: number;
  owners?: string | number;
  hub?: string;
  availability?: string;
  carCategory?: string;
  safetyFeatures?: string[];
  features?: string[];

  description: string;

  // OLD IMAGE FIELD
  image?: string;

  // NEW 4 IMAGE STRUCTURE
  images?: {
    front?: string;
    back?: string;
    left?: string;
    right?: string;
  };

  status?: string;
  createdAt?: string;
  city?: string;
}

// ==============================
// OPTION API TYPES
// ==============================

interface FuelTypeOption {
  _id: string;
  name: string;
  active: boolean;
}

interface TransmissionOption {
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

// ==============================
// DISPLAY CAR
// ==============================

interface DisplayCar {
  id: string;
  brand: string;
  name: string;
  tagline: string;
  description: string;

  // FRONT IMAGE USED ON BUY CARS CARD
  image: string;

  // ALL FOUR IMAGES
  images: {
    front: string;
    back: string;
    left: string;
    right: string;
  };

  kilometers: number;
  fuelType: string;
  transmission: string;

  bodyType: string;
  color: string;
  seats: number;
  owners: string;
  hub: string;
  availability: string;
  carCategory: string;
  safetyFeatures: string[];
  features: string[];

  year: number;
  priceValue: number;
  price: string;
  city: string;
}

// ==============================
// BUY CARS
// ==============================

const BuyCars = () => {
  // ======================================
  // CLERK AUTH
  // ======================================

  const { getToken, isSignedIn } = useAuth();

  const [searchParams] = useSearchParams();

  const brandFromUrl =
    searchParams.get("brand")?.trim() || "All";

  // ======================================
  // CARS
  // ======================================

  const [backendCars, setBackendCars] =
    useState<BackendCar[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================
  // FORCE UI UPDATE
  // ======================================

  const [, forceUpdate] = useState(0);

  // ======================================
  // FILTERS
  // ======================================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedBrand, setSelectedBrand] =
    useState(brandFromUrl);

  const [fuelFilter, setFuelFilter] =
    useState("All");

  const [transmissionFilter, setTransmissionFilter] =
    useState("All");

  const [yearFilter, setYearFilter] =
    useState("All");

  const [kilometersFilter, setKilometersFilter] =
    useState("All");

  const [cityFilter, setCityFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("default");

  // ======================================
  // DYNAMIC DATABASE OPTIONS
  // ======================================

  const [fuelTypes, setFuelTypes] =
    useState<string[]>([]);

  const [transmissionTypes, setTransmissionTypes] =
    useState<string[]>([]);

  const [carOptions, setCarOptions] =
    useState<CarOption[]>([]);

  const [optionsLoading, setOptionsLoading] =
    useState(true);

  const [bodyTypeFilter, setBodyTypeFilter] =
    useState("All");

  const [colorFilter, setColorFilter] =
    useState("All");

  const [seatsFilter, setSeatsFilter] =
    useState("All");

  const [ownersFilter, setOwnersFilter] =
    useState("All");

  const [hubFilter, setHubFilter] =
    useState("All");

  const [availabilityFilter, setAvailabilityFilter] =
    useState("All");

  const [carCategoryFilter, setCarCategoryFilter] =
    useState("All");

  // ======================================
  // SAFETY & FEATURES FILTERS
  // ======================================

  const [safetyFilter, setSafetyFilter] =
    useState("All");

  const [featureFilter, setFeatureFilter] =
    useState("All");

  // ======================================
  // DYNAMIC MAX PRICE
  // ======================================

  const [maxPrice, setMaxPrice] =
    useState(100000000);

  // ======================================
  // PAGINATION
  // ======================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const carsPerPage = 9;

  // ======================================
  // COMPARE
  // ======================================

  const [compareIds, setCompareIds] =
    useState<string[]>([]);

  const [compareLimitNotice, setCompareLimitNotice] =
    useState(false);

  // ======================================
  // SYNC COMPARE
  // ======================================

  useEffect(() => {
    const syncCompare = () => {
      setCompareIds(getCompareList());
    };

    syncCompare();

    window.addEventListener(
      COMPARE_EVENT,
      syncCompare
    );

    window.addEventListener(
      "storage",
      syncCompare
    );

    return () => {
      window.removeEventListener(
        COMPARE_EVENT,
        syncCompare
      );

      window.removeEventListener(
        "storage",
        syncCompare
      );
    };
  }, []);

  // ======================================
  // TOGGLE COMPARE
  // ======================================

  const handleToggleCompare = (
    carId: string
  ) => {
    const wasAlreadySelected =
      compareIds.includes(carId);

    const { list } =
      toggleCompare(carId);

    setCompareIds(list);

    if (
      !wasAlreadySelected &&
      !list.includes(carId)
    ) {
      setCompareLimitNotice(true);

      window.setTimeout(() => {
        setCompareLimitNotice(false);
      }, 2500);
    }
  };

  // ======================================
  // BRAND FROM URL
  // ======================================

  useEffect(() => {
    setSelectedBrand(brandFromUrl);
  }, [brandFromUrl]);

  // ======================================
  // FETCH APPROVED CARS
  // ======================================

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);

        const response =
          await fetch(`${API}/cars`);

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to fetch cars."
          );
        }

        if (data.success) {
          const approvedCars =
            Array.isArray(data.cars)
              ? data.cars.filter(
                (car: BackendCar) =>
                  car.status === "approved"
              )
              : [];

          setBackendCars(
            approvedCars
          );

          console.log(
            "✅ Approved Cars Loaded:",
            approvedCars.length
          );
        } else {
          setBackendCars([]);
        }
      } catch (error) {
        console.error(
          "Error Fetching Cars:",
          error
        );

        setBackendCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // ======================================
  // FETCH ALL DYNAMIC DATABASE OPTIONS
  // ======================================

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

        const fuelData = await fuelResponse.json();
        const transmissionData =
          await transmissionResponse.json();
        const carOptionsData =
          await carOptionsResponse.json();

        if (
          fuelResponse.ok &&
          fuelData.success &&
          Array.isArray(fuelData.fuelTypes)
        ) {
          const names = fuelData.fuelTypes
            .filter((item: FuelTypeOption) => item.active)
            .map((item: FuelTypeOption) => item.name.trim())
            .filter(Boolean);

          setFuelTypes(Array.from(new Set(names)));

          console.log(
            "✅ Dynamic Fuel Types Loaded:",
            names
          );
        } else {
          setFuelTypes([]);
        }

        if (
          transmissionResponse.ok &&
          transmissionData.success &&
          Array.isArray(transmissionData.transmissions)
        ) {
          const names =
            transmissionData.transmissions
              .filter(
                (item: TransmissionOption) => item.active
              )
              .map(
                (item: TransmissionOption) =>
                  item.name.trim()
              )
              .filter(Boolean);

          setTransmissionTypes(
            Array.from(new Set(names))
          );

          console.log(
            "✅ Dynamic Transmissions Loaded:",
            names
          );
        } else {
          setTransmissionTypes([]);
        }

        if (
          carOptionsResponse.ok &&
          carOptionsData.success &&
          Array.isArray(carOptionsData.options)
        ) {
          const activeOptions =
            carOptionsData.options.filter(
              (item: CarOption) => item.active
            );

          setCarOptions(activeOptions);

          console.log(
            "✅ Dynamic Car Options Loaded:",
            activeOptions
          );
        } else {
          setCarOptions([]);
        }
      } catch (error) {
        console.error(
          "Dynamic Options Error:",
          error
        );

        setFuelTypes([]);
        setTransmissionTypes([]);
        setCarOptions([]);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // ======================================
  // LOAD PERSONAL WISHLIST FROM MONGODB
  // ======================================

  useEffect(() => {
    const fetchMyWishlist =
      async () => {
        if (!isSignedIn) {
          replaceWishlist([]);

          forceUpdate(
            (value) => value + 1
          );

          return;
        }

        try {
          const token =
            await getToken();

          if (!token) {
            console.warn(
              "Wishlist token not available."
            );

            return;
          }

          console.log(
            "BUY CARS WISHLIST TOKEN: TOKEN RECEIVED ✅"
          );

          const response =
            await fetch(
              `${API}/wishlist/me`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
              "Failed to fetch wishlist."
            );
          }

          if (
            data.success &&
            Array.isArray(
              data.wishlist
            )
          ) {
            const localWishlist =
              data.wishlist
                .filter(
                  (item: any) =>
                    item.carId
                )
                .map(
                  (item: any) => ({
                    _id:
                      item.carId._id,

                    brand:
                      item.carId.brand ||
                      "",

                    model:
                      item.carId.model ||
                      "",

                    image:
                      item.carId.image ||
                      item.carId.images?.front ||
                      "",

                    price:
                      Number(
                        item.carId.price
                      ) || 0,
                  })
                );

            replaceWishlist(
              localWishlist
            );

            forceUpdate(
              (value) => value + 1
            );

            console.log(
              "✅ Personal wishlist loaded:",
              localWishlist.length
            );
          }
        } catch (error) {
          console.error(
            "Fetch Personal Wishlist Error:",
            error
          );
        }
      };

    fetchMyWishlist();
  }, [
    isSignedIn,
    getToken,
  ]);

  // ======================================
  // ADD / REMOVE WISHLIST
  // ======================================

  const handleWishlistToggle =
    async (
      car: DisplayCar
    ) => {
      try {
        if (!isSignedIn) {
          alert(
            "Please login first to use wishlist."
          );

          return;
        }

        const token =
          await getToken();

        if (!token) {
          alert(
            "Authentication token not available. Please login again."
          );

          return;
        }

        console.log(
          "WISHLIST TOKEN: TOKEN RECEIVED ✅"
        );

        const alreadyWishlisted =
          isWishlisted(car.id);

        // ====================================
        // REMOVE
        // ====================================

        if (alreadyWishlisted) {
          console.log(
            "Removing wishlist:",
            car.id
          );

          const wishlistResponse =
            await fetch(
              `${API}/wishlist/me`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },
              }
            );

          const wishlistData =
            await wishlistResponse.json();

          if (
            !wishlistResponse.ok
          ) {
            throw new Error(
              wishlistData.message ||
              "Failed to fetch wishlist."
            );
          }

          const wishlistItem =
            wishlistData.wishlist?.find(
              (item: any) =>
                item.carId?._id ===
                car.id
            );

          if (
            !wishlistItem?._id
          ) {
            throw new Error(
              "Wishlist item not found."
            );
          }

          const deleteResponse =
            await fetch(
              `${API}/wishlist/${wishlistItem._id}`,
              {
                method: "DELETE",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },
              }
            );

          const deleteData =
            await deleteResponse.json();

          if (
            !deleteResponse.ok
          ) {
            throw new Error(
              deleteData.message ||
              "Failed to remove wishlist item."
            );
          }

          removeFromWishlist(
            car.id
          );

          forceUpdate(
            (value) => value + 1
          );

          console.log(
            "✅ Removed from wishlist"
          );

          return;
        }

        // ====================================
        // ADD
        // ====================================

        console.log(
          "Adding wishlist:",
          car.id
        );

        const response =
          await fetch(
            `${API}/wishlist`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                carId: car.id,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to add wishlist."
          );
        }

        if (data.success) {
          addToWishlist({
            _id: car.id,

            brand:
              car.brand,

            model:
              car.name,

            image:
              car.images.front ||
              car.image,

            price:
              car.priceValue,
          });

          forceUpdate(
            (value) => value + 1
          );

          console.log(
            "✅ Added to wishlist"
          );
        }
      } catch (error) {
        console.error(
          "Wishlist Toggle Error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Wishlist operation failed."
        );
      }
    };

  // ======================================
  // CONVERT BACKEND DATA
  // ======================================

  const allCars =
    useMemo<DisplayCar[]>(
      () => {
        return backendCars.map(
          (car) => {
            // =================================
            // FRONT IMAGE
            // New cars -> images.front
            // Old cars -> image
            // =================================

            const frontImage =
              car.images?.front ||
              car.image ||
              "/default-car.jpg";

            return {
              id: car._id,

              brand:
                car.brand,

              name:
                car.model,

              tagline:
                `${car.year} • ${car.fuelType} • ${car.transmission}`,

              description:
                car.description,

              // Keep existing image property
              // for current UI compatibility
              image:
                frontImage,

              // NEW 4 IMAGE STRUCTURE
              images: {
                front:
                  frontImage,

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

              kilometers:
                car.kilometers,

              fuelType:
                car.fuelType,

              transmission:
                car.transmission,

              bodyType:
                car.bodyType?.trim() || "",

              color:
                car.color?.trim() || "",

              seats:
                Number(car.seats) || 0,

              owners:
                car.owners?.toString().trim() || "",

              hub:
                car.hub?.trim() || "",

              availability:
                car.availability?.trim() || "In Stock",

              carCategory:
                car.carCategory?.trim() || "",

              safetyFeatures:
                Array.isArray(car.safetyFeatures)
                  ? car.safetyFeatures
                  : [],

              features:
                Array.isArray(car.features)
                  ? car.features
                  : [],

              year:
                car.year,

              priceValue:
                car.price,

              price:
                `₹${Number(
                  car.price
                ).toLocaleString(
                  "en-IN"
                )}`,

              city:
                car.city ||
                "Not specified",
            };
          }
        );
      },
      [backendCars]
    );

  // ======================================
  // DYNAMIC PRICE SLIDER MAX
  // ======================================

  const priceSliderMax =
    useMemo(() => {
      if (allCars.length === 0) {
        return 1000000;
      }

      const highestPrice =
        Math.max(
          ...allCars.map(
            (car) =>
              Number(
                car.priceValue
              ) || 0
          )
        );

      return Math.max(
        highestPrice,
        100000
      );
    }, [allCars]);

  // ======================================
  // UPDATE PRICE
  // ======================================

  useEffect(() => {
    setMaxPrice(
      priceSliderMax
    );

    setCurrentPage(1);
  }, [priceSliderMax]);

  // ======================================
  // DYNAMIC CAR OPTION LISTS
  // ======================================

  const getCarOptionNames = (
    category: string
  ) => {
    const normalizedCategory =
      category.trim().toLowerCase();

    return Array.from(
      new Set(
        carOptions
          .filter(
            (item) =>
              item.active &&
              item.category?.trim().toLowerCase() ===
              normalizedCategory
          )
          .map((item) => item.name?.trim())
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b)
    );
  };

  const bodyTypes = useMemo(
    () => [
      "All",
      ...getCarOptionNames("bodyType"),
    ],
    [carOptions]
  );

  const colors = useMemo(
    () => [
      "All",
      ...getCarOptionNames("color"),
    ],
    [carOptions]
  );

  const seats = useMemo(
    () => [
      "All",
      ...getCarOptionNames("seats"),
    ],
    [carOptions]
  );

  const owners = useMemo(
    () => [
      "All",
      ...getCarOptionNames("owners"),
    ],
    [carOptions]
  );

  const hubs = useMemo(
    () => [
      "All",
      ...getCarOptionNames("hub"),
    ],
    [carOptions]
  );

  const availability = useMemo(
    () => [
      "All",
      ...getCarOptionNames("availability"),
    ],
    [carOptions]
  );

  const carCategories = useMemo(
    () => [
      "All",
      ...getCarOptionNames("carCategory"),
    ],
    [carOptions]
  );

  const safetyFeatures = useMemo(
    () => [
      "All",
      ...getCarOptionNames("safetyFeatures"),
    ],
    [carOptions]
  );

  const features = useMemo(
    () => [
      "All",
      ...getCarOptionNames("features"),
    ],
    [carOptions]
  );

  // ======================================
  // DYNAMIC BRANDS
  // ======================================

  const brands =
    useMemo(() => {
      const uniqueBrands =
        Array.from(
          new Set(
            allCars
              .map(
                (car) =>
                  car.brand?.trim()
              )
              .filter(Boolean)
          )
        ).sort((a, b) =>
          a.localeCompare(b)
        );

      return [
        "All",
        ...uniqueBrands,
      ];
    }, [allCars]);

  // ======================================
  // DYNAMIC MODELS FOR SEARCH
  // ======================================

  const models =
    useMemo(() => {
      const uniqueModels =
        Array.from(
          new Set(
            allCars
              .map(
                (car) =>
                  car.name?.trim()
              )
              .filter(Boolean)
          )
        ).sort((a, b) =>
          a.localeCompare(b)
        );

      return uniqueModels;
    }, [allCars]);

  // ======================================
  // DYNAMIC FUEL TYPES
  // ======================================

  const fuels =
    useMemo(() => {
      return [
        "All",
        ...fuelTypes,
      ];
    }, [fuelTypes]);

  // ======================================
  // DYNAMIC TRANSMISSIONS
  // ======================================

  const transmissions =
    useMemo(() => {
      return [
        "All",
        ...transmissionTypes,
      ];
    }, [transmissionTypes]);

  // ======================================
  // DYNAMIC YEARS
  // ======================================

  const years =
    useMemo(() => {
      const uniqueYears =
        Array.from(
          new Set(
            allCars.map(
              (car) =>
                car.year.toString()
            )
          )
        ).sort(
          (a, b) =>
            Number(b) -
            Number(a)
        );

      return [
        "All",
        ...uniqueYears,
      ];
    }, [allCars]);
    
const kilometerRanges = useMemo(() => {
  const ranges = [
    { min: 0, max: 10000, label: "Under 10,000 km" },
    { min: 10000, max: 30000, label: "10,000 - 30,000 km" },
    { min: 30000, max: 60000, label: "30,000 - 60,000 km" },
    { min: 60000, max: 100000, label: "60,000 - 1,00,000 km" },
    { min: 100000, max: Infinity, label: "1,00,000+ km" },
  ];

  const availableKms = allCars
    .map((car) => Number(car.kilometers))
    .filter(
      (kms) =>
        Number.isFinite(kms) && kms >= 0
    );

  const activeRanges = ranges
    .filter((range) =>
      availableKms.some(
        (kms) =>
          kms >= range.min &&
          kms <= range.max
      )
    )
    .map((range) => range.label);

  return ["All", ...activeRanges];
}, [allCars]);

// ======================================
// FILTER + SORT
// ======================================

const filteredCars =
  useMemo(() => {
     let result =
        allCars.filter(
          (car) => {
            const search =
              searchTerm
                .toLowerCase()
                .trim()
                .replace(/\s+/g, " ");

            const searchWords =
              search
                .split(" ")
                .filter(Boolean);

            const searchableText = [
              car.brand,
              car.name,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            const matchesSearch =
              searchWords.length === 0 ||
              searchWords.every((word) =>
                searchableText.includes(word)
              );

            const matchesBrand =
              selectedBrand ===
              "All" ||
              car.brand ===
              selectedBrand;

            const matchesFuel =
              fuelFilter ===
              "All" ||
              car.fuelType ===
              fuelFilter;

            const matchesTransmission =
              transmissionFilter ===
              "All" ||
              car.transmission ===
              transmissionFilter;

            const matchesYear =
              yearFilter ===
              "All" ||
              car.year.toString() ===
              yearFilter;

            const kms = Number(car.kilometers) || 0;

            const matchesKilometers =
              kilometersFilter === "All" ||
              (kilometersFilter === "Under 10,000 km" &&
                kms < 10000) ||
              (kilometersFilter === "10,000 - 30,000 km" &&
                kms >= 10000 &&
                kms <= 30000) ||
              (kilometersFilter === "30,000 - 60,000 km" &&
                kms >= 30000 &&
                kms <= 60000) ||
              (kilometersFilter === "60,000 - 1,00,000 km" &&
                kms >= 60000 &&
                kms <= 100000) ||
              (kilometersFilter === "1,00,000+ km" &&
                kms >= 100000);

            const matchesCity =
              cityFilter ===
              "All" ||
              car.city ===
              cityFilter;

            const matchesPrice =
              car.priceValue <=
              maxPrice;

            const matchesBodyType =
              bodyTypeFilter === "All" ||
              car.bodyType.trim().toLowerCase() ===
              bodyTypeFilter.trim().toLowerCase();

            const matchesColor =
              colorFilter === "All" ||
              car.color.trim().toLowerCase() ===
              colorFilter.trim().toLowerCase();

            const normalizedSeatsFilter =
              seatsFilter
                .trim()
                .toLowerCase()
                .replace(/\s*seats?\s*$/i, "");

            const matchesSeats =
              seatsFilter === "All" ||
              String(car.seats).trim() ===
              normalizedSeatsFilter;

            const normalizeOwner = (value: string) => {
              const normalized = value
                .trim()
                .toLowerCase()
                .replace(/\s+/g, " ");

              const ownerMap: Record<string, string> = {
                "1": "1st owner",
                "2": "2nd owners",
                "3": "3rd owner",
                "4": "4th owners",

                "1st owner": "1st owner",
                "1st owners": "1st owner",

                "2nd owner": "2nd owners",
                "2nd owners": "2nd owners",

                "3rd owner": "3rd owner",
                "3rd owners": "3rd owner",

                "4th owner": "4th owners",
                "4th owners": "4th owners",
              };

              return ownerMap[normalized] || normalized;
            };

            const matchesOwners =
              ownersFilter === "All" ||
              normalizeOwner(String(car.owners)) ===
              normalizeOwner(ownersFilter);

            const matchesHub =
              hubFilter === "All" ||
              car.hub.trim().toLowerCase() ===
              hubFilter.trim().toLowerCase();

            const normalizeAvailability = (
              value: string
            ) => {
              const normalized =
                value.trim().toLowerCase();

              if (
                normalized === "in stock" ||
                normalized === "available"
              ) {
                return "stock";
              }

              return normalized;
            };

            const matchesAvailability =
              availabilityFilter === "All" ||
              normalizeAvailability(
                car.availability
              ) ===
              normalizeAvailability(
                availabilityFilter
              );

            const matchesCarCategory =
              carCategoryFilter === "All" ||
              car.carCategory.trim().toLowerCase() ===
              carCategoryFilter.trim().toLowerCase();

            const matchesSafety =
              safetyFilter === "All" ||
              car.safetyFeatures.some(
                (item) =>
                  item.trim().toLowerCase() ===
                  safetyFilter.trim().toLowerCase()
              );

            const matchesFeature =
              featureFilter === "All" ||
              car.features.some(
                (item) =>
                  item.trim().toLowerCase() ===
                  featureFilter.trim().toLowerCase()
              );

            return (
              matchesSearch &&
              matchesBrand &&
              matchesFuel &&
              matchesTransmission &&
              matchesYear &&
              matchesKilometers &&
              matchesCity &&
              matchesPrice &&
              matchesBodyType &&
              matchesColor &&
              matchesSeats &&
              matchesOwners &&
              matchesHub &&
              matchesAvailability &&
              matchesCarCategory &&
              matchesSafety &&
              matchesFeature
            );
          }
        );

      // ====================================
      // SORT
      // ====================================

      switch (sortBy) {
        case "name":
          result.sort(
            (a, b) =>
              a.name.localeCompare(
                b.name
              )
          );
          break;

        case "brand":
          result.sort(
            (a, b) =>
              a.brand.localeCompare(
                b.brand
              )
          );
          break;

        case "price-low":
          result.sort(
            (a, b) =>
              a.priceValue -
              b.priceValue
          );
          break;

        case "price-high":
          result.sort(
            (a, b) =>
              b.priceValue -
              a.priceValue
          );
          break;

        default:
          break;
      }

      return result;
    }, [
      allCars,
      searchTerm,
      selectedBrand,
      fuelFilter,
      transmissionFilter,
      yearFilter,
      kilometersFilter,
      cityFilter,
      maxPrice,
      bodyTypeFilter,
      colorFilter,
      seatsFilter,
      ownersFilter,
      hubFilter,
      availabilityFilter,
      carCategoryFilter,
      safetyFilter,
      featureFilter,
      sortBy,
    ]);

  // ======================================
  // PAGINATION
  // ======================================

  const totalPages =
    Math.ceil(
      filteredCars.length /
      carsPerPage
    );

  const indexOfLastCar =
    currentPage *
    carsPerPage;

  const indexOfFirstCar =
    indexOfLastCar -
    carsPerPage;

  const currentCars =
    filteredCars.slice(
      indexOfFirstCar,
      indexOfLastCar
    );

  // ======================================
  // RESET PAGE IF INVALID
  // ======================================

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  // ======================================
  // SCROLL TOP ON FILTER / PAGINATION CHANGE
  // ======================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [
    currentPage,
    selectedBrand,
    fuelFilter,
    transmissionFilter,
    yearFilter,
    kilometersFilter,
    cityFilter,
    bodyTypeFilter,
    colorFilter,
    seatsFilter,
    ownersFilter,
    hubFilter,
    availabilityFilter,
    carCategoryFilter,
    safetyFilter,
    featureFilter,
  ]);
  // ======================================
  // CLEAR FILTERS
  // ======================================

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("All");
    setFuelFilter("All");
    setTransmissionFilter("All");
    setYearFilter("All");
    setKilometersFilter("All");
    setCityFilter("All");
    setBodyTypeFilter("All");
    setColorFilter("All");
    setSeatsFilter("All");
    setOwnersFilter("All");
    setHubFilter("All");
    setAvailabilityFilter("All");
    setCarCategoryFilter("All");
    setSafetyFilter("All");
    setFeatureFilter("All");
    setSortBy("default");
    setMaxPrice(priceSliderMax);
    setCurrentPage(1);
  };

  // ======================================
  // UI
  // ======================================

  return (
    <main className="min-h-screen w-full bg-[#f8f8f8] px-4 pb-24 pt-36 sm:px-6 lg:px-8">
      <div className="w-full max-w-none">

        {/* HEADER */}

        <Reveal>
          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
              Our Collection
            </p>

            <h1 className="mt-4 text-4xl font-black text-[#111] md:text-6xl">
              Find Your{" "}
              <span className="text-[#ff4054]">
                Perfect Drive.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-gray-500">
              Explore premium vehicles
              directly from verified
              sellers.
            </p>

          </div>
        </Reveal>

        {/* BUY CARS DASHBOARD */}
        <div className="mt-8 grid w-full min-w-0 items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">

          {/* LEFT FILTER SIDEBAR - FULL HEIGHT STYLE */}
          <aside className="min-w-0 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:self-start">
            <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="h-full overflow-y-auto">
                <BuyCarSidebar
                  searchTerm={searchTerm}
                  setSearchTerm={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                  }}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={(value) => {
                    setSelectedBrand(value);
                    setCurrentPage(1);
                  }}
                  fuelFilter={fuelFilter}
                  setFuelFilter={(value) => {
                    setFuelFilter(value);
                    setCurrentPage(1);
                  }}
                  transmissionFilter={transmissionFilter}
                  setTransmissionFilter={(value) => {
                    setTransmissionFilter(value);
                    setCurrentPage(1);
                  }}
                  yearFilter={yearFilter}
                  setYearFilter={(value) => {
                    setYearFilter(value);
                    setCurrentPage(1);
                  }}

                  kilometersFilter={kilometersFilter}
                  setKilometersFilter={(value) => {
                    setKilometersFilter(value);
                    setCurrentPage(1);
                  }}

                  maxPrice={maxPrice}
                  setMaxPrice={(value) => {
                    setMaxPrice(value);
                    setCurrentPage(1);
                  }}
                  priceSliderMax={priceSliderMax}
                  brands={brands}
                  models={models}
                  fuels={fuels}
                  transmissions={transmissions}
                  years={years}
                  kilometerRanges={kilometerRanges}
                  optionsLoading={optionsLoading}
                  onClearFilters={handleClearFilters}

                  bodyTypeFilter={bodyTypeFilter}
                  setBodyTypeFilter={(value) => {
                    setBodyTypeFilter(value);
                    setCurrentPage(1);
                  }}

                  colorFilter={colorFilter}
                  setColorFilter={(value) => {
                    setColorFilter(value);
                    setCurrentPage(1);
                  }}

                  seatsFilter={seatsFilter}
                  setSeatsFilter={(value) => {
                    setSeatsFilter(value);
                    setCurrentPage(1);
                  }}

                  ownersFilter={ownersFilter}
                  setOwnersFilter={(value) => {
                    setOwnersFilter(value);
                    setCurrentPage(1);
                  }}

                  hubFilter={hubFilter}
                  setHubFilter={(value) => {
                    setHubFilter(value);
                    setCurrentPage(1);
                  }}

                  availabilityFilter={availabilityFilter}
                  setAvailabilityFilter={(value) => {
                    setAvailabilityFilter(value);
                    setCurrentPage(1);
                  }}

                  carCategoryFilter={carCategoryFilter}
                  setCarCategoryFilter={(value) => {
                    setCarCategoryFilter(value);
                    setCurrentPage(1);
                  }}

                  bodyTypes={bodyTypes}
                  colors={colors}
                  seats={seats}
                  owners={owners}
                  hubs={hubs}
                  availability={availability}
                  carCategories={carCategories}

                  safetyFeatures={safetyFeatures}
                  features={features}

                  safetyFilter={safetyFilter}
                  setSafetyFilter={(value) => {
                    setSafetyFilter(value);
                    setCurrentPage(1);
                  }}

                  featureFilter={featureFilter}
                  setFeatureFilter={(value) => {
                    setFeatureFilter(value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </aside>

          {/* RIGHT SIDE - EXISTING CARS UI */}
          <section className="min-w-0">

            {/* RESULT COUNT */}

            {!loading && (
              <div className="mt-10 flex items-center justify-between">

                <p className="text-sm font-semibold text-gray-500">

                  Showing

                  <span className="mx-2 font-black text-[#111]">
                    {
                      filteredCars.length
                    }
                  </span>

                  Cars

                </p>

                <button
                  type="button"
                  onClick={
                    handleClearFilters
                  }
                  className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold hover:border-[#ff4054]"
                >
                  Clear Filters
                </button>

              </div>
            )}

            {/* LOADING */}

            {loading ? (
              <div className="mt-24 text-center">

                <div className="animate-bounce text-6xl">
                  🚗
                </div>

                <h2 className="mt-6 text-3xl font-black">
                  Loading Cars...
                </h2>

              </div>
            ) : currentCars.length === 0 ? (
              <div className="mt-20 rounded-3xl bg-white p-16 text-center shadow">

                <h2 className="text-4xl font-black">
                  No Cars Found
                </h2>

                <p className="mt-4 text-gray-500">
                  Try changing your
                  filters.
                </p>

                <button
                  type="button"
                  onClick={
                    handleClearFilters
                  }
                  className="mt-6 rounded-xl bg-[#ff4054] px-7 py-4 font-bold text-white"
                >
                  Clear Filters
                </button>

              </div>
            ) : (
              <>
                {/* CAR GRID */}

                <div className="mt-8 grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-3">

                  {currentCars.map(
                    (car) => (
                      <Reveal
                        key={car.id}
                      >
                        <article className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-2xl">

                          {/* IMAGE */}

                          <div className="relative h-52 overflow-hidden bg-[#f4f4f4]">

                            {/* WISHLIST */}

                            <button
                              type="button"
                              onClick={() =>
                                handleWishlistToggle(
                                  car
                                )
                              }
                              aria-label={
                                isWishlisted(
                                  car.id
                                )
                                  ? "Remove from wishlist"
                                  : "Add to wishlist"
                              }
                              className="absolute right-4 top-4 z-20 rounded-full bg-white p-3 shadow-lg transition hover:scale-110"
                            >
                              <Heart
                                size={22}
                                className={
                                  isWishlisted(
                                    car.id
                                  )
                                    ? "fill-[#ff4054] text-[#ff4054]"
                                    : "text-gray-500"
                                }
                              />
                            </button>

                            {/* COMPARE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleCompare(
                                  car.id
                                )
                              }
                              aria-label={
                                compareIds.includes(
                                  car.id
                                )
                                  ? "Remove from compare"
                                  : "Add to compare"
                              }
                              className={`absolute right-4 top-16 z-20 rounded-full px-3 py-2 text-xs font-bold shadow-lg transition ${compareIds.includes(
                                car.id
                              )
                                ? "bg-[#ff4054] text-white"
                                : "bg-white text-[#111] hover:scale-105"
                                }`}
                            >
                              {compareIds.includes(
                                car.id
                              )
                                ? "✓ Compare"
                                : "+ Compare"}
                            </button>

                            {/* FRONT IMAGE */}

                            <img
                              src={
                                car.images.front ||
                                car.image ||
                                "/default-car.jpg"
                              }
                              alt={
                                car.name
                              }
                              className="h-full w-full object-cover transition duration-500 hover:scale-110"
                              onError={(event) => {
                                const target =
                                  event.currentTarget;

                                if (
                                  target.src !==
                                  window.location.origin +
                                  "/default-car.jpg"
                                ) {
                                  target.src =
                                    "/default-car.jpg";
                                }
                              }}
                            />

                          </div>

                          {/* CONTENT */}

                          <div className="p-6">

                            <div className="flex items-start justify-between">

                              <div>

                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff4054]">
                                  {car.brand}
                                </p>

                                <h2 className="mt-2 text-2xl font-black">
                                  {car.name}
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                  {
                                    car.tagline
                                  }
                                </p>

                              </div>

                              <span className="font-black text-[#ff4054]">
                                {car.price}
                              </span>

                            </div>

                            {/* SPECS */}

                            <div className="mt-6 grid grid-cols-3 gap-4 border-y py-5">

                              <div>

                                <p className="font-bold">
                                  {car.kilometers.toLocaleString()}{" "}
                                  km
                                </p>

                                <p className="text-xs uppercase text-gray-400">
                                  Driven
                                </p>

                              </div>

                              <div>

                                <p className="font-bold">
                                  {
                                    car.transmission
                                  }
                                </p>

                                <p className="text-xs uppercase text-gray-400">
                                  Gearbox
                                </p>

                              </div>

                              <div>

                                <p className="font-bold">
                                  {
                                    car.fuelType
                                  }
                                </p>

                                <p className="text-xs uppercase text-gray-400">
                                  Fuel
                                </p>

                              </div>

                            </div>

                            {/* DESCRIPTION */}

                            <p className="mt-5 line-clamp-3 text-sm leading-7 text-gray-500">
                              {
                                car.description
                              }
                            </p>

                            {/* VIEW DETAILS */}

                            <Link
                              to={`/cars/${car.id}`}
                              className="mt-7 flex w-full items-center justify-center rounded-xl bg-[#ff4054] py-4 font-bold text-white transition hover:bg-[#e6384b]"
                            >
                              View Details →
                            </Link>

                          </div>

                        </article>
                      </Reveal>
                    )
                  )}

                </div>

                {/* PAGINATION */}

                {totalPages > 1 && (
                  <div className="mt-14 flex justify-center gap-3">

                    <button
                      type="button"
                      disabled={
                        currentPage === 1
                      }
                      onClick={() =>
                        setCurrentPage(
                          (p) => p - 1
                        )
                      }
                      className="rounded-xl border px-5 py-3 disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() =>
                            setCurrentPage(
                              i + 1
                            )
                          }
                          className={`h-11 w-11 rounded-full font-bold ${currentPage ===
                            i + 1
                            ? "bg-[#ff4054] text-white"
                            : "border bg-white"
                            }`}
                        >
                          {i + 1}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      onClick={() =>
                        setCurrentPage(
                          (p) => p + 1
                        )
                      }
                      className="rounded-xl bg-[#111] px-5 py-3 text-white disabled:opacity-40"
                    >
                      Next
                    </button>

                  </div>
                )}

              </>
            )}

          </section>
        </div>

      </div>

      {/* COMPARE LIMIT NOTICE */}

      {compareLimitNotice && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#111] px-5 py-3 text-sm font-semibold text-white shadow-lg">
          You can compare up to{" "}
          {MAX_COMPARE} cars at a
          time
        </div>
      )}

      {/* COMPARE BAR */}

      <CompareBar />

    </main>
  );
};

export default BuyCars;