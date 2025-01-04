import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { name, email, contact, address } = await req.json();

    const userProfile = await db.userProfile.findFirst({
      where: {
        userId: params.userId,
      },
      include: {
        company: true,
      },
    });

    if (!userProfile) {
      return new NextResponse("User not found", { status: 404 });
    }

    let company;

    if (userProfile.company) {
      company = await db.company.update({
        where: {
          id: userProfile.company.id,
        },
        data: {
          name,
          email,
          contact,
          address,
        },
      });

      return NextResponse.json(company, { status: 200 });
    } else {
      company = await db.company.create({
        data: {
          name,
          email,
          contact,
          address,
          UserProfile: {
            connect: {
              userId: params.userId,
            },
          },
        },
      });

      return NextResponse.json(company, { status: 201 });
    }
  } catch (error) {
    console.error(`COMPANY_UPDATE_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
