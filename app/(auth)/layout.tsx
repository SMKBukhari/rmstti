import type { Metadata } from "next";
import Navbar from "@/components/LandingPage/Navbar";

export const metadata: Metadata = {
  title: "HRMS-TTI | Welcome to TTI",
  description: "A Human Resource Management System for TTI",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <header>
        <Navbar />
      </header>
      <main className='mt-16 w-full'>{children}</main>
    </div>
  );
};

export default AuthLayout;
