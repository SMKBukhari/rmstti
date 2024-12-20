import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserProfileSection from "./_components/UserProfileSection";
import UserAboutSection from "./_components/UserAboutSection";
import UserExperienceEducationSection from "./_components/UserExperienceEducationSection";
const ProfilePage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

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
    include: {
      role: true,
      status: true,
      jobExperience: true,
      education: true,
      department: {
        include: {
          users: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  const userWithJobExperiences = user
    ? {
        ...user,
        jobExperiences: user.jobExperience || [],
        userId: user.userId || "", // Ensure `userId` is a string
      }
    : null;

  const userWithEducations = user
    ? { ...user, educations: user.education || [] }
    : null;

  const teamMembers =
    user?.role?.name !== "User"
      ? user?.department?.users.filter(
          (teamMember) => teamMember.userId !== user.userId
        )
      : [];

  return (
    <div className='w-full'>
      <UserProfileSection user={user} />
      <div className='grid md:grid-cols-2 grid-cols-1 md:gap-5 gap-0'>
        <UserAboutSection user={user} teamMembers={teamMembers} />
        <UserExperienceEducationSection
          user={user}
          userExperiences={userWithJobExperiences}
          userEducations={userWithEducations}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
