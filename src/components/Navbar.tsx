import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";

import {
  clearWishlist,
  getWishlist,
  WISHLIST_EVENT,
} from "../utils/storage";

import { API } from "../utils/api";

const Navbar = () => {
  const { user } = useUser();

  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const location = useLocation();

  const isAdmin =
    user?.publicMetadata?.role === "admin";

  const isHomePage =
    location.pathname === "/";

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    isScrolled,
    setIsScrolled,
  ] = useState(false);

  const [
    wishlistCount,
    setWishlistCount,
  ] = useState(0);

  // =====================================
  // SCROLL EFFECT
  // =====================================

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // =====================================
  // CLOSE MOBILE MENU
  // =====================================

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // =====================================
  // CLOSE MOBILE MENU ON DESKTOP RESIZE
  // =====================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  // =====================================
  // FETCH PERSONAL WISHLIST COUNT
  // FROM MONGODB
  // =====================================

  useEffect(() => {
    let cancelled = false;

    const fetchWishlistCount = async () => {

      // ---------------------------------
      // CLERK NOT READY
      // ---------------------------------

      if (!isLoaded) {
        return;
      }

      // ---------------------------------
      // USER LOGGED OUT
      // ---------------------------------

      if (!isSignedIn) {
        clearWishlist();

        if (!cancelled) {
          setWishlistCount(0);
        }

        return;
      }

      try {
        const token = await getToken();

        if (!token) {
          if (!cancelled) {
            setWishlistCount(0);
          }

          return;
        }

        // ---------------------------------
        // GET CURRENT USER WISHLIST
        // ---------------------------------

        const response = await fetch(
          `${API}/wishlist/me`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              Accept:
                "application/json",
            },

            credentials:
              "include",
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to fetch wishlist."
          );
        }

        if (!cancelled) {
          const count =
            Array.isArray(
              data.wishlist
            )
              ? data.wishlist.length
              : 0;

          setWishlistCount(count);
        }

      } catch (error) {
        console.error(
          "Navbar Wishlist Error:",
          error
        );

        // ---------------------------------
        // FALLBACK TO LOCAL CACHE
        // Only when logged in
        // ---------------------------------

        if (!cancelled) {
          setWishlistCount(
            getWishlist().length
          );
        }
      }
    };

    fetchWishlistCount();

    return () => {
      cancelled = true;
    };

  }, [
    isLoaded,
    isSignedIn,
    getToken,
    location.pathname,
  ]);

  // =====================================
  // WISHLIST LOCAL EVENT
  // Keeps existing heart functionality
  // working without changing UI
  // =====================================

  useEffect(() => {

    if (!isLoaded) {
      return;
    }

    // -----------------------------------
    // LOGGED OUT
    // -----------------------------------

    if (!isSignedIn) {
      setWishlistCount(0);
      return;
    }

    const syncWishlistCount = () => {

      // We use local cache only
      // as immediate UI update.

      setWishlistCount(
        getWishlist().length
      );
    };

    window.addEventListener(
      WISHLIST_EVENT,
      syncWishlistCount
    );

    window.addEventListener(
      "storage",
      syncWishlistCount
    );

    return () => {

      window.removeEventListener(
        WISHLIST_EVENT,
        syncWishlistCount
      );

      window.removeEventListener(
        "storage",
        syncWishlistCount
      );
    };

  }, [
    isLoaded,
    isSignedIn,
  ]);

  // =====================================
  // NAVIGATION LINKS
  // =====================================

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Buy Cars",
      path: "/cars",
    },
    {
      name: "Sell Your Car",
      path: "/sell",
    },
    {
      name: "My Cars",
      path: "/my-cars",
    },
    {
      name: "About Us",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  // =====================================
  // CLOSE MENU
  // =====================================

  const closeMenu = () => {
    setIsOpen(false);
  };

  // =====================================
  // HEADER STYLE
  // =====================================

  const headerBackground =
    isHomePage
      ? isScrolled
        ? "bg-black/90 border-b border-white/10 shadow-lg backdrop-blur-xl"
        : "bg-black/20 backdrop-blur-md"
      : "bg-black border-b border-white/10 shadow-lg";

  const navbar = (
    <header
      className={`
        fixed
        left-0
        right-0
        top-0
        z-[9999]
        w-full
        isolate
        transition-all
        duration-300
        ${headerBackground}
      `}
    >

      {/* =====================================
          NAVBAR CONTAINER
      ====================================== */}

      <nav
        className="
          relative
          mx-auto
          flex
          h-16
          w-full
          lg:h-20
          items-center
          justify-between
          gap-4
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* LOGO */}

        <NavLink
          to="/"
          onClick={closeMenu}
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              bg-white
              shadow-md
            "
          >
            <img
              src="/Autolux-logo.png"
              alt="AutoLux Logo"
              className="h-9 w-9 object-contain"
            />
          </div>

          <div className="hidden sm:block">

            <h1
              className="
                text-lg
                font-black
                leading-none
                text-white
              "
            >
              Auto
              <span className="text-[#ff4054]">
                Lux
              </span>
            </h1>

            <p
              className="
                mt-1
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-gray-400
              "
            >
              Premium Cars
            </p>

          </div>

        </NavLink>

        {/* =====================================
            DESKTOP MENU
        ====================================== */}

        <div
          className="
            hidden
            min-w-0
            flex-1
            items-center
            justify-end
            gap-3
            lg:flex
            xl:gap-4
            2xl:gap-6
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              xl:gap-4
              2xl:gap-6
            "
          >

            {navLinks.map(
              (link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({
                    isActive,
                  }) =>
                    `
                      whitespace-nowrap
                      text-xs
                      font-semibold
                      transition
                      duration-200
                      2xl:text-sm

                      ${
                        isActive
                          ? "text-[#ff4054]"
                          : "text-white hover:text-[#ff4054]"
                      }
                    `
                  }
                >
                  {link.name}
                </NavLink>
              )
            )}

            {/* ADMIN */}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({
                  isActive,
                }) =>
                  `
                    whitespace-nowrap
                    text-xs
                    font-semibold
                    transition
                    duration-200
                    2xl:text-sm

                    ${
                      isActive
                        ? "text-[#ff4054]"
                        : "text-white hover:text-[#ff4054]"
                    }
                  `
                }
              >
                Admin Dashboard
              </NavLink>
            )}

          </div>

          {/* RIGHT SIDE */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-3
            "
          >

            {/* =================================
                WISHLIST
            ================================= */}

            <NavLink
              to="/wishlist"
              aria-label="Wishlist"
              className="
                relative
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/20
                text-lg
                text-white
                transition
                duration-200
                hover:border-[#ff4054]
                hover:text-[#ff4054]
              "
            >

              ♥

              {isSignedIn &&
                wishlistCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-[#ff4054]
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    {wishlistCount}
                  </span>
                )}

            </NavLink>

            {/* LOGIN */}

            <SignedOut>

              <SignInButton
                mode="modal"
              >
                <button
                  type="button"
                  className="
                    whitespace-nowrap
                    rounded-xl
                    border
                    border-white/20
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-white
                    transition
                    duration-200
                    hover:border-[#ff4054]
                    hover:text-[#ff4054]
                  "
                >
                  Login
                </button>
              </SignInButton>

            </SignedOut>

            {/* USER */}

            <SignedIn>

              <div className="flex shrink-0 items-center">
                <UserButton />
              </div>

            </SignedIn>

            {/* CTA */}

            <NavLink
              to="/book-test-drive"
              className="
                whitespace-nowrap
                rounded-xl
                bg-[#ff4054]
                px-4
                py-3
                text-xs
                font-bold
                text-white
                shadow-lg
                shadow-[#ff4054]/20
                transition
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#e9364a]
                2xl:px-5
                2xl:text-sm
              "
            >
              Book A Test Drive →
            </NavLink>

          </div>

        </div>

      </nav>

      {/* =====================================
          MOBILE MENU
      ====================================== */}

      {isOpen && (
        <div
          className="
            max-h-[calc(100vh-4rem)]
            overflow-y-auto
            border-t
            border-white/10
            bg-black
            px-4
            py-5
            shadow-2xl
            sm:px-6
            lg:hidden
          "
        >

          <div className="space-y-2">

            {navLinks.map(
              (link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={({
                    isActive,
                  }) =>
                    `
                      block
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      transition
                      duration-200

                      ${
                        isActive
                          ? "bg-[#ff4054]/10 text-[#ff4054]"
                          : "text-white hover:bg-white/5 hover:text-[#ff4054]"
                      }
                    `
                  }
                >
                  {link.name}
                </NavLink>
              )
            )}

            {/* MOBILE ADMIN */}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={closeMenu}
                className={({
                  isActive,
                }) =>
                  `
                    block
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    transition
                    duration-200

                    ${
                      isActive
                        ? "bg-[#ff4054]/10 text-[#ff4054]"
                        : "text-white hover:bg-white/5 hover:text-[#ff4054]"
                    }
                  `
                }
              >
                Admin Dashboard
              </NavLink>
            )}

            {/* MOBILE WISHLIST */}

            <NavLink
              to="/wishlist"
              onClick={closeMenu}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                px-4
                py-3
                text-sm
                font-semibold
                text-white
                transition
                duration-200
                hover:bg-white/5
                hover:text-[#ff4054]
              "
            >

              <span>
                Wishlist
              </span>

              {isSignedIn &&
                wishlistCount > 0 && (
                  <span
                    className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      bg-[#ff4054]
                      text-xs
                      font-bold
                      text-white
                    "
                  >
                    {wishlistCount}
                  </span>
                )}

            </NavLink>

          </div>

          {/* MOBILE AUTH */}

          <div className="mt-5">

            <SignedOut>

              <SignInButton
                mode="modal"
              >
                <button
                  type="button"
                  onClick={closeMenu}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/20
                    px-4
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    transition
                    duration-200
                    hover:border-[#ff4054]
                    hover:text-[#ff4054]
                  "
                >
                  Login
                </button>
              </SignInButton>

            </SignedOut>

            <SignedIn>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-3
                "
              >

                <UserButton />

                <span className="text-sm font-semibold text-white">
                  My Account
                </span>

              </div>

            </SignedIn>

          </div>

          {/* MOBILE CTA */}

          <NavLink
            to="/book-test-drive"
            onClick={closeMenu}
            className="
              mt-4
              block
              rounded-xl
              bg-[#ff4054]
              px-4
              py-3.5
              text-center
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-[#ff4054]/20
              transition
              duration-300
              hover:bg-[#e9364a]
            "
          >
            Book A Test Drive →
          </NavLink>

        </div>
      )}

    </header>
  );

  /*
   * MOBILE MENU BUTTON FIX
   *
   * Buy Cars contains scrolling/overflow containers.
   * Mount the SAME existing button directly on document.body
   * so those containers cannot hide or clip it.
   *
   * No Buy Cars UI/functionality is changed.
   */
  const mobileMenuButton =
    typeof document !== "undefined"
      ? createPortal(
          <button
            type="button"
            onClick={() =>
              setIsOpen(
                (prev) => !prev
              )
            }
            aria-label={
              isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="
              fixed
              right-4
              top-3
              z-[2147483647]
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/20
              bg-black/90
              text-xl
              text-white
              shadow-lg
              transition
              duration-200
              hover:border-[#ff4054]
              hover:text-[#ff4054]
              lg:hidden
            "
            style={{
              position: "fixed",
              right: "16px",
              top: "12px",
              zIndex: 2147483647,
            }}
          >
            {isOpen ? "✕" : "☰"}
          </button>,
          document.body
        )
      : null;

  return (
    <>
      {navbar}
      {mobileMenuButton}
    </>
  );
};

export default Navbar;