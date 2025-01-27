import { db } from "@/lib/db"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import React from "react"
import UserBannerSuccess from "./_components/userBannerSuccess"
import UserBannerWarning from "./_components/userBannerWarning"
import ApplicantBanner from "./_components/applicantBanner"
import ApplicantInterviewBanner from "./_components/applicantInterviewDateBanner"
import UserBannerWarningRejected from "./_components/userBannerWarningRejected"
import UserBannerJobOffer from "./_components/userBannerJobOffer"
import JobCardItem from "@/components/LandingPage/JobCardItem"
import UserBannerInterviewSuccess from "./_components/userBannerInterviewSuccessFull"

const page = async () => {
  const cookieStore = cookies()
  const userId = (await cookieStore).get("userId")?.value

  if (!userId) {
    redirect("/signIn")
  }

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      education: true,
      jobExperience: true,
      applicationStatus: true,
      skills: true,
      role: true,
      JobApplications: true,
      company: true,
    },
  })

  const jobApplications = await db.jobApplications.findMany({
    where: {
      id: user?.currentJobApplicationId || "",
    },
  })

  const jobs = await db.job.findMany({
    where: {
      isPusblished: true,
    },
  })
  const departments = await db.department.findMany()

  if (user?.isVerified === false) {
    redirect(`/verify/${userId}`)
  }

  const requiredFieldsForApply = [
    user?.fullName,
    user?.email,
    user?.contactNumber,
    user?.city,
    user?.country,
    user?.jobExperience,
    user?.education.length,
    user?.resumeUrl,
  ]

  const userRole = user?.role?.name === "User"
  const applicantRole = user?.role?.name === "Applicant"
  const intervieweeRole = user?.role?.name === "Interviewee"

  const totalFields = requiredFieldsForApply.length
  const completedFields = requiredFieldsForApply.filter(Boolean).length
  const isComplete = requiredFieldsForApply.every(Boolean)

  const interviewDateTime = jobApplications[0]?.interviewDate

  const isRejected = user?.applicationStatus?.name === "Rejected"
  const isOffered = user?.applicationStatus?.name === "Offered"
  const isHired = user?.applicationStatus?.name === "Hired"

  const isInterviewed = user?.JobApplications[0]?.isInterviewed === true

  return (
    <div>
      {userRole &&
        !isRejected &&
        !isOffered &&
        !isHired &&
        !intervieweeRole &&
        (isComplete ? (
          <UserBannerSuccess label="Submit" user={user} department={departments} />
        ) : (
          <UserBannerWarning completedFields={completedFields} totalFields={totalFields} />
        ))}

      {applicantRole && <ApplicantBanner />}
      {intervieweeRole && !isOffered && !isHired && !isInterviewed && (
        <ApplicantInterviewBanner interviewDateTime={interviewDateTime} />
      )}

      {userRole && isRejected && <UserBannerWarningRejected />}

      {isInterviewed && !isOffered && !isHired && <UserBannerInterviewSuccess />}

      {intervieweeRole && isOffered && <UserBannerJobOffer label="Submit" user={user} />}
      <div className="mt-10 grid gap-8 sm:grid-cols-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {jobs?.map((job) => (
          <JobCardItem key={job.id} job={job} isComplete={isComplete} userProfile={user} />
        ))}
      </div>
    </div>
  )
}

export default page

