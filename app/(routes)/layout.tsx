import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    redirect("/signIn");
  }

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!user) {
    redirect("/signIn");
  }

  return (
    <div className='min-h-screen'>
      {/* Sidebar - Hidden on mobile, visible on xl screens */}
      <div className='hidden xl:fixed xl:inset-y-0 xl:flex xl:w-52 xl:flex-col'>
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className='xl:pl-52'>
        {/* Sticky header */}
        <header className='sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
          <div className='w-full max-w-full mx-auto'>
            <Navbar />
          </div>
        </header>

        {/* Main content */}
        <main className='py-6 lg:py-8'>
          <div className='px-4 sm:px-6 lg:px-8 max-w-full mx-auto'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
