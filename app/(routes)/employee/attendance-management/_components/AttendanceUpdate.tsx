"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UserProfile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Clock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceUpdateProps {
  user: UserProfile | null;
}

const AttendanceUpdate: React.FC<AttendanceUpdateProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<
    "checkedIn" | "checkedOut" | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    fetchCurrentStatus();
  }, []);

  const fetchCurrentStatus = async () => {
    if (!user) return;

    try {
      setIsStatusLoading(true);
      const response = await axios.get(
        `/api/user/${user.userId}/attendance/status`
      );
      setCurrentStatus(response.data.status);
    } catch (error) {
      console.error("Failed to fetch current status:", error);
      toast.error("Failed to fetch current status. Please try again.");
    } finally {
      setIsStatusLoading(false);
    }
  };

  const handleAttendance = async (isCheckIn: boolean) => {
    if (!user) {
      toast.error("User information not available");
      return;
    }

    try {
      setIsLoading(true);

      const now = new Date();
      const localTime = now.toISOString();
      const timezoneOffset = now.getTimezoneOffset();

      const response = await axios.post(`/api/user/${user.userId}/attendance`, {
        userId: user.userId,
        action: isCheckIn ? "checkIn" : "checkOut",
        localTime: localTime,
        timezoneOffset: timezoneOffset,
      });

      toast.success(response.data.message);
      setCurrentStatus(isCheckIn ? "checkedIn" : "checkedOut");

      // Refresh status after check-in/check-out
      await fetchCurrentStatus();
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || "An unexpected error occurred"
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-center'>
          Attendance Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <span className='text-lg font-medium'>Current Status:</span>
            {isStatusLoading ? (
              <Loader2 className='w-5 h-5 animate-spin' />
            ) : (
              <span
                className={`text-lg font-bold ${
                  currentStatus === "checkedIn"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {currentStatus === "checkedIn" ? "Checked In" : "Checked Out"}
              </span>
            )}
          </div>
          <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2'>
            <Button
              variant='outline'
              className='flex-1'
              onClick={() => handleAttendance(currentStatus !== "checkedIn")}
              disabled={isLoading || isStatusLoading}
            >
              <Clock className='w-5 h-5 mr-2' />
              {isLoading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : currentStatus === "checkedIn" ? (
                "Check Out"
              ) : (
                "Check In"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceUpdate;
