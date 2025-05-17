import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const jobs = await db.job.findMany({
      where: {
        isPusblished: true,
      },
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching job data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

