interface Car {
  _id: string;
  brand: string;
  model: string;
  price: number;
  status: string;
  views?: number;
}

interface AnalyticsProps {
  cars: Car[];
  enquiryCount?: number;
}

const Analytics = ({ cars, enquiryCount = 0 }: AnalyticsProps) => {
  const totalCars = cars.length;

  const totalViews = cars.reduce(
    (sum, car) => sum + (car.views || 0),
    0
  );

  const approvedCars = cars.filter(
    (car) => car.status === "approved"
  ).length;

  const pendingCars = cars.filter(
    (car) => car.status === "pending"
  ).length;

  const rejectedCars = cars.filter(
    (car) => car.status === "rejected"
  ).length;

  const totalValue = cars.reduce(
    (sum, car) => sum + car.price,
    0
  );

  const averagePrice =
    totalCars > 0
      ? Math.round(totalValue / totalCars)
      : 0;

  const highestPrice =
    totalCars > 0
      ? Math.max(...cars.map((car) => car.price))
      : 0;

  const lowestPrice =
    totalCars > 0
      ? Math.min(...cars.map((car) => car.price))
      : 0;

  const approvedPercent =
    totalCars > 0
      ? (approvedCars / totalCars) * 100
      : 0;

  const pendingPercent =
    totalCars > 0
      ? (pendingCars / totalCars) * 100
      : 0;

  const rejectedPercent =
    totalCars > 0
      ? (rejectedCars / totalCars) * 100
      : 0;

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg">

      <h2 className="mb-8 text-3xl font-black">
        Analytics
      </h2>

      {/* Cards */}

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl bg-blue-50 p-6">

          <p className="text-gray-500">
            Average Price
          </p>

          <h3 className="mt-2 text-3xl font-black text-blue-600">
            ₹{averagePrice.toLocaleString("en-IN")}
          </h3>

        </div>

        <div className="rounded-2xl bg-green-50 p-6">

          <p className="text-gray-500">
            Highest Price
          </p>

          <h3 className="mt-2 text-3xl font-black text-green-600">
            ₹{highestPrice.toLocaleString("en-IN")}
          </h3>

        </div>

        <div className="rounded-2xl bg-red-50 p-6">

          <p className="text-gray-500">
            Lowest Price
          </p>

          <h3 className="mt-2 text-3xl font-black text-red-600">
            ₹{lowestPrice.toLocaleString("en-IN")}
          </h3>

        </div>

      </div>

      {/* Engagement */}

      <div className="mt-6 grid gap-6 md:grid-cols-2">

        <div className="rounded-2xl bg-purple-50 p-6">

          <p className="text-gray-500">
            Total Listing Views
          </p>

          <h3 className="mt-2 text-3xl font-black text-purple-600">
            {totalViews.toLocaleString("en-IN")}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Across all your listings
          </p>

        </div>

        <div className="rounded-2xl bg-orange-50 p-6">

          <p className="text-gray-500">
            Buyer Enquiries
          </p>

          <h3 className="mt-2 text-3xl font-black text-orange-600">
            {enquiryCount.toLocaleString("en-IN")}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Messages received about your cars
          </p>

        </div>

      </div>

      {/* Status */}

      <div className="mt-10 space-y-6">

        {/* Approved */}

        <div>

          <div className="mb-2 flex justify-between font-semibold">

            <span>Approved</span>

            <span>
              {approvedCars} ({approvedPercent.toFixed(0)}%)
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full rounded-full bg-green-500"
              style={{
                width: `${approvedPercent}%`,
              }}
            />

          </div>

        </div>

        {/* Pending */}

        <div>

          <div className="mb-2 flex justify-between font-semibold">

            <span>Pending</span>

            <span>
              {pendingCars} ({pendingPercent.toFixed(0)}%)
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full rounded-full bg-yellow-500"
              style={{
                width: `${pendingPercent}%`,
              }}
            />

          </div>

        </div>

        {/* Rejected */}

        <div>

          <div className="mb-2 flex justify-between font-semibold">

            <span>Rejected</span>

            <span>
              {rejectedCars} ({rejectedPercent.toFixed(0)}%)
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full rounded-full bg-red-500"
              style={{
                width: `${rejectedPercent}%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default Analytics;