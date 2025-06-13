import { db } from "@/lib/db";
import { AttendanceChart } from "./AttendanceChart";
import LeaveManagementReport from "./LeaveManagementReport";

interface EmployeeReportPageProps {
  employeeId: string;
}

const EmployeeReportPage = async ({ employeeId }: EmployeeReportPageProps) => {
  const employee = await db.userProfile.findFirst({
    where: {
      userId: employeeId,
    },
    include: {
      leaveBalanceAdjustment: true,
      leaveRequests: true,
      Attendence: {
        include: {
            workStatus: true,
        }
      },
    },
  });

  return (
    <div className='w-full'>
      <div className='mt-5 space-y-5'>
        <AttendanceChart userId={employee?.userId ?? ""} />
        <LeaveManagementReport employee={employee} />
      </div>
    </div>
  );
};

export default EmployeeReportPage;
