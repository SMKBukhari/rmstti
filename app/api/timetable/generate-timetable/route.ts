import { NextResponse } from "next/server"
import { generateTimetable } from "@/actions/timeTableActions"

export async function POST(req: Request) {
  try {
    const { startDate } = await req.json()
    const timetable = await generateTimetable(new Date(startDate))
    return NextResponse.json({ success: true, timetable })
  } catch (error) {
    console.error("Error generating timetable:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate timetable" },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
