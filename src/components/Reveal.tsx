import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
}

const Reveal = ({ children, className = "" }: RevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          observer.unobserve(element);
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`
        transition-all
        duration-1000
        ease-out

        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0"
        }

        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Reveal;