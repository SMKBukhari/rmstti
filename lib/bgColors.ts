"use client"
import { usePathname } from "next/navigation";

export const GetBackgroundColor = () => {
  const pathname = usePathname();

  if (
    pathname.startsWith("/signIn") ||
    pathname.startsWith("/signUp") ||
    pathname.startsWith("/forgotPassword") ||
    pathname.startsWith("/resetPassword") ||
    pathname.startsWith("/verify")
  ) {
    return "";
  } else if(pathname.startsWith("/dashboard")) {
    return "bg-[#f1f1f1] dark:bg-[#1A1A1A]";
  }
};
