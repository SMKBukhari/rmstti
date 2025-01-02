import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NotificationsPage from "./_components/NotificationPage";

const CompleteNotificationPage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

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
    <div>
      <NotificationsPage user={user} notifications={notifications} />
    </div>
  );
};

export default CompleteNotificationPage;
