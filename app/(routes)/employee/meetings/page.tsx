"use client";

import { useState, useEffect, useCallback } from "react";
import type { View } from "react-big-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  List,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
} from "lucide-react";
import MeetingCalendar from "@/components/meetings/MeetingCalendar";
import MeetingList from "@/components/meetings/MeetingList";
import MeetingDetailDialog from "@/components/meetings/MeetingDetailDialog";
import { toast } from "sonner";

interface Meeting {
  id: string;
  title: string;
  description?: string;
  startDateTime: Date;
  endDateTime: Date;
  organizer: {
    fullName: string;
    userImage?: string;
  };
  participants: Array<{
    user: {
      fullName: string;
      userImage?: string;
    };
    responseStatus: "Pending" | "Accepted" | "Declined" | "Tentative";
  }>;
  status: "Scheduled" | "InProgress" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Urgent";
  location?: string;
  notes: Array<{ id: string; content: string }>;
  approvals: Array<{ isApproved: boolean }>;
}

const EmployeeMeetingsPage = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"calendar" | "list">("calendar");
  const [calendarView, setCalendarView] = useState<View>("month");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null
  );
  const [showMeetingDetail, setShowMeetingDetail] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [userRole] = useState("Employee");

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([loadMeetings(), loadUserInfo()]);
    } catch (error) {
      toast.error(
        "Failed to load data" +
          (error instanceof Error ? `: ${error.message}` : "")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadUserInfo = async () => {
    try {
      const response = await fetch("/api/user/role");
      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.userId);
      }
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  };

  const loadMeetings = async () => {
    try {
      const response = await fetch("/api/meetings");
      if (response.ok) {
        const data = await response.json();
        const formattedMeetings = data.meetings.map((meeting: Meeting) => ({
          ...meeting,
          startDateTime: new Date(meeting.startDateTime),
          endDateTime: new Date(meeting.endDateTime),
        }));
        setMeetings(formattedMeetings);
      } else {
        toast.error("Failed to load meetings");
      }
    } catch (error) {
      toast.error(
        "Error loading meetings" +
          (error instanceof Error ? `: ${error.message}` : "")
      );
    }
  };

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeetingId(meeting.id);
    setShowMeetingDetail(true);
  };

  const calendarEvents = meetings.map((meeting) => ({
    id: meeting.id,
    title: meeting.title,
    start: meeting.startDateTime,
    end: meeting.endDateTime,
    resource: {
      organizer: meeting.organizer.fullName,
      participants: meeting.participants.length,
      location: meeting.location,
      status: meeting.status,
      priority: meeting.priority,
    },
  }));

  const stats = {
    total: meetings.length,
    pending: meetings.filter((m) => {
      const userParticipant = m.participants.find(
        (p: any) => p.userId === currentUserId
      );
      return userParticipant?.responseStatus === "Pending";
    }).length,
    accepted: meetings.filter((m) => {
      const userParticipant = m.participants.find(
        (p: any) => p.userId === currentUserId
      );
      return userParticipant?.responseStatus === "Accepted";
    }).length,
    thisWeek: meetings.filter((m) => {
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      return m.startDateTime >= weekStart && m.startDateTime <= weekEnd;
    }).length,
  };

  const upcomingMeetings = meetings
    .filter((m) => m.startDateTime > new Date() && m.status === "Scheduled")
    .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold'>My Meetings</h1>
        <p className='text-gray-600'>
          View and manage your meeting invitations and schedule
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Meetings
                </p>
                <p className='text-2xl font-bold'>{stats.total}</p>
              </div>
              <Calendar className='w-8 h-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>This Week</p>
                <p className='text-2xl font-bold'>{stats.thisWeek}</p>
              </div>
              <Clock className='w-8 h-8 text-orange-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Accepted</p>
                <p className='text-2xl font-bold'>{stats.accepted}</p>
              </div>
              <CheckCircle className='w-8 h-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Pending Response
                </p>
                <p className='text-2xl font-bold'>{stats.pending}</p>
              </div>
              <AlertTriangle className='w-8 h-8 text-yellow-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='w-5 h-5' />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {upcomingMeetings.map((meeting) => {
                const userParticipant = meeting.participants.find(
                  (p: any) => p.userId === currentUserId
                );
                return (
                  <div
                    key={meeting.id}
                    className='flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer'
                    onClick={() => handleMeetingClick(meeting)}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 rounded-full bg-blue-500'></div>
                      <div>
                        <p className='font-medium'>{meeting.title}</p>
                        <div className='flex items-center gap-2 text-sm text-gray-500'>
                          <span>
                            {meeting.startDateTime.toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>
                            {meeting.startDateTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span>•</span>
                          <span className='flex items-center gap-1'>
                            <Users className='w-3 h-3' />
                            {meeting.participants.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant={
                          meeting.priority === "High" ||
                          meeting.priority === "Urgent"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {meeting.priority}
                      </Badge>
                      {userParticipant && (
                        <Badge
                          variant={
                            userParticipant.responseStatus === "Accepted"
                              ? "default"
                              : userParticipant.responseStatus === "Declined"
                              ? "destructive"
                              : userParticipant.responseStatus === "Tentative"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {userParticipant.responseStatus}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={viewType}
            onValueChange={(value) => setViewType(value as "calendar" | "list")}
          >
            <TabsList className='mb-4'>
              <TabsTrigger value='calendar' className='flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                Calendar View
              </TabsTrigger>
              <TabsTrigger value='list' className='flex items-center gap-2'>
                <List className='w-4 h-4' />
                List View
              </TabsTrigger>
            </TabsList>

            <TabsContent value='calendar'>
              <MeetingCalendar
                meetings={calendarEvents}
                onSelectEvent={(event) => {
                  const meeting = meetings.find((m) => m.id === event.id);
                  if (meeting) handleMeetingClick(meeting);
                }}
                onSelectSlot={() => {}}
                onEventDrop={() => {}} // Employees can't drag meetings
                view={calendarView}
                onViewChange={setCalendarView}
                date={calendarDate}
                onNavigate={setCalendarDate}
              />
            </TabsContent>

            <TabsContent value='list'>
              <MeetingList
                meetings={meetings}
                onMeetingClick={handleMeetingClick}
                userRole={userRole}
                currentUserId={currentUserId}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Meeting Detail Dialog */}
      <MeetingDetailDialog
        meetingId={selectedMeetingId}
        open={showMeetingDetail}
        onOpenChange={setShowMeetingDetail}
        currentUserId={currentUserId}
        userRole={userRole}
      />
    </div>
  );
};

export default EmployeeMeetingsPage;
