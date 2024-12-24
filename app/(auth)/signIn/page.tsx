"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/login-form";
import Cookies from "js-cookie";
import axios from "axios";

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      // Check if the user is already authenticated by looking for session token in localStorage
      // const sessionToken = localStorage.getItem("sessionToken");
      const sessionToken = Cookies.get("sessionToken");
      const userId = Cookies.get("userId");
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
          router.push("/signIn");
        }
      }
    };

    checkUserSession();
  }, [router]);

  return (
    <div className="w-full flex justify-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
