import WATERMARK_LOGO from "../../assets/logo.png";

const WatermarkOverlay = ({
  className = "",
  logo = WATERMARK_LOGO,
  logoAlt = "Resume Builder watermark",
}) => {
  if (!logo) {
    return null;
  }
  const watermarkText = (
    <>
      This resume was generated with Resume Builder by Zardron Angelo Pesquera.
    </>
  );

  return (
    <>
    <div
      className={`pointer-events-none absolute inset-0 grid place-items-center select-none ${className}`}
      aria-hidden="true"
    >
      <img
        src={logo}
        alt={logoAlt}
        className="max-w-[60%] w-[320px] opacity-10 print:opacity-20"
      />
       
    </div>
    <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-gray-400 italic">{watermarkText}  </p>
  </>
  );
};

export default WatermarkOverlay;
