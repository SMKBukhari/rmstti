import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = parseInt(searchParams.get('year') || '')
  const month = parseInt(searchParams.get('month') || '')

  if (isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  try {
    const attendanceData = await db.attendence.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        userId: true,
        date: true,
        workingHours: true,
        workStatus: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            fullName: true,
            userImage: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Group and transform the data for the chart
    const employeeAttendance = attendanceData.reduce((acc, record) => {
      if (!acc[record.userId]) {
        acc[record.userId] = {
          userId: record.userId,
          name: record.user.fullName,
          userImage: record.user.userImage || undefined,
          attendance: {
            present: 0,
            absent: 0,
            leave: 0,
            workFromHome: 0,
          },
        }
      }

      const status = record.workStatus?.name.toLowerCase()
      switch (status) {
        case 'present':
          acc[record.userId].attendance.present++
          break
        case 'absent':
          acc[record.userId].attendance.absent++
          break
        case 'leave':
          acc[record.userId].attendance.leave++
          break
        case 'work from home':
          acc[record.userId].attendance.workFromHome++
          break
        default:
          acc[record.userId].attendance.absent++ // Default to absent if status is unknown
      }

      return acc
    }, {} as Record<string, {
      userId: string
      name: string
      userImage?: string
      attendance: {
        present: number
        absent: number
        leave: number
        workFromHome: number
      }
    }>)

    return NextResponse.json(Object.values(employeeAttendance))
  } catch (error) {
    console.error('Error fetching attendance data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}