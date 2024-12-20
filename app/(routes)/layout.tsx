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
    }
  });

  if (!user) {
    redirect("/signIn");
  }
  

  return (
    <div className="h-full" suppressHydrationWarning>
      {/* Header with backdrop blur effect */}
      <header className="h-20 xl:ml-24 fixed inset-x-0 top-0 pt-5 z-50 flex justify-center w-full bg-[#f1f1f1d0] dark:bg-[#1A1A1Ad0] backdrop-blur-sm rounded-md">
        <div className="w-full max-w-[1400px] px-4 rounded-md">
          <Navbar />
        </div>
      </header>

      {/* Sidebar (visible on xl and larger screens) */}
      <div className="hidden xl:block w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="pt-24 xl:ml-48 h-full mt-1 md:mt-6 flex justify-center">
        <div className="w-full max-w-[1400px] mx-auto px-4">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
