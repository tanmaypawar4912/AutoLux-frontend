import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../utils/api";

interface CarForm {
    brand: string;
    model: string;
    year: number;
    price: number;
    kilometers: number;
    fuelType: string;
    transmission: string;
    city: string;
    description: string;
    image: string;
}

const EditCar = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [uploadingImage, setUploadingImage] = useState(false);

    const [carData, setCarData] = useState<CarForm>({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        kilometers: 0,
        fuelType: "",
        transmission: "",
        city: "",
        description: "",
        image: "",
    });

    // ==========================
    // Upload New Photo (Cloudinary)
    // ==========================

    const uploadImage = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setUploadingImage(true);

        const formData = new FormData();

        formData.append("file", file);

        formData.append(
            "upload_preset",
            import.meta.env.VITE_UPLOAD_PRESET
        );

        formData.append(
            "cloud_name",
            import.meta.env.VITE_CLOUD_NAME
        );

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME
                }/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            setCarData((prev) => ({
                ...prev,
                image: data.secure_url,
            }));
        } catch (error) {
            console.error(error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };

    // ==========================
    // Fetch Car Details
    // ==========================

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await fetch(
                    `${API}/cars/${id}`
                );

                const data = await response.json();

                if (data.success) {
                    setCarData({
                        brand: data.car.brand,
                        model: data.car.model,
                        year: data.car.year,
                        price: data.car.price,
                        kilometers: data.car.kilometers,
                        fuelType: data.car.fuelType,
                        transmission: data.car.transmission,
                        city: data.car.city || "",
                        description: data.car.description,
                        image: data.car.image,
                    });
                } else {
                    alert("Car not found");
                    navigate("/my-cars");
                }
            } catch (error) {
                console.error(error);
                alert("Failed to load car details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id, navigate]);

    // ==========================
    // Handle Input Change
    // ==========================

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setCarData((prev) => ({
            ...prev,
            [e.target.name]:
                e.target.type === "number"
                    ? Number(e.target.value)
                    : e.target.value,
        }));
    };
    // ==========================
    // Loading Screen
    // ==========================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <h2 className="text-2xl font-bold">Loading Car Details...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-32">

            <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl">

                <h1 className="mb-8 text-center text-4xl font-black">
                    Edit Car
                </h1>

                {/* Current Image */}

                <div className="mb-8">

                    <img
                        src={carData.image}
                        alt={carData.model}
                        className="h-72 w-full rounded-2xl object-cover"
                    />

                    <label className="mb-2 mt-4 block font-bold">
                        Change Photo
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={uploadImage}
                        className="w-full rounded-xl border p-3"
                    />

                    {uploadingImage && (
                        <p className="mt-2 text-sm font-semibold text-[#ff4054]">
                            Uploading new photo...
                        </p>
                    )}

                </div>

                <div className="grid gap-6 md:grid-cols-2">

                    {/* Brand */}

                    <div>

                        <label className="mb-2 block font-bold">
                            Brand
                        </label>

                        <input
                            type="text"
                            name="brand"
                            value={carData.brand}
                            onChange={handleChange}
                            className="w-full rounded-xl border p-3 outline-none focus:border-[#ff4054]"
                        />

                    </div>

                    {/* Model */}

                    <div>

                        <label className="mb-2 block font-bold">
                            Model
                        </label>

                        <input
                            type="text"
                            name="model"
                            value={carData.model}
                            onChange={handleChange}
                            className="w-full rounded-xl border p-3 outline-none focus:border-[#ff4054]"
                        />

                    </div>

                    {/* Year */}

                    <div>

                        <label className="mb-2 block font-bold">
                            Year
                        </label>

                        <input
                            type="number"
                            name="year"
                            value={carData.year}
                            onChange={handleChange}
                            className="w-full rounded-xl border p-3 outline-none focus:border-[#ff4054]"
                        />

                    </div>

                    {/* Price */}

                    <div>

                        <label className="mb-2 block font-bold">
                            Price
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={carData.price}
                            onChange={handleChange}
                            className="w-full rounded-xl border p-3 outline-none focus:border-[#ff4054]"
                        />

                    </div>

                    {/* Kilometers */}

                    <div>

                        <label className="mb-2 block font-bold">
                            Kilometers
                        </label>

                        <input
                            type="number"
                            name="kilometers"
                            value={carData.kilometers}
                            onChange={handleChange}
                            className="w-full rounded-xl border p-3 outline-none focus:border-[#ff4054]"
                        />

                    </div>

                    {/* Fuel */}

                    <div>

                        <label className="mb-2 block font-bold">
                            Fuel Type
                        </label>

                        <select
                            name="fuelType"
                            value={carData.fuelType}
                            onChange={handleChange}
                            className="w-full rounded-xl border p-3 outline-none focus:border-[#ff4054]"
                        >
                            <option value="">Select Fuel</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="CNG">CNG</option>
                            <option value="Electric">Electric</option>
                        </select>

                    </div>

                    {/* Transmission */}

                    <div>

                        <label className="mb-2 block font-bold">
                            Transmission
                        </label>

                        <select
                            name="transmission"
                            value={carData.transmission}
                            onChange={handleChange}
                            className="w-full rounded-xl border p-3 outline-none focus:border-[#ff4054]"
                        >
                            <option value="">Select Transmission</option>
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                        </select>

                    </div>

                    {/* City */}

                    <div>

                        <label className="mb-2 block font-bold">
                            City
                        </label>

                        <input
                            type="text"
                            name="city"
                            value={carData.city}
                            onChange={handleChange}
                            placeholder="e.g. Pune"
                            className="w-full rounded-xl border p-3 outline-none focus:border-[#ff4054]"
                        />

                    </div>

                </div>

                {/* Description */}

                <div className="mt-6">

                    <label className="mb-2 block font-bold">
                        Description
                    </label>

                    <textarea
                        rows={5}
                        name="description"
                        value={carData.description}
                        onChange={handleChange}
                        className="w-full rounded-xl border p-3 outline-none focus:border-[#ff4054]"
                    />

                </div>
                {/* Buttons */}

                <div className="mt-8 flex flex-col gap-4 md:flex-row">

                    <button
                        onClick={async () => {
                            try {
                                setSaving(true);

                                const response = await fetch(
                                    `${API}/cars/${id}`,
                                    {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(carData),
                                    }
                                );

                                const data = await response.json();

                                if (data.success) {
                                    alert("Car updated successfully!");

                                    navigate("/my-cars");
                                } else {
                                    alert(data.message);
                                }
                            } catch (error) {
                                console.error(error);
                                alert("Failed to update car.");
                            } finally {
                                setSaving(false);
                            }
                        }}
                        disabled={saving || uploadingImage}
                        className="flex-1 rounded-xl bg-[#ff4054] py-4 text-lg font-bold text-white transition hover:bg-[#e6364a] disabled:opacity-60"
                    >
                        {saving ? "Updating..." : "Save Changes"}
                    </button>

                    <button
                        onClick={() => navigate("/my-cars")}
                        className="flex-1 rounded-xl border-2 border-gray-300 py-4 text-lg font-bold transition hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>
    );
};

export default EditCar;