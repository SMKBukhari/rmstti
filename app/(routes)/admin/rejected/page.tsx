import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { ApplicantsColumns, columns } from "./_components/columns";
import { format } from "date-fns";
import { cookies } from "next/headers";

const RejectedApplicantPage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const applicationStatus = await db.applicationStatus.findFirst({
    where: { name: "Rejected" },
  });

  const departments = await db.department.findMany();

  const rejectedApplicants = await db.jobApplications.findMany({
    where: {
      applicationStatusId: applicationStatus?.id,
    },
    include: {
      user: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedApplicants: ApplicantsColumns[] = rejectedApplicants.map(
    (applicant) => ({
      user: user,
      id: applicant.user.userId,
      fullName: applicant.user?.fullName ?? "N/A",
      email: applicant.user?.email ?? "N/A",
      contact: applicant.user?.contactNumber ?? "N/A",
      appliedAt: applicant.appliedDate
        ? format(new Date(applicant.appliedDate), "MMMM do, yyyy")
        : "N/A",
      department: applicant.department ?? "N/A",
      userImage: applicant.user?.userImage ?? "N/A",
      isInterviewed: applicant.isInterviewed ?? false,
      experience: applicant.experience ?? "N/A",
      skills: applicant.skills ?? "N/A",
      education: applicant.education ?? "N/A",
      jobKnowledge: applicant.jobKnowledge ?? "N/A",
      generalKnowledge: applicant.generalKnowledge ?? "N/A",
      culturalFit: applicant.culturalFit ?? "N/A",
      adaptability: applicant.adaptability ?? "N/A",
      motivation: applicant.motivation ?? "N/A",
      problemSolving: applicant.problemSolving ?? "N/A",
      communication: applicant.communication ?? "N/A",
      teamWork: applicant.teamWork ?? "N/A",
      leaderShipPotential: applicant.leaderShipPotential ?? "N/A",
      professionalism: applicant.professionalism ?? "N/A",
      criticalThinking: applicant.criticalThinking ?? "N/A",
      appearance: applicant.appearance ?? "N/A",
      maturity: applicant.maturity ?? "N/A",
    })
  );

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Rejected Candidates' />
      </div>

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedApplicants}
          routePrefix='admin/rejected'
          filterableColumns={[
            {
              id: "department",
              title: "Department",
              options: departments.map((dept) => dept.name).filter(Boolean),
            },
            {
              id: "fullName",
              title: "Name",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RejectedApplicantPage;
