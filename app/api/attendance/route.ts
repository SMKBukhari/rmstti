import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const year = parseInt(searchParams.get('year') || '')
  const month = parseInt(searchParams.get('month') || '')

  if (!userId || isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  try {
    const attendanceData = await db.attendence.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        workingHours: true,
        workStatus: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    const formattedData = attendanceData.map(record => {
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
        date: record.date.toISOString().split('T')[0],
        workingHours: parseFloat(record.workingHours || '0'),
        attendanceType,
      }
    })

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching attendance data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

