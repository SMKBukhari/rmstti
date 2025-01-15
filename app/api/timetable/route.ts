import { NextResponse } from 'next/server';
import { getTimetable } from '@/actions/timeTableActions';

export async function GET() {
  try {
    const timetable = await getTimetable();
    return NextResponse.json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return NextResponse.json({ error: 'Failed to fetch timetable' }, { status: 500 });
  }
}

