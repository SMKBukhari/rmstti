import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import UserBannerSuccess from "./_components/userBannerSuccess";
import UserBannerWarning from "./_components/userBannerWarning";
import ApplicantBanner from "./_components/applicantBanner";
import ApplicantInterviewBanner from "./_components/applicantInterviewDateBanner";
import UserBannerWarningRejected from "./_components/userBannerWarningRejected";
import UserBannerJobOffer from "./_components/userBannerJobOffer";

const page = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;
  

  if (!userId) {
    redirect("/signIn");
  }

  // if (userId.length < 24) {
  //   redirect("/signIn");
  // }

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      education: true,
      jobExperience: true,
      applicationStatus: true,
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

  const isRejected = user?.applicationStatus?.name === "Rejected";
  const isOffered = user?.applicationStatus?.name === "Offered";
  const isHired = user?.applicationStatus?.name === "Hired";

  return (
    <div>
      {userRole &&
        !isRejected &&
        !isOffered &&
        !isHired &&
        !intervieweeRole &&
        (isComplete ? (
          <UserBannerSuccess label='Submit' user={user} />
        ) : (
          <UserBannerWarning
            completedFields={completedFields}
            totalFields={totalFields}
          />
        ))}

      {applicantRole && <ApplicantBanner />}
      {intervieweeRole && !isOffered && !isHired && (
        <ApplicantInterviewBanner interviewDateTime={interviewDateTime} />
      )}

      {userRole && isRejected && <UserBannerWarningRejected />}

      {intervieweeRole && isOffered && (
        <UserBannerJobOffer label='Submit' user={user} />
      )}

      <h1>Dashboard</h1>
      <p>Welcome to your dashboard</p>
    </div>
  );
};

export default page;
