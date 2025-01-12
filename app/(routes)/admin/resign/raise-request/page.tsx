import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { columns, ResignationRequestsColumns } from "./_components/columns";
import { format } from "date-fns";
import { cookies } from "next/headers";
import RaiseRequest from "./_components/RaiseRequest";

const ApplicantsPage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      role: true,
      department: true,
      company: true,
    },
  });

  const resignationRequests = await db.resignationRequests.findMany({
    where: {
      userId: user?.userId,
    },
    include: {
      user: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedResignationRequests: ResignationRequestsColumns[] =
    resignationRequests.map((resignationRequest) => ({
      user: user,
      id: resignationRequest.id,
      reason: resignationRequest.reason ?? "N/A",
      date: format(new Date(resignationRequest.createdAt), "dd/MM/yyyy"),
      status: resignationRequest.status,
    }));

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Resignation Requests' />
      </div>

      <RaiseRequest user={user} />

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedResignationRequests}
          routePrefix='employee/resign'
        />
      </div>
    </div>
  );
};

export default ApplicantsPage;
