interface Props {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const AdminStats = ({
  total,
  pending,
  approved,
  rejected,
}: Props) => {
  const cards = [
    {
      title: "Total Cars",
      value: total,
      color: "bg-blue-500",
    },
    {
      title: "Pending",
      value: pending,
      color: "bg-yellow-500",
    },
    {
      title: "Approved",
      value: approved,
      color: "bg-green-500",
    },
    {
      title: "Rejected",
      value: rejected,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl bg-white p-6 shadow"
        >
          <div
            className={`h-3 w-14 rounded-full ${card.color}`}
          />

          <h3 className="mt-5 text-gray-500">
            {card.title}
          </h3>

          <p className="mt-3 text-4xl font-black">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;