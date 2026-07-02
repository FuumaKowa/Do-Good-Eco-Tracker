import React from "react";

interface BrandLogoProps {
  mode?: "emblem" | "full";
  className?: string;
  size?: number; // Used for emblem mode sizing
}

export default function BrandLogo({ mode = "emblem", className = "", size = 24 }: BrandLogoProps) {
  // Brand gold/bronze colors from the original logo
  const goldColor = "#bca05c"; // Elegant champagne gold

  if (mode === "emblem") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} shrink-0`}
        id="do-good-emblem-svg"
      >
        {/* Outer Concentric Rings */}
        <circle cx="50" cy="50" r="44" stroke={goldColor} strokeWidth="1.5" fill="none" />
        <circle cx="50" cy="50" r="41" stroke={goldColor} strokeWidth="2.5" fill="none" />

        {/* Central Sun/Spokes */}
        <circle cx="50" cy="50" r="6" stroke={goldColor} strokeWidth="2" fill="none" />
        {/* Spokes */}
        <line x1="50" y1="36" x2="50" y2="41" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="59" x2="50" y2="64" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="50" x2="41" y2="50" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="59" y1="50" x2="64" y2="50" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
        {/* Diagonals */}
        <line x1="40" y1="40" x2="43.5" y2="43.5" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="56.5" y1="56.5" x2="60" y2="60" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="40" y1="60" x2="43.5" y2="56.5" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="56.5" y1="43.5" x2="60" y2="40" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />

        {/* 4 Interlocking Symmetrical Heart/Clover Petals */}
        {/* Top Heart (pointing upwards/inwards) */}
        <path
          d="M 50 44 C 44 38, 35 38, 35 28 C 35 18, 44 18, 50 26 C 56 18, 65 18, 65 28 C 65 38, 56 38, 50 44 Z"
          stroke={goldColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Bottom Heart (pointing downwards/inwards) */}
        <path
          d="M 50 56 C 44 62, 35 62, 35 72 C 35 82, 44 82, 50 74 C 56 82, 65 82, 65 72 C 65 62, 56 62, 50 56 Z"
          stroke={goldColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Left Heart (pointing left/inwards) */}
        <path
          d="M 44 50 C 38 44, 38 35, 28 35 C 18 35, 18 44, 26 50 C 18 56, 18 65, 28 65 C 38 65, 38 56, 44 50 Z"
          stroke={goldColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Right Heart (pointing right/inwards) */}
        <path
          d="M 56 50 C 62 44, 62 35, 72 35 C 82 35, 82 44, 74 50 C 82 56, 82 65, 72 65 C 62 65, 62 56, 56 50 Z"
          stroke={goldColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  // Full Brand Logo Mode (with '善', '金', and 'DO GOOD' typography)
  return (
    <div className={`flex flex-col items-center text-center ${className}`} id="do-good-brand-logo-full">
      <div className="flex items-center gap-5 md:gap-7">
        {/* Chinese character '善' on the left */}
        <span 
          className="font-display font-medium text-2xl md:text-3xl select-none"
          style={{ color: goldColor, fontFamily: "Playfair Display, Georgia, serif", letterSpacing: "0.1em" }}
        >
          善
        </span>

        {/* Logo Emblem (Middle) */}
        <BrandLogo mode="emblem" size={60} className="md:w-[72px] md:h-[72px]" />

        {/* Chinese character '金' on the right */}
        <span 
          className="font-display font-medium text-2xl md:text-3xl select-none"
          style={{ color: goldColor, fontFamily: "Playfair Display, Georgia, serif", letterSpacing: "0.1em" }}
        >
          金
        </span>
      </div>

      {/* Typography 'DO GOOD' Underneath */}
      <div 
        className="mt-3 font-display font-light text-xl md:text-2xl tracking-[0.25em] uppercase select-none flex items-center justify-center gap-1"
        style={{ color: goldColor, fontFamily: "Playfair Display, Georgia, serif" }}
      >
        <span>DO</span>
        <span className="text-sm md:text-base opacity-75 font-serif font-extralight mx-1">◇</span>
        <span>GOOD</span>
      </div>
    </div>
  );
}
