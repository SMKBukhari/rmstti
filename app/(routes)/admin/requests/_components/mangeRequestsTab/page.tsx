import React from "react";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { columns, RequestsColumns } from "./_components/columns";

const ManageRequestsTabs = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const requests = await db.requests.findMany({
    where: {
      NOT: {
        userId: user?.userId,
      },
    },
    include: {
      user: true,
      RequestCategory: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedRequests: RequestsColumns[] = requests.map((request) => ({
    user: user,
    id: request.id,
    requestCategory: request.RequestCategory?.name ?? "N/A",
    date: request.createdAt
      ? format(new Date(request.createdAt), "MMMM do, yyyy")
      : "N/A",
    requestMessage: request.requestMessage ?? "N/A",
    requestFrom: request.user.fullName,
    status: request.status,
  }));

  const requestsCategories = await db.requestCategory.findMany();

  return (
    <div className='flex-col items-center justify-center flex'>
      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedRequests}
          filterableColumns={[
            {
              id: "requestCategory",
              title: "Request Category",
              options: requestsCategories.map((category) => category.name),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ManageRequestsTabs;
