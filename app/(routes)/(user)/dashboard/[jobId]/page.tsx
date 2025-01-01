import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import JobDetailsPageComponent from "./_components/JobDetailsPageComponent";
import { cookies } from "next/headers";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
    },
    include: {
      applications: true,
      attachments: true,
    },
  });

  if (!job) {
    redirect("/search");
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      JobApplications: true,
    },
  });

  return (
    <div className='flex-col p-4 md:p-8'>
      <JobDetailsPageComponent
        job={job}
        jobId={job.id}
        userProfile={profile}
      />
    </div>
  );
};

export default JobDetailsPage;
