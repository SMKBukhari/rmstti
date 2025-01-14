"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Employee {
  userId: string;
  name: string;
  userImage?: string;
  attendance: {
    present: number;
    absent: number;
    leave: number;
    workFromHome: number;
  };
}

const attendanceColors = {
  present: "hsl(145, 63%, 42%)", // Soft Green: Balanced for both modes
  absent: "hsl(2, 68%, 48%)", // Deep Red: Visible and striking
  leave: "hsl(40, 70%, 50%)", // Golden Yellow: Warm and neutral
  workFromHome: "hsl(210, 55%, 52%)", // Muted Blue: Calm and professional
};

const attendanceLabels = {
  present: "Present",
  absent: "Absent",
  leave: "On Leave",
  workFromHome: "Work From Home",
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as Employee;

  return (
    <Card className='p-4 rounded-lg shadow-lg border'>
      <div className='flex items-center gap-3 mb-3'>
        <Avatar className='h-12 w-12'>
          <AvatarImage src={data.userImage} alt={data.name} />
          <AvatarFallback>
            {data.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className='font-semibold'>{data.name}</h3>
        </div>
      </div>
      <div className='space-y-1'>
        {Object.entries(data.attendance).map(([type, count]) => (
          <div key={type} className='flex justify-between text-sm'>
            <span className='capitalize'>
              {attendanceLabels[type as keyof typeof attendanceLabels]}:
            </span>
            <span className='font-medium'>{count} days</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export function AttendanceChart() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/attendance/all?year=${year}&month=${month}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month]);

  if (loading) {
    return (
      <Card className='w-full'>
        <CardContent className='flex items-center justify-center min-h-[400px]'>
          <div className='text-muted-foreground'>Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Employee Attendance Overview</CardTitle>
        <CardDescription>
          <div className='flex gap-4'>
            <Select
              value={year.toString()}
              onValueChange={(value) => setYear(parseInt(value))}
            >
              <SelectTrigger className='w-[120px]'>
                <SelectValue placeholder='Select Year' />
              </SelectTrigger>
              <SelectContent>
                {[...Array(5)].map((_, i) => (
                  <SelectItem key={i} value={(year - 2 + i).toString()}>
                    {year - 2 + i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={month.toString()}
              onValueChange={(value) => setMonth(parseInt(value))}
            >
              <SelectTrigger className='w-[120px]'>
                <SelectValue placeholder='Select Month' />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i} value={(i + 1).toString()}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis
              label={{ value: "Days", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.entries(attendanceColors).map(([key, color]) => (
              <Bar
                key={key}
                dataKey={`attendance.${key}`}
                name={attendanceLabels[key as keyof typeof attendanceLabels]}
                stackId='attendance'
                fill={color}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
