import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ContractManagementClient from "./_components/ContractManagementClient";

const ContractManagementPage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    redirect("/signIn");
  }

  const user = await db.userProfile.findUnique({
    where: { userId },
    include: { role: true },
  });

  if (!user || !["Admin", "CEO"].includes(user.role?.name || "")) {
    redirect("/dashboard");
  }

  // Get all employees with contract information
  const employees = await db.userProfile.findMany({
    where: {
      isHired: true,
      role: {
        name: {
          in: ["Employee", "Manager", "Admin"],
        },
      },
      status: {
        name: "Active",
      },
    },
    include: {
      department: true,
      role: true,
      ContractRenewals: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get departments and roles for the renewal form
  const departments = await db.department.findMany({
    orderBy: { name: "asc" },
  });

  const roles = await db.role.findMany({
    where: {
      name: {
        in: ["Employee", "Manager"],
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Contract Management</h1>
        <p className='text-muted-foreground'>
          Manage employee contracts, renewals, and track contract history
        </p>
      </div>

      <ContractManagementClient
        employees={employees}
        departments={departments}
        roles={roles}
        currentUserId={userId}
        currentUserName={user.fullName}
      />
    </div>
  );
};

export default ContractManagementPage;
