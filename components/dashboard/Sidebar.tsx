import React from "react";
import Logo from "@/components/Logo";
import SidebarRoutes from "./Sidebar-Routes";
import ThemeToggle from "@/components/ThemeToogle";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

const Sidebar = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      role: true,
    },
  });
  return (
    <div className='h-full relative border-r flex flex-col overflow-y-auto dark:bg-[#0A0A0A] bg-[#FFFFFF] scrollbar-none'>
      <div className='p-6'>
        <Logo />
      </div>

      {/* Sidebar Routes */}
      <div className='flex flex-col w-full'>
        <SidebarRoutes user={user} />
      </div>

      <div className='absolute bottom-5 left-5'>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
