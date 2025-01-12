"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AttendanceData {
  date: string;
  workingHours: number;
  attendanceType: "present" | "absent" | "leave" | "workFromHome";
}

const fetchAttendanceData = async (
  userId: string,
  year: number,
  month: number
) => {
  // Replace this with your actual API call
  const response = await fetch(
    `/api/attendance?userId=${userId}&year=${year}&month=${month}`
  );
  const data = await response.json();
  return data;
};

const attendanceColors = {
  present: "#4CAF50",
  absent: "#F44336",
  leave: "#FFC107",
  workFromHome: "#2196F3",
};

export function AttendanceChart({ userId }: { userId: string }) {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [showWorkingHours, setShowWorkingHours] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAttendanceData(userId, year, month);
      setAttendanceData(data);
    };
    loadData();
  }, [userId, year, month]);

  const attendanceCounts = attendanceData.reduce((acc, day) => {
    acc[day.attendanceType] = (acc[day.attendanceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageWorkingHours =
    attendanceData.reduce((sum, day) => sum + day.workingHours, 0) /
    attendanceData.length;
  const previousMonthAverage = 8; // Replace this with actual calculation of previous month's average

  const trend =
    averageWorkingHours > previousMonthAverage
      ? { icon: TrendingUp, text: "up", color: "text-green-500" }
      : { icon: TrendingDown, text: "down", color: "text-red-500" };

  const chartData = showWorkingHours
    ? attendanceData
    : Object.entries(attendanceCounts).map(([type, count]) => ({
        type,
        count,
      }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Chart</CardTitle>
        <CardDescription>
          <div className='flex justify-between items-center'>
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
            <div className='flex items-center space-x-2'>
              <Switch
                id='show-working-hours'
                checked={showWorkingHours}
                onCheckedChange={setShowWorkingHours}
              />
              <Label htmlFor='show-working-hours'>
                {showWorkingHours ? "Working Hours" : "Attendance Types"}
              </Label>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey={showWorkingHours ? "date" : "type"} />
            <YAxis />
            <Tooltip />
            <Legend />
            {showWorkingHours ? (
              <Bar dataKey='workingHours' fill='#8884d8' />
            ) : (
              <Bar dataKey='count' fill='#8884d8'>
                {chartData.map((entry, index) => {
                  if ("type" in entry) {
                    // Type guard to check if `entry` has the `type` property
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          attendanceColors[
                            entry.type as keyof typeof attendanceColors
                          ]
                        }
                      />
                    );
                  }
                  return null; // Safeguard for unexpected cases
                })}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        {showWorkingHours ? (
          <>
            <div className='flex gap-2 font-medium leading-none'>
              Trending {trend.text} by{" "}
              {Math.abs(averageWorkingHours - previousMonthAverage).toFixed(1)}{" "}
              hours this month
              <trend.icon className={`h-4 w-4 ${trend.color}`} />
            </div>
            <div className='leading-none text-muted-foreground'>
              Average working hours: {averageWorkingHours.toFixed(2)} hours per
              day
            </div>
          </>
        ) : (
          <div className='flex flex-wrap gap-4'>
            {Object.entries(attendanceCounts).map(([type, count]) => (
              <div key={type} className='flex items-center gap-2'>
                <div
                  className={`w-3 h-3 rounded-full`}
                  style={{
                    backgroundColor:
                      attendanceColors[type as keyof typeof attendanceColors],
                  }}
                ></div>
                <span className='capitalize'>
                  {type}: {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
