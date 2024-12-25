"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAndUpdateLeaves } from "@/actions/leaveActions";

interface TotalLeavesProps {
  userId: string;
}

const TotalLeaves = ({
  userId,
}: TotalLeavesProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"year" | "month">(
    "year"
  );
  const [leaves, setLeaves] = useState({
    yearlyLeaves: 36,
    monthlyLeaves: 3,
    yearlyLeavesTaken: 0,
    monthlyLeavesTaken: 0,
    remainingYearlyLeaves: 36,
    remainingMonthlyLeaves: 3,
  });

  useEffect(() => {
    const fetchLeaves = async () => {
      const updatedLeaves = await fetchAndUpdateLeaves(userId);
      setLeaves(updatedLeaves);
    };

    fetchLeaves();
  }, [userId]);

  const totalLeaves =
    selectedPeriod === "year" ? leaves.yearlyLeaves : leaves.monthlyLeaves;
  const remainingLeaves =
    selectedPeriod === "year"
      ? leaves.remainingYearlyLeaves
      : leaves.remainingMonthlyLeaves;

  return (
    <Card>
      <CardHeader className='grid grid-cols-3 items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium col-span-2'>
          Total Leaves Allow per {selectedPeriod === "year" ? "Year" : "Month"}
        </CardTitle>
        <Select
          onValueChange={(value: "year" | "month") => setSelectedPeriod(value)}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select period' />
          </SelectTrigger>
          <SelectContent className=''>
            <SelectItem value='year'>Year</SelectItem>
            <SelectItem value='month'>Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <p className='text-2xl font-bold'>{totalLeaves}</p>
        <p className='text-sm text-muted-foreground'>
          Remaining:{" "}
          <span className='text-red-600 dark:text-red-400 font-medium'>
            {remainingLeaves}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalLeaves;
