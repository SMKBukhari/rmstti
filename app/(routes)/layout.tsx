import type { Metadata } from "next";
import AppSidebar from "@/components/dashboard/app-sidebar";
import Header from "@/components/dashboard/header";
// import Navbar from "@/components/dashboard/Navbar";
// import Sidebar from "@/components/dashboard/Sidebar";
import KBar from "@/components/kbar";
import PageContainer from "@/components/page-container";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "HRMS-TTI | Dashboard",
  description: "A Human Resource Management System for TTI",
};

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;
  const defaultOpen =
    (await cookieStore).get("sidebar:state")?.value === "true";

  if (!userId) {
    redirect("/signIn");
  }

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    redirect("/signIn");
  }

  const notifications = await db.notifications.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: {
        select: {
          fullName: true,
          userImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    // <div className='min-h-screen'>
    //   {/* Sidebar - Hidden on mobile, visible on xl screens */}
    //   <div className='hidden xl:fixed xl:inset-y-0 xl:flex xl:w-52 xl:flex-col'>
    //     <Sidebar />
    //   </div>

    //   {/* Main content area */}
    //   <div className='xl:pl-52'>
    //     {/* Sticky header */}
    //     <header className='sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
    //       <div className='w-full max-w-full mx-auto'>
    //         <Navbar />
    //       </div>
    //     </header>

    //     {/* Main content */}
    //     <main className='py-6 lg:py-8'>
    //       <div className='px-4 sm:px-6 lg:px-8 max-w-full mx-auto'>
    //         {children}
    //       </div>
    //     </main>
    //   </div>
    // </div>
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar user={user} />
        <SidebarInset>
          {/* <Navbar /> */}
          <Header userProfile={user} notifications={notifications} />

          <PageContainer>
            <main>{children}</main>
          </PageContainer>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
};

export default DashboardLayout;
