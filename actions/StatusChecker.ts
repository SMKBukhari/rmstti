'use server'

import { db } from "@/lib/db"

export async function checkEmployeeStatus() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get all employees
    const employees = await db.userProfile.findMany({
      include: {
        leaveRequests: {
          where: {
            startDate: {
              lte: today
            },
            endDate: {
              gte: today
            }
          },
          include: {
            leaveType: true
          }
        },
        workstatus: true,
        status: true,
        Attendence: {
          where: {
            date: today
          }
        }
      },
    })

    // Process each employee
    for (const employee of employees) {
      let newStatusId: string | null = null
      let newWorkStatusId: string | null = null
      
      // Check if employee has an approved leave request for today
      const activeLeaveRequest = employee.leaveRequests.find(
        leave => leave.status === 'Approved'
      )

      // Get attendance for today
      const todayAttendance = employee.Attendence[0]

      if (activeLeaveRequest) {
        // Employee has approved leave
        newStatusId = (await db.status.findFirst({
          where: { name: 'On Leave' }
        }))?.id || null

        // Deduct leave credit if not already deducted
        if (!todayAttendance) {
          await db.userProfile.update({
            where: { userId: employee.userId },
            data: {
              totalLeavesTaken: {
                increment: 1
              }
            }
          })

          // Create attendance record for leave
          await db.attendence.create({
            data: {
              userId: employee.userId,
              date: today,
              workStatusId: (await db.workStatus.findFirst({
                where: { name: 'Leave' }
              }))?.id
            }
          })
        }
      } else {
        // Check if employee has rejected leave and is absent
        const rejectedLeaveRequest = employee.leaveRequests.find(
          leave => leave.status === 'Rejected'
        )

        if (rejectedLeaveRequest && !todayAttendance) {
          newStatusId = (await db.status.findFirst({
            where: { name: 'Absent' }
          }))?.id || null
        } else if (todayAttendance?.checkInTime) {
          // Employee is present
          newStatusId = (await db.status.findFirst({
            where: { name: 'Active' }
          }))?.id || null
          newWorkStatusId = (await db.workStatus.findFirst({
            where: { name: 'Working' }
          }))?.id || null
        }
      }

      // Update employee status if changed
      if (newStatusId || newWorkStatusId) {
        await db.userProfile.update({
          where: { userId: employee.userId },
          data: {
            statusId: newStatusId || employee.statusId,
            workstatusId: newWorkStatusId || employee.workstatusId
          }
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error checking employee status:', error)
    return { success: false, error: 'Failed to check employee status' }
  }
}

