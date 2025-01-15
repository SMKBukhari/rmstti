import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotepadText } from "lucide-react";
import Link from "next/link";

interface LeaveRequestsProps {
  totalRequests: number;
  percentageChange: number;
}

const LeaveRequests = ({
  totalRequests,
  percentageChange,
}: LeaveRequestsProps) => {
  const formatNumber = (num: number) => (num < 10 ? `0${num}` : num);
  return (
    <Link href={"leave-management/manage-requests"}>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total Leave Requests
          </CardTitle>
          <NotepadText className='w-6 h-6' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatNumber(totalRequests)}
          </div>
          <p className='text-xs text-muted-foreground'>
            Percentage Change:{" "}
            <span
              className={
                percentageChange >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {percentageChange.toFixed(2)}%
            </span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default LeaveRequests;
