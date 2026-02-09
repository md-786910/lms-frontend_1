import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const ScrollRevealSection = ({
  as: Component = "section",
  children,
  className,
  delay = 0,
  threshold = 0.25,
  ...rest
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Component
      ref={ref}
      className={clsx(
        "transform transition-all duration-700 ease-out will-change-transform",
        className,
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default ScrollRevealSection;
