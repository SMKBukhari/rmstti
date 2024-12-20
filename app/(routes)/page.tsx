"use client";

import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const DashboardLayoutPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // State to handle loading while checking session

  useEffect(() => {
    const checkUserSession = async () => {
      // Check if the user is already authenticated by looking for session token in localStorage
      const sessionToken = Cookies.get("sessionToken");
      const userId = Cookies.get("userId");
      if (sessionToken) {
        // Check if the session token has expired
        const sessionExpiry = Cookies.get("sessionExpiry");
        if (sessionExpiry && new Date(sessionExpiry) > new Date()) {
          // If session is still valid, redirect to the dashboard
          try {
            const response = await axios.post("/api/user/getUserProfile", {
              userId: userId,
            });
            setIsLoading(false);
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
          } catch (error) {
            console.error("Error fetching user profile:", error);
            Cookies.remove("sessionToken");
            Cookies.remove("sessionExpiry");
            Cookies.remove("userId");
            router.push("/signIn");
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

  if (isLoading) {
    // Optionally, you can show a loading spinner or any placeholder while checking the session
    return (
      <div className='w-[100vw] h-[100vh] flex items-center justify-center'>
        <div className='animate-pulse'>
          <Logo />
        </div>
      </div>
    );
  }
  return <div>DashboardLayoutPage</div>;
};

export default DashboardLayoutPage;
