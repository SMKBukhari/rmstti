"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToogle";
import MobileSidebar from "./_Components/MobileSidebar";
import { LoginButton } from "@/components/auth/login-button";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface NavbarProps {
  bgColor?: string;
}

const Navbar = ({ bgColor }: NavbarProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const handleSignInClick = async () => {
    setLoading(true);
    await router.push("/signIn");
    setLoading(false);
  };
  return (
    <nav
      className={`fixed w-full z-20 ${
        bgColor ? bgColor : "bg-background"
      } top-0 start-0 border-b `}
    >
      <div className='max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4 py-6'>
        <Link href='/' className='flex items-center space-x-3'>
          <Logo />
        </Link>
        <div className='gap-5 hidden md:flex'>
          {pathName === "/" ? (
            <LoginButton>
              <Button variant={"default"} onClick={handleSignInClick}>
                {loading ? (
                  <Loader2 className='w-6 h-6 animate-spin' />
                ) : (
                  "Sign In"
                )}
              </Button>
            </LoginButton>
          ) : null}
          <ThemeToggle />
        </div>
        <MobileSidebar />
      </div>
    </nav>
  );
};

export default Navbar;
