import React from "react";

interface LogoProps {
  className?: string;
  inverse?: boolean;
}

export default function Logo({ className = "h-8 md:h-10 w-auto", inverse = false }: LogoProps) {
  return (
    <img
      src="/Logo.png"
      alt="Sono & cia"
      className={`${className} object-contain transition-all duration-300 ${
        inverse ? "brightness-0 invert" : ""
      }`}
      id="sono-ecia-premium-logo"
    />
  );
}

