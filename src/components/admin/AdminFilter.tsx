interface Props {
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const AdminFilter = ({ status, setStatus }: Props) => {
  return (
    <div className="flex gap-3 flex-wrap">

      <button
        onClick={() => setStatus("all")}
        className={`rounded-xl px-5 py-3 font-semibold transition
        ${
          status === "all"
            ? "bg-[#ff4054] text-white"
            : "bg-white border"
        }`}
      >
        All
      </button>

      <button
        onClick={() => setStatus("pending")}
        className={`rounded-xl px-5 py-3 font-semibold transition
        ${
          status === "pending"
            ? "bg-yellow-500 text-white"
            : "bg-white border"
        }`}
      >
        Pending
      </button>

      <button
        onClick={() => setStatus("approved")}
        className={`rounded-xl px-5 py-3 font-semibold transition
        ${
          status === "approved"
            ? "bg-green-500 text-white"
            : "bg-white border"
        }`}
      >
        Approved
      </button>

      <button
        onClick={() => setStatus("rejected")}
        className={`rounded-xl px-5 py-3 font-semibold transition
        ${
          status === "rejected"
            ? "bg-red-500 text-white"
            : "bg-white border"
        }`}
      >
        Rejected
      </button>

    </div>
  );
};

export default AdminFilter;