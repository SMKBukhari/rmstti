import ThemeToggle from "@/components/ThemeToogle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SidebarRoutes = () => {
  return (
    <div className='flex justify-center flex-col m-2 gap-2 mt-10'>
      <Button variant={"default"}>
        <Link href={"/signIn"}>Sign in</Link>
      </Button>
      <Button variant={"outline"}>
        <Link href={"/signUp"}>Sign up</Link>
      </Button>
      <div className="w-full flex items-center justify-center mt-10">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default SidebarRoutes;
