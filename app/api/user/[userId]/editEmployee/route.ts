import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const {
      id,
      fullName,
      gender,
      contactNumber,
      cnic,
      DOB,
      DOJ,
      city,
      country,
      address,
      designation,
      status,
      role,
      department,
      salary,
      officeTimingIn,
      officeTimingOut,
    } = await req.json();

    const { userId } = await params;

    const user = await db.userProfile.findFirst({
      where: { userId },
      include: {
        role: true,
      },
    });

    const updateUser = await db.userProfile.update({
      where: { userId: id },
      data: {
        fullName,
        gender,
        address,
        city,
        country,
        contactNumber,
        cnic,
        DOB,
        DOJ,
        designation,
        status: {
          connect: {
            name: status,
          },
        },
        role: {
          connect: {
            name: role,
          },
        },
        department: {
          connect: {
            name: department,
          },
        },
        salary,
        officeTimingIn,
        OfficeTimingOut: officeTimingOut,
      },
    });

    const adminExcepThisUser = await db.userProfile.findMany({
      where: {
        role: {
          name: "Admin",
        },
        userId: {
          not: user?.userId,
        },
      },
    });

    const ceo = await db.userProfile.findMany({
      where: {
        role: {
          name: "CEO",
        },
        userId: {
          not: user?.userId,
        },
      },
    });

    const notifications = [
      {
        userId: id,
        title: "Profile Updated",
        message: `Your profile has been updated by ${
          user?.role?.name === "Admin" ? "an admin" : "a CEO"
        }`,
        createdBy:
          user?.role?.name === "Admin"
            ? NotificationCreator.Admin
            : NotificationCreator.CEO,
        type: NotificationType.Alert,
        link: "/profile",
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "A profile has been updated",
        message: `${updateUser.fullName}'s profile has been updated by ${user?.fullName}`,
        createdBy:
          user?.role?.name === "Admin"
            ? NotificationCreator.Admin
            : NotificationCreator.CEO,
        type: NotificationType.Alert,
        senderImage: updateUser?.userImage,
        link: `/ceo/employees`,
      })),
      ...adminExcepThisUser.map((admin) => ({
        userId: admin.userId,
        title: "A profile has been updated",
        message: `${updateUser.fullName}'s profile has been updated by ${user?.fullName}`,
        createdBy:
          user?.role?.name === "Admin"
            ? NotificationCreator.Admin
            : NotificationCreator.CEO,
        type: NotificationType.Alert,
        senderImage: updateUser?.userImage,
        link: `/admin/employees`,
      })),
    ];

    const sendNotification = await db.notifications.createMany({
      data: notifications,
    });

    return NextResponse.json({ updateUser, sendNotification });
  } catch (error) {
    console.error(`USER_UPDATE_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
