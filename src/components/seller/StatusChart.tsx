import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface Car {
  status: string;
}

interface Props {
  cars: Car[];
}

const StatusChart = ({ cars }: Props) => {

  const approved = cars.filter(
    (car) => car.status === "approved"
  ).length;

  const pending = cars.filter(
    (car) => car.status === "pending"
  ).length;

  const rejected = cars.filter(
    (car) => car.status === "rejected"
  ).length;

  const data = {
    labels: [
      "Approved",
      "Pending",
      "Rejected",
    ],

    datasets: [
      {
        label: "Cars",

        data: [
          approved,
          pending,
          rejected,
        ],

        backgroundColor: [
          "#22c55e",
          "#facc15",
          "#ef4444",
        ],

        hoverBackgroundColor: [
          "#16a34a",
          "#eab308",
          "#dc2626",
        ],

        borderWidth: 0,
      },
    ],
  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {

        position: "bottom" as const,

        labels: {

          padding: 20,

          font: {

            size: 14,

            weight: "bold" as const,
          },
        },
      },
    },
  };

  return (

    <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg">

      <h2 className="mb-8 text-3xl font-black">

        Car Status Overview

      </h2>

      <div className="mx-auto h-[380px] max-w-md">

        <Doughnut

          data={data}

          options={options}

        />

      </div>

      <div className="mt-10 grid grid-cols-3 gap-6 text-center">

        <div>

          <h3 className="text-4xl font-black text-green-500">

            {approved}

          </h3>

          <p className="mt-2 text-gray-500">

            Approved

          </p>

        </div>

        <div>

          <h3 className="text-4xl font-black text-yellow-500">

            {pending}

          </h3>

          <p className="mt-2 text-gray-500">

            Pending

          </p>

        </div>

        <div>

          <h3 className="text-4xl font-black text-red-500">

            {rejected}

          </h3>

          <p className="mt-2 text-gray-500">

            Rejected

          </p>

        </div>

      </div>

    </div>

  );

};

export default StatusChart;