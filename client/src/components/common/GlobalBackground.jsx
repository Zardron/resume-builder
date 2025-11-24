import { useTheme } from '../../contexts/ThemeContext';

const GlobalBackground = () => {
  const { isDark } = useTheme();
  const stroke = isDark ? '#FFFFFF' : '#2563eb';
  
  return (
    <svg
      className="size-full fixed top-0 left-0 -z-10 opacity-[0.08] pointer-events-none"
      width="1440"
      height="720"
      viewBox="0 0 1440 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path stroke={stroke} strokeOpacity="1" d="M-15.227 702.342H1439.7" />
      <circle cx="711.819" cy="372.562" r="308.334" stroke={stroke} strokeOpacity="1" />
      <circle cx="16.942" cy="20.834" r="308.334" stroke={stroke} strokeOpacity="1" />
      <path stroke={stroke} strokeOpacity="1" d="M-15.227 573.66H1439.7M-15.227 164.029H1439.7" />
      <circle cx="782.595" cy="411.166" r="308.334" stroke={stroke} strokeOpacity="1" />
    </svg>
  );
};

export default GlobalBackground;

