import { NextResponse } from "next/server"
import { generateTimetable } from "@/actions/timeTableActions"

export async function POST(req: Request) {
  console.log("POST request received")
  try {
    const { startDate } = await req.json()
    const timetable = await generateTimetable(new Date(startDate))
    return NextResponse.json({ success: true, timetable })
  } catch (error) {
    console.error("Error in POST handler:", error)
    return NextResponse.json({ success: false, error: "Failed to generate timetable" }, { status: 500 })
  }
}

export async function OPTIONS() {
  console.log("OPTIONS request received")
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: "POST, OPTIONS",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

