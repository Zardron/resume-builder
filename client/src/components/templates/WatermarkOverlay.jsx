import { useEffect, useMemo, useRef, useState } from "react";
import WATERMARK_LOGO from "../../assets/logo.png";

const PAGE_HEIGHT_MAP = {
  short: 1056,
  A4: 1123,
  legal: 1344,
};

const WatermarkOverlay = ({
  className = "",
  logo = WATERMARK_LOGO,
  logoAlt = "ResumeIQ watermark",
  paperSize = "A4",
}) => {
  const containerRef = useRef(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  const pageHeightPx = useMemo(
    () => PAGE_HEIGHT_MAP[paperSize] || PAGE_HEIGHT_MAP.A4,
    [paperSize]
  );

  useEffect(() => {
    const overlayElement = containerRef.current;
    if (!overlayElement) {
      return undefined;
    }

    const target =
      overlayElement.parentElement instanceof HTMLElement
        ? overlayElement.parentElement
        : overlayElement;

    const updateHeight = () => {
      const height = target.offsetHeight || pageHeightPx;
      setMeasuredHeight(Math.max(height, pageHeightPx));
    };

    updateHeight();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateHeight);
      observer.observe(target);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [pageHeightPx]);

  if (!logo) {
    return null;
  }

  const pageCount = Math.max(
    1,
    Math.ceil(measuredHeight / Math.max(pageHeightPx, 1))
  );
  const totalOverlayHeight = pageCount * pageHeightPx;

  return (
    <div
      ref={containerRef}
      className={`watermark-overlay pointer-events-none absolute inset-0 select-none ${className}`}
      aria-hidden="true"
      style={{
        height: `${totalOverlayHeight}px`,
        overflow: "visible",
      }}
    >
      {Array.from({ length: pageCount }).map((_, index) => (
        <div
          key={`watermark-${index}`}
          className="absolute inset-x-0 flex flex-col items-center justify-center"
          style={{
            top: `${index * pageHeightPx}px`,
            height: `${pageHeightPx}px`,
          }}
    >
      <img
        src={logo}
        alt={logoAlt}
        className="max-w-[60%] w-[320px] opacity-10 print:opacity-20"
      />
          <p className="mt-6 px-6 text-center text-[10px] text-gray-400 italic">
            This resume was generated with ResumeIQ by Zardron Angelo
            Pesquera.
          </p>
        </div>
      ))}
    </div>
  );
};

export default WatermarkOverlay;
