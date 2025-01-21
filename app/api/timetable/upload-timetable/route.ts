import { NextResponse } from "next/server"
import { uploadTimetableFile } from "@/actions/timeTableActions"

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
    }

    const result = await uploadTimetableFile(formData)
    return NextResponse.json({ success: true, message: result.message })
  } catch (error) {
    console.error("Error uploading timetable:", error)
    return NextResponse.json({ success: false, error: "Failed to upload timetable" }, { status: 500 })
  }
}

