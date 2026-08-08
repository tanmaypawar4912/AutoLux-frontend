interface Props {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const AdminSearch = ({
  search,
  setSearch,
}: Props) => {
  return (
    <div className="mt-8 flex justify-between gap-4">

      <input
        type="text"
        placeholder="Search by Brand, Model or Seller..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-5 py-3 outline-none focus:border-[#ff4054]"
      />

    </div>
  );
};

export default AdminSearch;