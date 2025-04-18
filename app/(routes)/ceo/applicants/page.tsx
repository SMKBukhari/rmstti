import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { ApplicantsColumns, columns } from "./_components/columns";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ApplicantsPage = async () => {
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

  const applicationStatus = await db.applicationStatus.findFirst({
    where: { name: "Applied" },
  });
  const applicants = await db.jobApplications.findMany({
    where: {
      applicationStatusId: applicationStatus?.id,
    },
    include: {
      user: true,
      job: true,
    },
  });

  const jobs = await db.job.findMany();
  const departments = await db.department.findMany();

  // Formatting the applicants data for the table
  const formattedApplicants: ApplicantsColumns[] = applicants.map(
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
      appliedForJob: applicant.job?.title ?? "N/A",
    })
  );

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Applicants' />
      </div>

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedApplicants}
          filterableColumns={[
            {
              id: "fullName",
              title: "Full Name",
            },
            {
              id: "department",
              title: "Department",
              options: departments.map((department) => department.name),
            },
            {
              id: "appliedForJob",
              title: "Applied For Job",
              options: jobs.map((job) => job.title),
            },
          ]}
          routePrefix='ceo/applicants'
        />
      </div>
    </div>
  );
};

export default ApplicantsPage;
