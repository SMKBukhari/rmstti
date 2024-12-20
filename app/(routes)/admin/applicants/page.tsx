import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { ApplicantsColumns, columns } from "./_components/columns";
import { format } from "date-fns";

const ApplicantsPage = async () => {
  const applicationStatus = await db.applicationStatus.findFirst({
    where: { name: "Applied" },
  });
  const applicants = await db.jobApplications.findMany({
    where: {
      applicationStatusId: applicationStatus?.id,
    },
    include: {
      user: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedApplicants: ApplicantsColumns[] = applicants.map(
    (applicant) => ({
      id: applicant.user.userId,
      fullName: applicant.user?.fullName ?? "N/A",
      email: applicant.user?.email ?? "N/A",
      contact: applicant.user?.contactNumber ?? "N/A",
      appliedAt: applicant.appliedDate
        ? format(new Date(applicant.appliedDate), "MMMM do, yyyy")
        : "N/A",
      userImage: applicant.user?.userImage ?? "N/A",
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
          searchKey='fullName'
          routePrefix="admin/applicants"
        />
      </div>
    </div>
  );
};

export default ApplicantsPage;
