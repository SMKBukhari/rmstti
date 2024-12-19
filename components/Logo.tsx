"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const Logo = () => {
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [logoSize, setLogoSize] = useState({ width: 200, height: 150 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setLogoSize({ width: 100, height: 75 }); // Size for mobile
      } else if (window.innerWidth <= 768) {
        setLogoSize({ width: 100, height: 75 }); // Size for tablets
      } else {
        setLogoSize({ width: 150, height: 100 }); // Default size for desktop
      }
    };

    // Set initial size based on current window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);
    
    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // This useEffect ensures that the component only renders after the theme has been resolved
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering on the server or before hydration completes
  if (!mounted) return null;
  return (
    <div>
      {resolvedTheme === "dark" ? (
        <Image src={"/img/logo_dark.png"} alt="The Truth International Logo Dark" width={logoSize.width} height={logoSize.height} />
      ) : (
        <Image src={"/img/logo_light.png"} alt="The Truth International Logo Light" width={logoSize.width} height={logoSize.height} />
      )}
    </div>
  );
};

export default Logo;
