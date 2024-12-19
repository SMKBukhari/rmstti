import { db } from "@/lib/db";
import MobileSidebar from "./MobileSidebar";
import NavbarRoutes from "./Navbar-Routes";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const Navbar = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  // check if user id is not valid less than 24 characters

  if (!userId) {
    redirect("/signIn");
  }

  if (userId.length < 24) {
    redirect("/signIn");
  }

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const notifications = await db.notifications.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: {
        select: {
          fullName: true,
          userImage: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    }
  });
  

  return (
    <div className='p-4 md:py-10 md:px-6 border-b h-full flex items-center bg-[#FFFFFF]/95 dark:bg-[#0A0A0Ad0]/95 backdrop-blur-sm rounded-xl'>
      {/* Mobile Routes */}
      <MobileSidebar />

      {/* Sidebar Routes */}
      <NavbarRoutes userProfile={user} notifications={notifications} />
    </div>
  );
};

export default Navbar;
