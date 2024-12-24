import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { ApplicantsColumns, columns } from "./_components/columns";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const IntervieweePage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    redirect("/signIn");
  }

  const applicationStatus = await db.applicationStatus.findFirst({
    where: { name: "Interviewed" },
  });

  const offeredStatus = await db.applicationStatus.findFirst({
    where: { name: "Offered" },
  });

  const applicationStatusIds = [
    applicationStatus?.id,
    offeredStatus?.id,
  ].filter((id): id is string => id !== undefined);

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      role: true,
    },
  });

  const interviewees = await db.jobApplications.findMany({
    where: {
      applicationStatusId: {
        in: applicationStatusIds,
      },
    },
    include: {
      user: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedApplicants: ApplicantsColumns[] = interviewees.map(
    (interviewee) => ({
      user: user,
      id: interviewee?.user?.userId ?? "N/A",
      fullName: interviewee.user?.fullName ?? "N/A",
      email: interviewee.user?.email ?? "N/A",
      contact: interviewee.user?.contactNumber ?? "N/A",
      interviewDate: interviewee.interviewDate
        ? format(new Date(interviewee.interviewDate), "MMMM do, yyyy")
        : "N/A",
      resume: interviewee.user?.resumeUrl ?? "N/A",
      resumeName: interviewee.user?.resumeName ?? "N/A",
      userImage: interviewee.user?.userImage ?? "N/A",
      department: interviewee.department ?? "N/A",
      isInterviewed: interviewee.isInterviewed ?? false,
      appearance: interviewee.appearance ?? "N/A",
      communication: interviewee.communication ?? "N/A",
      reasoning: interviewee.reasoning ?? "N/A",
      education: interviewee.education ?? "N/A",
      jobKnowledge: interviewee.jobKnowledge ?? "N/A",
      workExperience: interviewee.workExperience ?? "N/A",
      generalKnowledge: interviewee.generalKnowledge ?? "N/A",
      iq: interviewee.iq ?? "N/A",
      pose: interviewee.pose ?? "N/A",
      personality: interviewee.personality ?? "N/A",
    })
  );

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Interviewees' />
      </div>

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedApplicants}
          searchKey='fullName'
          routePrefix='admin/interviewees'
        />
      </div>
    </div>
  );
};

export default IntervieweePage;
