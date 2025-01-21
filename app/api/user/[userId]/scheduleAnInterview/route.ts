import { db } from "@/lib/db"
import { compileInterviewScheduledMail, sendMail } from "@/lib/emails/mail"
import { NotificationCreator, NotificationType } from "@prisma/client"
import { NextResponse } from "next/server"

export const POST = async (req: Request, { params }: { params: { userId: string } }) => {
  try {
    const { userId } = params
    const { interviewDateTime, applicantId, userTimezone } = await req.json()

    const utcDate = new Date(interviewDateTime)
    const userDate = new Date(utcDate.toLocaleString("en-US", { timeZone: userTimezone }))

    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const applicant = await db.userProfile.findFirst({
      where: {
        userId: applicantId,
      },
    })

    if (!applicant) {
      return new NextResponse("Applicant not found", { status: 404 })
    }

    const applicationStatus = await db.applicationStatus.findFirst({
      where: { name: "Interviewed" },
    })

    const adminExcepThisUser = await db.userProfile.findMany({
      where: {
        role: {
          name: "Admin",
        },
        userId: {
          not: user.userId,
        },
      },
    })

    const ceo = await db.userProfile.findMany({
      where: {
        role: {
          name: "CEO",
        },
      },
    })

    const formatDate = (date: Date) => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`
    }

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    }

    const notifications = [
      {
        userId: applicant.userId,
        title: "Interview Scheduled",
        message: `Your interview has been scheduled on ${formatDate(userDate)} at ${formatTime(userDate)}. Please be prepared.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Interview Scheduled",
        message: `An interview has been scheduled for ${applicant.fullName} on ${formatDate(userDate)} at ${formatTime(userDate)} by ${user.userId}.`,
        createdBy: NotificationCreator.Admin,
        senderImage: user.userImage,
        link: `/ceo/interviewees`,
        type: NotificationType.General,
      })),
      ...adminExcepThisUser.map((admin) => ({
        userId: admin.userId,
        title: "Interview Scheduled",
        message: `An interview has been scheduled for ${applicant.fullName} on ${formatDate(userDate)} at ${formatTime(userDate)} by ${user.userId}.`,
        createdBy: NotificationCreator.Admin,
        senderImage: user.userImage,
        link: `/admin/interviewees`,
        type: NotificationType.General,
      })),
    ]

    const jobApplication = await db.jobApplications.findFirst({
      where: {
        userId: applicant.userId,
      },
    })

    if (!jobApplication) {
      return new NextResponse("Job Application not found", { status: 404 })
    }

    const updatedJobApplication = await db.jobApplications.update({
      where: {
        id: jobApplication.id,
      },
      data: {
        interviewDate: utcDate,
        applicationStatus: {
          connect: {
            id: applicationStatus?.id,
          },
        },
      },
    })

    await db.notifications.createMany({
      data: notifications,
    })

    await db.userProfile.update({
      where: {
        userId: applicant.userId,
      },
      data: {
        applicationStatus: {
          connect: {
            name: "Interviewed",
          },
        },
        currentJobApplicationId: jobApplication.id,
        role: {
          connect: {
            name: "Interviewee",
          },
        },
      },
    })

    const interviewDate = formatDate(userDate)
    const interviewTime = formatTime(userDate)

    const emailBody = await compileInterviewScheduledMail(
      applicant.fullName,
      interviewDate,
      interviewTime,
      userTimezone,
    )
    const response = await sendMail({
      to: applicant.email,
      subject: "Interview Scheduled (The Truth International)",
      body: emailBody,
    })

    return NextResponse.json({
      message: "Interview scheduled successfully.",
      updatedJobApplication,
      response,
    })
  } catch (error) {
    console.error(`SUBMIT_RESUME_POST: ${error}`)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

