import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader = ({
  onMenuClick,
}: AdminHeaderProps) => {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-16
        items-center
        border-b
        border-gray-200
        bg-white/95
        px-4
        shadow-sm
        backdrop-blur
        lg:hidden
      "
    >
      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open admin menu"
        className="
          rounded-xl
          bg-gray-100
          p-2.5
          text-gray-700
          transition
          hover:bg-gray-200
          active:scale-95
        "
      >
        <Menu size={22} />
      </button>

      {/* BRAND */}
      <div className="ml-4 min-w-0">
        <h2 className="font-black text-gray-900">
          Auto
          <span className="text-[#ff4054]">
            Lux
          </span>
        </h2>

        <p className="text-xs text-gray-500">
          Admin Panel
        </p>
      </div>
    </header>
  );
};

export default AdminHeader;