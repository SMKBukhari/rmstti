import React from "react";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { columns, ComplaintsColumns } from "./_components/columns";

const ManageComplaintsTab = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      role: true,
    },
  });

  const complaints = await db.complaints.findMany({
    where: {
      complaintTo: `${user?.fullName} - ${user?.role?.name}`,
    },
    include: {
      user: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedComplaints: ComplaintsColumns[] = complaints.map((request) => ({
    user: user,
    id: request.id,
    date: request.createdAt
      ? format(new Date(request.createdAt), "MMMM do, yyyy")
      : "N/A",
    complaintTitle: request.title ?? "N/A",
    complaintMessage: request.message ?? "N/A",
    complaintFrom: request.user.fullName ?? "N/A",
    status: request.status,
    isAnonymous: request.isAnonymous ?? false,
  }));

  return (
    <div className='flex-col items-center justify-center flex'>
      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedComplaints}
        />
      </div>
    </div>
  );
};

export default ManageComplaintsTab;
