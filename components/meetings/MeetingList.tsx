"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

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

interface MeetingListProps {
  meetings: Meeting[];
  onMeetingClick: (meeting: Meeting) => void;
  userRole: string;
  currentUserId: string;
}

const MeetingList: React.FC<MeetingListProps> = ({
  meetings,
  onMeetingClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.organizer.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || meeting.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || meeting.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const toggleExpanded = (meetingId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(meetingId)) {
      newExpanded.delete(meetingId);
    } else {
      newExpanded.add(meetingId);
    }
    setExpandedCards(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case "Cancelled":
        return <XCircle className='w-4 h-4 text-red-500' />;
      case "InProgress":
        return <AlertCircle className='w-4 h-4 text-blue-500' />;
      default:
        return <Clock className='w-4 h-4 text-gray-500' />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "destructive";
      case "High":
        return "default";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "Cancelled":
        return "destructive";
      case "InProgress":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className='space-y-6'>
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='w-5 h-5' />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder='Search meetings...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='Scheduled'>Scheduled</SelectItem>
                <SelectItem value='InProgress'>In Progress</SelectItem>
                <SelectItem value='Completed'>Completed</SelectItem>
                <SelectItem value='Cancelled'>Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder='Filter by priority' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Priorities</SelectItem>
                <SelectItem value='Urgent'>Urgent</SelectItem>
                <SelectItem value='High'>High</SelectItem>
                <SelectItem value='Medium'>Medium</SelectItem>
                <SelectItem value='Low'>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Cards */}
      <div className='space-y-4'>
        <AnimatePresence>
          {filteredMeetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
                <CardHeader
                  className='pb-3'
                  onClick={() => toggleExpanded(meeting.id)}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <CardTitle className='text-lg'>
                          {meeting.title}
                        </CardTitle>
                        <div className='flex items-center gap-2'>
                          {getStatusIcon(meeting.status)}
                          <Badge variant={getStatusColor(meeting.status)}>
                            {meeting.status}
                          </Badge>
                          <Badge variant={getPriorityColor(meeting.priority)}>
                            {meeting.priority}
                          </Badge>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm '>
                        <div className='flex items-center gap-2'>
                          <Calendar className='w-4 h-4' />
                          {format(meeting.startDateTime, "PPP")}
                        </div>
                        <div className='flex items-center gap-2'>
                          <Clock className='w-4 h-4' />
                          {format(meeting.startDateTime, "hh:mm a")} -{" "}
                          {format(meeting.endDateTime, "hh:mm a")}
                        </div>
                        <div className='flex items-center gap-2'>
                          <Users className='w-4 h-4' />
                          {meeting.participants.length} participants
                        </div>
                        {meeting.location && (
                          <div className='flex items-center gap-2'>
                            <MapPin className='w-4 h-4' />
                            {meeting.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation();
                          onMeetingClick(meeting);
                        }}
                      >
                        View Details
                      </Button>
                      {expandedCards.has(meeting.id) ? (
                        <ChevronUp className='w-5 h-5' />
                      ) : (
                        <ChevronDown className='w-5 h-5' />
                      )}
                    </div>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {expandedCards.has(meeting.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className='pt-0'>
                        <div className='border-t pt-4 space-y-4'>
                          {/* Description */}
                          {meeting.description && (
                            <div>
                              <h4 className='font-medium mb-2'>Description</h4>
                              <div
                                className='meeting-content text-gray-100!'
                                dangerouslySetInnerHTML={{
                                  __html: meeting.description,
                                }}
                              />
                            </div>
                          )}

                          {/* Organizer */}
                          <div>
                            <h4 className='font-medium mb-2'>Organizer</h4>
                            <div className='flex items-center gap-2'>
                              {meeting.organizer.userImage && (
                                <motion.img
                                  src={
                                    meeting.organizer.userImage ||
                                    "/placeholder.svg"
                                  }
                                  alt={meeting.organizer.fullName}
                                  className='w-6 h-6 rounded-full'
                                />
                              )}
                              <span className='text-sm'>
                                {meeting.organizer.fullName}
                              </span>
                            </div>
                          </div>

                          {/* Participants */}
                          <div>
                            <h4 className='font-medium mb-2'>Participants</h4>
                            <div className='flex flex-wrap gap-2'>
                              {meeting.participants
                                .slice(0, 5)
                                .map((participant, idx) => (
                                  <div
                                    key={idx}
                                    className='flex items-center gap-1 text-xs bg-gray-100 rounded-full px-2 py-1'
                                  >
                                    {participant.user.userImage && (
                                      <motion.img
                                        src={
                                          participant.user.userImage ||
                                          "/placeholder.svg"
                                        }
                                        alt={participant.user.fullName}
                                        className='w-4 h-4 rounded-full'
                                      />
                                    )}
                                    <span className='text-gray-900'>
                                      {participant.user.fullName}
                                    </span>
                                    <Badge
                                      variant={
                                        participant.responseStatus ===
                                        "Accepted"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className='text-xs'
                                    >
                                      {participant.responseStatus}
                                    </Badge>
                                  </div>
                                ))}
                              {meeting.participants.length > 5 && (
                                <span className='text-xs text-gray-500'>
                                  +{meeting.participants.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Meeting Stats */}
                          <div className='grid grid-cols-2 gap-4 text-center'>
                            <div className='bg-blue-50 rounded-lg p-3'>
                              <div className='flex items-center justify-center gap-1 text-blue-600 mb-1'>
                                <FileText className='w-4 h-4' />
                                <span className='font-semibold'>
                                  {meeting.notes.length}
                                </span>
                              </div>
                              <span className='text-xs text-blue-600'>
                                Notes
                              </span>
                            </div>
                            <div className='bg-purple-50 rounded-lg p-3'>
                              <div className='flex items-center justify-center gap-1 text-purple-600 mb-1'>
                                <CheckCircle className='w-4 h-4' />
                                <span className='font-semibold'>
                                  {
                                    meeting.approvals.filter(
                                      (a) => a.isApproved
                                    ).length
                                  }
                                  /{meeting.approvals.length}
                                </span>
                              </div>
                              <span className='text-xs text-purple-600'>
                                Approved
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMeetings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center py-12'
          >
            <Calendar className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No meetings found
            </h3>
            <p className='text-gray-500'>
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters or search terms"
                : "No meetings have been scheduled yet"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MeetingList;
