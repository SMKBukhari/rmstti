import { cookies } from "next/headers";
import { MagazineTimetable } from "./_components/MagazineTimetable";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const TimeTablePage = async () => {
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

  const timetable = await db.timeTable.findMany({
    include: {
      user: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: [{ date: "asc" }, { shiftStart: "asc" }],
  });

  const enrichedTimetable = timetable.map((entry) => ({
    ...entry,
    fullName: entry.user?.fullName,
  }));

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <MagazineTimetable user={user} timetable={enrichedTimetable} />
    </main>
  );
};

export default TimeTablePage;
