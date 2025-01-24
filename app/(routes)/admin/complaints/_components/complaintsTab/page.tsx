import React from "react";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { columns, ComplaintsColumns } from "./_components/columns";
import RaiseComplaint from "./_components/RaiseComplaint";

const RaiseComplaintTab = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const requests = await db.complaints.findMany({
    where: {
      userId: user?.userId,
    },
    include: {
      user: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedRequests: ComplaintsColumns[] = requests.map((request) => ({
    user: user,
    id: request.id,
    date: request.createdAt
      ? format(new Date(request.createdAt), "MMMM do, yyyy")
      : "N/A",
    complaintTitle: request.title ?? "N/A",
    complaintMessage: request.message ?? "N/A",
    complaintTo: request.complaintTo ?? "N/A",
    status: request.status,
  }));

  const requestsCategories = await db.requestCategory.findMany();

  const complaintTo = await db.userProfile.findMany({
    where: {
      role: {
        name: {
          notIn: ["User", "Applicant", "Interviewee", "employee"],
        },
      },
      NOT: {
        userId: user?.userId,
      },
      status: {
        name: "Active",
      },
    },
    include: {
      role: true,
    },
  });

  return (
    <div className='flex-col items-center justify-center flex'>
      <RaiseComplaint
        complaintTo={complaintTo}
        requestCatogries={requestsCategories}
        user={user}
      />

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedRequests}
        />
      </div>
    </div>
  );
};

export default RaiseComplaintTab;
