import { db } from "@/lib/db";
import {
  LeaveStatus,
  NotificationCreator,
  NotificationType,
} from "@prisma/client";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    const { leaveType, startDate, endDate, reason } = await req.json();

    if (!leaveType || !startDate || !endDate || !reason) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const user = await db.userProfile.findFirst({
      where: {
        userId,
      },
      include: {
        leaveRequests: true,
        department: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const getLeaveType = await db.leaveType.findFirst({
      where: {
        name: leaveType,
      },
    });

    if (!getLeaveType) {
      return new NextResponse("Leave Type not found", { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysRequested =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    console.log(daysRequested);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const leavesTakenThisYear = user.leaveRequests.filter(
      (leaveRequest) =>
        new Date(leaveRequest.startDate).getFullYear() === currentYear &&
        leaveRequest.status === "Approved"
    ).length;
    const leavesTakenThisMonth = user.leaveRequests.filter(
      (leaveRequest) =>
        new Date(leaveRequest.startDate).getFullYear() === currentYear &&
        new Date(leaveRequest.startDate).getMonth() === currentMonth &&
        leaveRequest.status === "Approved"
    ).length;

    console.log(leavesTakenThisYear, leavesTakenThisMonth);

    // Calculate carried over leaves
    const calculateCarriedOverLeaves = async (userId: string) => {
      let carriedOverLeaves = 0;
      const lastMonth = subMonths(currentDate, 1);
      const startOfLastMonth = startOfMonth(lastMonth);
      const endOfLastMonth = endOfMonth(lastMonth);

      const lastMonthLeaves = await db.leaveRequest.count({
        where: {
          userId: userId,
          startDate: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
          status: LeaveStatus.Approved,
        },
      });

      if (lastMonthLeaves === 0) {
        carriedOverLeaves = Math.min(
          user.totalMonthlyLeaves,
          36 - user.totalYearlyLeaves
        );
      }

      return carriedOverLeaves;
    };

    const carriedOverLeaves = await calculateCarriedOverLeaves(userId);

    const remainingLeavesThisYear =
      user.totalYearlyLeaves - leavesTakenThisYear + carriedOverLeaves;
    const remainingLeavesThisMonth =
      user.totalMonthlyLeaves - leavesTakenThisMonth + carriedOverLeaves;

    console.log(remainingLeavesThisYear, remainingLeavesThisMonth);

    let requireHigherApproval = false;

    if (
      remainingLeavesThisYear < daysRequested ||
      remainingLeavesThisMonth < daysRequested
    ) {
      requireHigherApproval = true;
    }

    console.log(requireHigherApproval);

    const admins = await db.userProfile.findMany({
      where: { role: { name: "Admin" } },
    });

    const ceo = await db.userProfile.findMany({
      where: { role: { name: "CEO" } },
    });

    const manager = await db.userProfile.findFirst({
      where: {
        department: {
          name: user.department?.name,
        },
      },
    });

    const notifications = [
      {
        userId,
        title: "Leave Request Submitted",
        message: `Your leave request for ${leaveType} from 
        ${format(new Date(startDate), "MMMM do, yyyy")}
         to ${format(new Date(endDate), "MMMM do, yyyy")} has been submitted.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
        link: "/employee/leave-management",
      },
      ...(manager
        ? [
            {
              userId: manager.userId,
              title: "New Leave Request Raised",
              message: `${
                user.fullName
              } has submitted a leave request for ${leaveType} from ${format(
                new Date(startDate),
                "MMMM do, yyyy"
              )} to ${format(new Date(endDate), "MMMM do, yyyy")}.`,
              createdBy: NotificationCreator.Employee,
              senderImage: user.userImage,
              link: `/manager/leave-management/manage-requests`,
              type: NotificationType.General,
            },
          ]
        : []),
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "New Leave Request Raised",
        message: `${
          user.fullName
        } has submitted a leave request for ${leaveType} from ${format(
          new Date(startDate),
          "MMMM do, yyyy"
        )} to ${format(new Date(endDate), "MMMM do, yyyy")}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/admin/leave-management/manage-requests`,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "New Leave Request Raised",
        message: `${
          user.fullName
        } has submitted a leave request for ${leaveType} from ${format(
          new Date(startDate),
          "MMMM do, yyyy"
        )} to ${format(new Date(endDate), "MMMM do, yyyy")}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/ceo/leave-management/manage-requests`,
        type: NotificationType.General,
      })),
    ];

    const raiseLeaveRequest = await db.leaveRequest.create({
      data: {
        leaveType: {
          connect: {
            id: getLeaveType.id,
          },
        },
        startDate,
        endDate,
        requireHigherApproval,
        reason,
        user: {
          connect: {
            userId,
          },
        },
      },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    await db.userProfile.update({
      where: {
        userId: raiseLeaveRequest.userId,
      },
      data: {
        totalYearlyLeaves: Math.min(
          user.totalYearlyLeaves + carriedOverLeaves,
          36
        ),
        totalMonthlyLeaves: Math.min(
          user.totalMonthlyLeaves + carriedOverLeaves,
          36
        ),
      },
    });

    return NextResponse.json(raiseLeaveRequest, { status: 201 });
  } catch (error) {
    console.error(`RAISE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
