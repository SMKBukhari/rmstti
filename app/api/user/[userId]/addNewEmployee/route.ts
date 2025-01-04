import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { compileNewEmployeeInfoMail, sendMail } from "@/lib/emails/mail";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    const {
      fullName,
      email,
      password,
      gender,
      contactNumber,
      DOB,
      department,
      designation,
      role,
      salary,
      DOJ,
    } = await req.json();

    const user = await db.userProfile.findFirst({
      where: {
        userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const applicationStatus = await db.applicationStatus.findFirst({
      where: { name: "Hired" },
    });

    const departmentExist = await db.department.findFirst({
      where: { name: "IT Department" },
    });

    const roleExist = await db.role.findFirst({
      where: { name: "Employee" },
    });

    const admins = await db.userProfile.findMany({
      where: {
        role: { name: "Admin" },
        userId: {
          not: user.userId,
        },
      },
    });

    const ceo = await db.userProfile.findMany({
      where: {
        role: { name: "CEO" },
        userId: {
          not: user.userId,
        },
      },
    });

    const manager = await db.userProfile.findFirst({
      where: {
        department: {
          name: department,
        },
        userId: {
          not: user.userId,
        },
      },
    });

    const createNewEmployee = await db.userProfile.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        ConfirmPassword: hashedPassword,
        role: {
          connect: {
            name: role ? role : roleExist?.name,
          },
        },
        designation: designation,
        department: {
          connect: {
            name: department ? department : departmentExist?.name,
          },
        },
        isHired: true,
        isVerified: true,
        DOB,
        DOJ,
        contactNumber,
        gender,
        salary,
        applicationStatus: {
          connect: {
            id: applicationStatus?.id,
          },
        },
      },
    });

    const newEmployee = await db.userProfile.findFirst({
      where: {
        userId: createNewEmployee.userId,
      },
    });

    const notifications = [
      {
        userId: newEmployee?.userId as string,
        title: "You are Hired",
        message: `Congratulations! You are hired as a ${role} in ${department}.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
        link: "/profile",
      },
      ...(manager
        ? [
            {
              userId: manager.userId,
              title: "New Employee Hired",
              message: `${newEmployee?.fullName} has been hired as a ${role} in ${department}.`,
              createdBy: NotificationCreator.Employee,
              senderImage: user.userImage,
              link: `/manager/team-members`,
              type: NotificationType.General,
            },
          ]
        : []),
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "New Employee Hired",
        message: `${newEmployee?.fullName} has been hired as a ${role} in ${department}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/admin/employees`,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "New Employee Hired",
        message: `${newEmployee?.fullName} has been hired as a ${role} in ${department}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/ceo/employees`,
        type: NotificationType.General,
      })),
    ];

    const emailBody = await compileNewEmployeeInfoMail(
      fullName,
      email,
      password,
      designation,
      department,
      salary
    );

    const response = await sendMail({
      to: email,
      subject: "Your Role and Login Details at (The Truth International)",
      body: emailBody,
    });

    await db.notifications.createMany({
      data: notifications,
    });

    return NextResponse.json({ createNewEmployee, response }, { status: 201 });
  } catch (error) {
    console.error(`ADD_NEW_EMPLOYEE_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
