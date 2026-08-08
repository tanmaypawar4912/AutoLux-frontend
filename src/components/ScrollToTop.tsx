import { useEffect, useState } from "react";

const ScrollToTop = () => {

  const [showButton, setShowButton] = useState(false);


  useEffect(() => {

    const handleScroll = () => {

      setShowButton(window.scrollY > 400);

    };


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


  const scrollToTop = () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  if (!showButton) {
    return null;
  }


  return (

    <button
      onClick={scrollToTop}
      className="
        fixed
        bottom-6
        right-6
        z-40
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        bg-[#ff4054]
        text-xl
        text-white
        shadow-xl
        transition
        duration-300
        hover:-translate-y-1
        hover:bg-[#e9364a]
      "
      aria-label="Scroll to top"
    >
      ↑
    </button>

  );

};


export default ScrollToTop;