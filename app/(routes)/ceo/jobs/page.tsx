import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { columns, JobsColumns } from "./_components/columns";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import CreateNewJob from "./_components/CreateNewJob";

const JobsPage = async () => {
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

  const jobs = await db.job.findMany({
    include: {
      applications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedJobs: JobsColumns[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    createdAt: job.createdAt
      ? format(new Date(job.createdAt), "MMMM do, yyyy")
      : "N/A",
    isPublished: job.isPusblished,
  }));
  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Jobs' />
      </div>

      <CreateNewJob user={user} />

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formatedJobs}
          searchKey='title'
          routePrefix='ceo/jobs'
        />
      </div>
    </div>
  );
};

export default JobsPage;
