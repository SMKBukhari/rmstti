import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaveRequest, UserProfile } from "@prisma/client";
import { NotepadText } from "lucide-react";

interface BalanceLeavesProps {
  user: (UserProfile & { leaveRequests: LeaveRequest[] | null }) | null;
}

const BalanceLeaves = ({ user }: BalanceLeavesProps) => {
  const leaveRequests = user?.leaveRequests ?? [];
  const totaleaveTaken = leaveRequests.map(
    (leave) => leave.status === "Approved"
  );
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Leave Balance</CardTitle>
        <NotepadText className='w-6 h-6' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {user?.totalLeavesBalance ?? 0 - totaleaveTaken.length}
        </div>
        <p>
          <p className='text-xs text-muted-foreground'>
            Taken:{" "}
            <span className='text-yellow-600 dark:text-yellow-400'>
              {" "}
              {totaleaveTaken.length}{" "}
            </span>
            , Remaining:{" "}
            <span className='text-red-600 dark:text-red-400'>
              {user?.totalLeavesBalance || 0 - totaleaveTaken.length}
            </span>
          </p>
        </p>
      </CardContent>
    </Card>
  );
};

export default BalanceLeaves;
