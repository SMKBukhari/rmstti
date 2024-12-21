import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { ApplicantsColumns, columns } from "./_components/columns";
import { format } from "date-fns";

const IntervieweePage = async () => {
  const applicationStatus = await db.applicationStatus.findFirst({
    where: { name: "Interviewed" },
  });
  const interviewees = await db.jobApplications.findMany({
    where: {
      applicationStatusId: applicationStatus?.id,
    },
    include: {
      user: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedApplicants: ApplicantsColumns[] = interviewees.map(
    (interviewee) => ({
      id: interviewee.user.userId,
      fullName: interviewee.user?.fullName ?? "N/A",
      email: interviewee.user?.email ?? "N/A",
      contact: interviewee.user?.contactNumber ?? "N/A",
      appliedAt: interviewee.interviewDate
        ? format(new Date(interviewee.interviewDate), "MMMM do, yyyy")
        : "N/A",
      resume: interviewee.user?.resumeUrl ?? "N/A",
      resumeName: interviewee.user?.resumeName ?? "N/A",
      userImage: interviewee.user?.userImage ?? "N/A",
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
        />
      </div>
    </div>
  );
};

export default IntervieweePage;
