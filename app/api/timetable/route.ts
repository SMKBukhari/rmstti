import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const timetable = await prisma.timeTable.findMany({
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { shiftStart: 'asc' }
      ],
    });

    const formattedTimetable = timetable.map(entry => ({
      ...entry,
      fullName: entry.user?.fullName ?? 'Unknown',
    }));

    return NextResponse.json(formattedTimetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return NextResponse.json({ error: 'Failed to fetch timetable' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
