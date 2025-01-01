"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToogle";
import MobileSidebar from "./_Components/MobileSidebar";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";

interface NavbarProps {
  bgColor?: string;
}

const Navbar = ({ bgColor }: NavbarProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const checkUserSession = async () => {
      // Check if the user is already authenticated by looking for session token in localStorage
      // const sessionToken = localStorage.getItem("sessionToken");
      const sessionToken = Cookies.get("sessionToken");
      const userId = Cookies.get("userId");
      console.log(sessionToken);
      if (sessionToken) {
        // Check if the session token has expired
        // const sessionExpiry = localStorage.getItem("sessionExpiry");
        const sessionExpiry = Cookies.get("sessionExpiry");
        if (sessionExpiry && new Date(sessionExpiry) > new Date()) {
          // If session is still valid, redirect to the dashboard
          const response = await axios.post("/api/user/getUserProfile", {
            userId: userId,
          });
          if (response.data.role?.name === "Admin") {
            router.push("/admin/dashboard");
          } else if (response.data.role?.name === "Manager") {
            router.push("/manager/dashboard");
          } else if (response.data.role?.name === "Employee") {
            router.push("/employee/dashboard");
          } else if (response.data.role?.name === "Recruiter") {
            router.push("/recruiter/dashboard");
          } else if (response.data.role?.name === "Interviewer") {
            router.push("/interviewer/dashboard");
          } else if (response.data.role?.name === "CEO") {
            router.push("/ceo/dashboard");
          } else {
            router.push("/dashboard");
          }
        } else {
          Cookies.remove("sessionToken");
          Cookies.remove("sessionExpiry");
          Cookies.remove("userId");
          router.push("/signIn");
        }
      }
    };

    checkUserSession();
  }, [router]);

  useEffect(() => {
    if (pathName === "/signIn") {
      setLoading(false);
    }
  }, [pathName]);

  return (
    <nav
      className={`fixed w-full z-20 ${
        bgColor ? bgColor : "bg-transparent"
      } top-0 start-0`}
    >
      <div className='max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <Link href='/' className='flex items-center space-x-3'>
          <Logo />
        </Link>
        <div className='flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse'>
          <div className='hidden md:flex items-center space-x-3'>
            {pathName === "/" && (
              <Link href={"/signIn"}>
                <Button variant='default'>
                  {loading ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Link>
            )}
            <ThemeToggle />
          </div>
          <MobileSidebar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
