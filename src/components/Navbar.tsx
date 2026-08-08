import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { getWishlist, WISHLIST_EVENT } from "../utils/storage";

const Navbar = () => {

  const { user } = useUser();

  const isAdmin =
    user?.publicMetadata?.role === "admin";

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const syncWishlistCount = () => setWishlistCount(getWishlist().length);
    syncWishlistCount();

    window.addEventListener(WISHLIST_EVENT, syncWishlistCount);
    window.addEventListener("storage", syncWishlistCount);

    return () => {
      window.removeEventListener(WISHLIST_EVENT, syncWishlistCount);
      window.removeEventListener("storage", syncWishlistCount);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Buy Cars", path: "/cars" },
    { name: "Sell Your Car", path: "/sell" },
    {name: "My Cars",path: "/my-cars",},
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? "bg-white/90 shadow-lg backdrop-blur-xl"
        : "bg-white"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

        {/* LOGO */}
        <NavLink
          to="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md">
            <img
              src="/Autolux-logo.png"
              alt="AutoLux Logo"
              className="h-10 w-10 object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl font-black text-gray-900">
              Auto<span className="text-[#ff4054]">Lux</span>
            </h1>

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">
              Premium Cars
            </p>
          </div>
        </NavLink>


        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-8 lg:flex">

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive
                  ? "text-[#ff4054]"
                  : "text-gray-600 hover:text-[#ff4054]"
                }`
              }
            >
              {link.name}
            </NavLink>

          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive
                  ? "text-[#ff4054]"
                  : "text-gray-600 hover:text-[#ff4054]"
                }`
              }
            >
              Admin Dashboard
            </NavLink>
          )}

          {/* WISHLIST */}
          <NavLink
            to="/wishlist"
            aria-label="Wishlist"
            className="relative rounded-xl border border-gray-200 px-4 py-3 text-lg transition hover:border-[#ff4054]"
          >
            ♥
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4054] text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          {/* LOGIN */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-[#ff4054] hover:text-[#ff4054]">
                Login
              </button>
            </SignInButton>
          </SignedOut>

          {/* USER PROFILE */}
          <SignedIn>
            <UserButton />
          </SignedIn>

          {/* CTA */}
          <NavLink
            to="/contact"
            className="rounded-xl bg-[#ff4054] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e9364a]"
          >
            Book A Test Drive →
          </NavLink>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl bg-gray-100 px-4 py-3 text-xl lg:hidden"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-5 lg:hidden">

          <div className="space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                {link.name}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Admin Dashboard
              </NavLink>
            )}
            <NavLink
              to="/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Wishlist
              {wishlistCount > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4054] text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
          </div>

          {/* MOBILE AUTH */}
          <div className="mt-4">

            <SignedOut>
              <SignInButton mode="modal">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-4 font-bold text-gray-700"
                >
                  Login
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3 px-4 py-3">
                <UserButton />
                <span className="font-semibold text-gray-700">
                  My Account
                </span>
              </div>
            </SignedIn>

          </div>

          {/* MOBILE CTA */}
          <NavLink
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="mt-4 block rounded-xl bg-[#ff4054] px-4 py-4 text-center font-bold text-white"
          >
            Book A Test Drive →
          </NavLink>

        </div>
      )}
    </header>
  );
};

export default Navbar;