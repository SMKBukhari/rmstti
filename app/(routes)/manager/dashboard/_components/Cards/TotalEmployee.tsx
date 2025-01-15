import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";

interface TotalEmployeeProps {
  totalEmployees: number;
  percentageChange: number;
}

const TotalEmployee = ({
  totalEmployees,
  percentageChange,
}: TotalEmployeeProps) => {
  return (
    <Link href={"team-members"}>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Team Members
            <span className='text-muted-foreground text-xs ml-1'>
              in my department
            </span>
          </CardTitle>
          <Users className='w-6 h-6' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {totalEmployees < 10 ? `0${totalEmployees}` : totalEmployees}
          </div>
          <p className='text-xs text-muted-foreground'>
            {percentageChange >= 0
              ? `+${percentageChange.toFixed(1)}% from last month`
              : `${percentageChange.toFixed(1)}% from last month`}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TotalEmployee;
