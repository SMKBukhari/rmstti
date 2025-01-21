import React from "react";
import RaiseRequest from "./_components/RaiseRequest";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { columns, RequestsColumns } from "./_components/columns";

const RequestsTabs = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const requests = await db.requests.findMany({
    where: {
      userId: user?.userId,
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
    requestTo: request.requestTo,
    status: request.status,
  }));

  const requestsCategories = await db.requestCategory.findMany();

  const requestTo = await db.userProfile.findMany({
    where: {
      role: {
        name: {
          notIn: ["CEO", "User", "Applicant", "Interviewee"],
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
      <RaiseRequest
        requestTo={requestTo}
        requestCatogries={requestsCategories}
        user={user}
      />

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

export default RequestsTabs;
