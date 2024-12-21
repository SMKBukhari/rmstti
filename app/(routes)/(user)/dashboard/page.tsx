import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import UserBannerSuccess from "./_components/userBannerSuccess";
import UserBannerWarning from "./_components/userBannerWarning";
import ApplicantBanner from "./_components/applicantBanner";
import ApplicantInterviewBanner from "./_components/applicantInterviewDateBanner";

const page = async () => {
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
      education: true,
      jobExperience: true,
      skills: true,
      role: true,
    },
  });

  const jobApplications = await db.jobApplications.findMany({
    where: {
      id: user?.currentJobApplicationId || "",
    },
  });

  if (user?.isVerified === false) {
    redirect(`/verify/${userId}`);
  }

  const requiredFieldsForApply = [
    user?.fullName,
    user?.email,
    user?.contactNumber,
    user?.city,
    user?.country,
    user?.jobExperience,
    user?.education.length,
    user?.resumeUrl,
  ];

  const userRole = user?.role?.name === "User";
  const applicantRole = user?.role?.name === "Applicant";
  const intervieweeRole = user?.role?.name === "Interviewee";

  const totalFields = requiredFieldsForApply.length;
  const completedFields = requiredFieldsForApply.filter(Boolean).length;
  const isComplete = requiredFieldsForApply.every(Boolean);

  const interviewDateTime = jobApplications[0]?.interviewDate;

  return (
    <div>
      {userRole &&
        (isComplete ? (
          <UserBannerSuccess label="Submit" user={user} />
        ) : (
          <UserBannerWarning completedFields={completedFields} totalFields={totalFields} />
        ))}

      {applicantRole && <ApplicantBanner />}
      {intervieweeRole && <ApplicantInterviewBanner interviewDateTime={interviewDateTime} />}

      <h1>Dashboard</h1>
      <p>Welcome to your dashboard</p>
    </div>
  );
};

export default page;


