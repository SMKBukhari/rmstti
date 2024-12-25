import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotepadText } from "lucide-react";

interface LeaveRequestsProps {
  totalRequests: number;
  statusCounts: Record<string, number>;
}

const LeaveRequests = ({ totalRequests, statusCounts }: LeaveRequestsProps) => {
  const formatNumber = (num: number) => (num < 10 ? `0${num}` : num);
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>
          Total Leave Requests
        </CardTitle>
        <NotepadText className='w-6 h-6' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{formatNumber(totalRequests)}</div>
        <p className='text-xs text-muted-foreground'>
          Pending:{" "}
          <span className='text-yellow-600 dark:text-yellow-400'>
            {" "}
            {formatNumber(statusCounts.Pending || 0)}{" "}
          </span>
          , Approved:{" "}
          <span className='text-green-600 dark:text-green-400'>
            {formatNumber(statusCounts.Approved || 0)}
          </span>
          , Rejected:{" "}
          <span className='text-red-600 dark:text-red-400'>
            {formatNumber(statusCounts.Rejected || 0)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default LeaveRequests;
