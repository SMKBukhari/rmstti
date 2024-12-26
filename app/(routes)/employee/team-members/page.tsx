import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { ApplicantsColumns, columns } from "./_components/columns";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const TeamMembersPage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    redirect("/signIn");
  }

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      department: {
        include: {
          users: {
            include: {
              role: true,
            },
          },
        },
      },
      role: true,
    },
  });

  const teamMembers =
    user?.role?.name !== "User"
      ? user?.department?.users.filter((teamMember) => teamMember.userId) ?? []
      : [];

  // Formatting the applicants data for the table
  const formattedApplicants: ApplicantsColumns[] = teamMembers.map(
    (teamMember) => ({
      user: user,
      id: teamMember.userId,
      fullName: teamMember.fullName ?? "N/A",
      email: teamMember.email ?? "N/A",
      contact: teamMember.contactNumber ?? "N/A",
      appliedAt: teamMember.updatedAt
        ? format(new Date(teamMember.updatedAt), "MMMM do, yyyy")
        : "N/A",
      designation: teamMember.designation ?? "N/A",
      userImage: teamMember.userImage ?? "N/A",
    })
  );

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Team Members' />
      </div>

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedApplicants}
          searchKey='fullName'
          routePrefix='employee/team-members'
          userId={user?.userId}
        />
      </div>
    </div>
  );
};

export default TeamMembersPage;
