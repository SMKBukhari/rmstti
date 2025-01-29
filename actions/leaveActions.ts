'use server'

import { db } from "@/lib/db";

export async function fetchAndUpdateLeaves(userId: string) {
  const user = await db.userProfile.findUnique({
    where: { userId },
    select: {
      totalYearlyLeaves: true,
      totalMonthlyLeaves: true,
      totalLeavesTaken: true,
      updatedAt: true,
    },
  });

  if (!user) throw new Error("User not found");

  const now = new Date();
  const lastUpdate = new Date(user.updatedAt);
  let updatedLeavesTaken = Number(user.totalLeavesTaken);

  // Reset yearly leaves if it's a new year
  if (now.getFullYear() > lastUpdate.getFullYear()) {
    updatedLeavesTaken = 0;
  }
  // Reset monthly leaves if it's a new month
  else if (now.getMonth() > lastUpdate.getMonth()) {
    updatedLeavesTaken = Math.max(0, updatedLeavesTaken - Number(user.totalMonthlyLeaves));
  }

  // Update the database if leaves were reset
  // if (updatedLeavesTaken !== Number(user.totalLeavesTaken)) {
  //   await db.userProfile.update({
  //     where: { userId },
  //     data: {
  //       totalLeavesTaken: updatedLeavesTaken.toString(),
  //       updatedAt: now,
  //     },
  //   });
  // }

  const yearlyLeavesTaken = updatedLeavesTaken;
  const monthlyLeavesTaken = updatedLeavesTaken % Number(user.totalMonthlyLeaves);

  const totalYearlyLeaves = Number(user.totalYearlyLeaves)
  const totalMonthlyLeaves = Number(user.totalMonthlyLeaves)

  return {
    yearlyLeaves: user.totalYearlyLeaves,
    monthlyLeaves: user.totalMonthlyLeaves,
    yearlyLeavesTaken,
    monthlyLeavesTaken,
    remainingYearlyLeaves: totalYearlyLeaves - yearlyLeavesTaken,
    remainingMonthlyLeaves: totalMonthlyLeaves - monthlyLeavesTaken,
  };
}

