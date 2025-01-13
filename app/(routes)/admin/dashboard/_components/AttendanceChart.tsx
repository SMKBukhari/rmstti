"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

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

// Define the types for attendance data
interface AttendanceDay {
  date: string;
  workingHours: number;
  attendanceType: "present" | "absent" | "leave" | "workFromHome";
}

interface EmployeeAttendance {
  userId: string;
  name: string;
  attendance: AttendanceDay[];
}

// Fetch attendance data
const fetchAttendanceData = async (
  year: number,
  month: number
): Promise<EmployeeAttendance[]> => {
  try {
    const response = await fetch(
      `/api/attendance/all?year=${year}&month=${month}`
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid data format");
    return data;
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return []; // Return an empty array on error
  }
};

const attendanceColors = {
  present: "#4CAF50",
  absent: "#F44336",
  leave: "#FFC107",
  workFromHome: "#2196F3",
};

export function AttendanceDashboard() {
  const [attendanceData, setAttendanceData] = useState<EmployeeAttendance[]>(
    []
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAttendanceData(year, month);
      setAttendanceData(data);
    };
    loadData();
  }, [year, month]);

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
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
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {Array.isArray(attendanceData) &&
        attendanceData.map((employee) => (
          <Card key={employee.userId} className='mb-4'>
            <CardHeader>
              <CardTitle>{employee.name}</CardTitle>
              <CardDescription>
                Attendance for {month}/{year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={employee.attendance}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='workingHours' fill='#8884d8'>
                    {employee.attendance.map((day, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={attendanceColors[day.attendanceType]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
