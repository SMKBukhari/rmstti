import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

interface AttendanceRecord {
  userId: string
  name: string
  date: string
  workingHours: number
  attendanceType: 'present' | 'absent' | 'leave' | 'workFromHome'
}

interface GroupedData {
  [userId: string]: {
    userId: string
    name: string
    attendance: {
      date: string
      workingHours: number
      attendanceType: 'present' | 'absent' | 'leave' | 'workFromHome'
    }[]
  }
}

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
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    const aggregatedData: AttendanceRecord[] = attendanceData.map(record => {
      let attendanceType: 'present' | 'absent' | 'leave' | 'workFromHome'

      switch (record.workStatus?.name.toLowerCase()) {
        case 'present':
          attendanceType = 'present'
          break
        case 'absent':
          attendanceType = 'absent'
          break
        case 'leave':
          attendanceType = 'leave'
          break
        case 'work from home':
          attendanceType = 'workFromHome'
          break
        default:
          attendanceType = 'absent' // Default to absent if status is unknown
      }

      return {
        userId: record.userId,
        name: record.user.fullName,
        date: record.date.toISOString().split('T')[0],
        workingHours: parseFloat(record.workingHours || '0'),
        attendanceType,
      }
    })

    const groupedData: GroupedData = aggregatedData.reduce((acc, record) => {
      if (!acc[record.userId]) {
        acc[record.userId] = {
          userId: record.userId,
          name: record.name,
          attendance: [],
        }
      }
      acc[record.userId].attendance.push({
        date: record.date,
        workingHours: record.workingHours,
        attendanceType: record.attendanceType,
      })
      return acc
    }, {} as GroupedData)

    return NextResponse.json(Object.values(groupedData))
  } catch (error) {
    console.error('Error fetching attendance data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
