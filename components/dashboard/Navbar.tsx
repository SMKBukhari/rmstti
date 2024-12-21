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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className='flex h-20 items-center justify-between gap-x-4 py-5 sm:gap-x-6'>
      {/* Mobile menu button - Only visible on smaller screens */}
      <div className='flex xl:hidden'>
        <MobileSidebar />
      </div>

      {/* Center content */}
      <div className='flex flex-1 items-center justify-end gap-x-4 sm:gap-x-6'>
        <NavbarRoutes userProfile={user} notifications={notifications} />
      </div>
    </div>
  );
};

export default Navbar;
