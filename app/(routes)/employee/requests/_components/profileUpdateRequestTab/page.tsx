import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns, ProfileUpdateRequestsColumns } from "./_components/columns";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const ProfileUpdateRequestTab = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const profileUpdateRequests = await db.profieUpdateRequests.findMany({
    where: {
      userId: user?.userId,
    },
    include: {
      user: true,
    },
  });

  const formattedProfileUpdateRequests: ProfileUpdateRequestsColumns[] = profileUpdateRequests.map(
    (updateRequest) => {
      const changedFields = Object.keys(updateRequest).reduce((acc, key) => {
        if (
          key !== 'id' && 
          key !== 'userId' && 
          key !== 'aprroved' && 
          key !== 'rejected' && 
          key !== 'createdAt' && 
          key !== 'updatedAt' && 
          key !== 'user' &&
          updateRequest[key] !== null && 
          updateRequest[key] !== undefined &&
          updateRequest[key] !== updateRequest.user[key]
        ) {
          acc[key] = {
            oldValue: updateRequest.user[key],
            newValue: updateRequest[key]
          };
        }
        return acc;
      }, {});

      return {
        user: user,
        id: updateRequest.id,
        fullName: updateRequest.user.fullName ?? "N/A",
        userImage: updateRequest.user.userImage ?? "N/A",
        designation: updateRequest.user.designation ?? "N/A",
        status: updateRequest.aprroved ? "Approved" : updateRequest.rejected ? "Rejected" : "Pending",
        changedFields: changedFields,
      };
    }
  );

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedProfileUpdateRequests}
          filterableColumns={[
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

export default ProfileUpdateRequestTab;
