import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  const [showScrollTop, setShowScrollTop] =
    useState(false);

  // =========================================
  // SHOW / HIDE TOP BUTTON
  // =========================================

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // =========================================
  // SCROLL TO TOP WHEN ROUTE CHANGES
  // =========================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    setShowScrollTop(false);
  }, [pathname]);

  // =========================================
  // SCROLL TO TOP
  // =========================================

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showScrollTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label="Scroll to top"
          className="
            fixed
            bottom-24
            right-5
            z-[9999]

            flex
            items-center
            gap-1.5

            rounded-full
            bg-[#ff4054]
            px-4
            py-2.5

            text-sm
            font-bold
            text-white

            shadow-xl

            transition-all
            duration-300
            ease-out

            hover:scale-105
            hover:shadow-2xl

            active:scale-95
          "
        >
          <span>Top</span>

          <ChevronUp
            size={18}
            strokeWidth={2.5}
          />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;