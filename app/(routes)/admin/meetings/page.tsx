"use client";

import { useState, useEffect, useCallback } from "react";
import type { View } from "react-big-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  List,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import MeetingCalendar from "@/components/meetings/MeetingCalendar";
import MeetingList from "@/components/meetings/MeetingList";
import CreateMeetingModal from "@/components/meetings/CreateMeetingModal";
import MeetingDetailDialog from "@/components/meetings/MeetingDetailDialog";
import { toast } from "sonner";
import Loading from "@/components/global/Loading";

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
  files: Array<{ id: string; fileName: string }>;
  approvals: Array<{ isApproved: boolean }>;
}

interface Employee {
  userId: string;
  fullName: string;
  email: string;
  designation?: string;
  department?: {
    id: string;
    name: string;
  };
  userImage?: string;
}

interface Department {
  id: string;
  name: string;
  employeeCount: number;
}

const AdminMeetingsPage = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"calendar" | "list">("calendar");
  const [calendarView, setCalendarView] = useState<View>("month");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null
  );
  const [showMeetingDetail, setShowMeetingDetail] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [userRole, setUserRole] = useState("");

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadMeetings(),
        loadEmployees(),
        loadDepartments(),
        loadUserInfo(),
      ]);
    } catch (error) {
      toast.error(
        "Failed to load data" + (error instanceof Error ? error.message : "")
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
        setUserRole(data.role);
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
        "Error loading meetings" + (error instanceof Error ? error.message : "")
      );
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await fetch("/api/meetings/employees");
      console.error("Loading employees from API");
      console.log("Response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await fetch("/api/meetings/departments");
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.departments || []);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  const handleMeetingCreated = () => {
    loadMeetings();
    toast.success("Meeting created successfully!");
  };

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeetingId(meeting.id);
    setShowMeetingDetail(true);
  };

  const handleEventDrop = async ({
    event,
    start,
    end,
  }: {
    event: { id: string };
    start: Date;
    end: Date;
  }) => {
    try {
      const response = await fetch(`/api/meetings/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDateTime: start.toISOString(),
          endDateTime: end.toISOString(),
        }),
      });

      if (response.ok) {
        toast.success("Meeting time updated successfully!");
        loadMeetings();
      } else {
        toast.error("Failed to update meeting time");
      }
    } catch (error) {
      toast.error(
        "Error updating meeting time" +
          (error instanceof Error ? error.message : "")
      );
    }
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Open create meeting modal with pre-filled time
    // This would be implemented in the CreateMeetingModal
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
    scheduled: meetings.filter((m) => m.status === "Scheduled").length,
    completed: meetings.filter((m) => m.status === "Completed").length,
    inProgress: meetings.filter((m) => m.status === "InProgress").length,
    thisWeek: meetings.filter((m) => {
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      return m.startDateTime >= weekStart && m.startDateTime <= weekEnd;
    }).length,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Meeting Management</h1>
          <p className='text-gray-600'>Manage and organize all meetings</p>
        </div>
        <CreateMeetingModal
          trigger={
            <Button className='flex items-center gap-2'>
              <Plus className='w-4 h-4' />
              Schedule Meeting
            </Button>
          }
          employees={employees}
          departments={departments}
          currentUserId={currentUserId}
          userRole={userRole}
          onMeetingCreated={handleMeetingCreated}
        />
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
                <p className='text-sm font-medium text-gray-600'>Scheduled</p>
                <p className='text-2xl font-bold'>{stats.scheduled}</p>
              </div>
              <Clock className='w-8 h-8 text-orange-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Completed</p>
                <p className='text-2xl font-bold'>{stats.completed}</p>
              </div>
              <CheckCircle className='w-8 h-8 text-green-600' />
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
              <AlertTriangle className='w-8 h-8 text-purple-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Meetings</CardTitle>
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
                onSelectSlot={handleSelectSlot}
                onEventDrop={handleEventDrop}
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

export default AdminMeetingsPage;
