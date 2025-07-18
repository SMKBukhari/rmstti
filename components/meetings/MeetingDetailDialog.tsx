"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  X,
  Plus,
  MessageSquare,
  Timer,
  Loader2,
  FileDown,
  ThumbsUp,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  Square,
  Activity,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import MeetingRichTextEditor from "./MeetingRichTextEditor";
import Loading from "../global/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";

interface MeetingDetailDialogProps {
  meetingId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  userRole: string;
}

interface Meeting {
  id: string;
  title: string;
  description?: string;
  agenda?: string;
  startDateTime: string;
  endDateTime: string;
  venue?: string;
  status: "Scheduled" | "InProgress" | "Completed" | "Cancelled" | "Pending";
  priority: "Low" | "Medium" | "High" | "Urgent";
  organizer: {
    userId: string;
    fullName: string;
    userImage?: string;
    designation?: string;
  };
  participants: Array<{
    userId: string;
    responseStatus: "Pending" | "Accepted" | "Declined" | "Tentative";
    user: {
      userId: string;
      fullName: string;
      userImage?: string;
      designation?: string;
    };
  }>;
  notes: Array<{
    id: string;
    title?: string;
    content: string;
    noteType: string;
    createdAt: string;
    author: {
      userId: string;
      fullName: string;
      userImage?: string;
    };
  }>;
  approvals: Array<{
    userId: string;
    isApproved: boolean;
    approvedAt?: string;
    comments?: string;
    user: {
      userId: string;
      fullName: string;
      userImage?: string;
    };
  }>;
  meetingMinutes: boolean;
  businessFromLastMeeting: string;
  openIssues: string;
  newBusiness: string;
  updatesAndAnnouncements: string;
  adjourment: string;
}

const MeetingDetailDialog: React.FC<MeetingDetailDialogProps> = ({
  meetingId,
  open,
  onOpenChange,
  currentUserId,
  userRole,
}) => {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingMoM, setIsEditingMoM] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    venue: "",
    priority: "Medium",
  });
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    noteType: "General",
  });
  const [momForm, setMomForm] = useState({
    businessFromLastMeeting: "",
    openIssues: "",
    newBusiness: "",
    updatesAndAnnouncements: "",
    adjourment: "",
  });
  const [showAddNote, setShowAddNote] = useState(false);
  const [userResponse, setUserResponse] = useState<string>("");
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [meetingTimer, setMeetingTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Add this useEffect hook to manage the timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && meeting?.status === "InProgress") {
      interval = setInterval(() => {
        setMeetingTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, meeting?.status]);

  // Initialize timer when meeting data loads
  useEffect(() => {
    if (meeting) {
      // If meeting is in progress, start the timer
      if (meeting.status === "InProgress") {
        setIsTimerRunning(true);

        // // Calculate elapsed time if meeting is already in progress
        // const startTime = new Date(meeting.startDateTime).getTime();
        // const now = new Date().getTime();
        // const elapsedSeconds = Math.floor((now - startTime) / 1000);
        // setMeetingTimer(elapsedSeconds > 0 ? elapsedSeconds : 0);
        setMeetingTimer(0);
      } else {
        setIsTimerRunning(false);
        setMeetingTimer(0);
      }
    }
  }, [meeting]);

  const fetchMeetingDetails = useCallback(async () => {
    if (!meetingId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/meetings/${meetingId}`);
      if (response.ok) {
        const data = await response.json();
        setMeeting(data.meeting);
        setEditForm({
          title: data.meeting.title,
          description: data.meeting.description || "",
          venue: data.meeting.venue || "",
          priority: data.meeting.priority,
        });

        // Set user's current response
        const userParticipant = data.meeting.participants.find(
          (p: { userId: string; responseStatus: string }) =>
            p.userId === currentUserId
        );
        if (userParticipant) {
          setUserResponse(userParticipant.responseStatus);
        }
      } else {
        toast.error("Failed to fetch meeting details");
      }
    } catch (error) {
      toast.error("Error fetching meeting details" + error);
    } finally {
      setLoading(false);
    }
  }, [meetingId, currentUserId]);

  useEffect(() => {
    if (meetingId && open) {
      fetchMeetingDetails();
    }
  }, [meetingId, open, fetchMeetingDetails]);

  const handleUpdateMeeting = async () => {
    if (!meetingId) return;

    try {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        toast.success("Meeting updated successfully");
        setIsEditing(false);
        fetchMeetingDetails();
      } else {
        toast.error("Failed to update meeting");
      }
    } catch (error) {
      toast.error("Error updating meeting" + error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!meetingId) return;

    try {
      const response = await axios.put(`/api/meetings/${meetingId}/status`, {
        status: newStatus,
      });

      if (response.status === 200) {
        toast.success(`Meeting status updated to ${newStatus}`);
        if (newStatus === "InProgress") {
          setIsTimerRunning(true);
          setMeetingTimer(0);
        } else if (newStatus === "Completed") {
          setIsTimerRunning(false);
        }
        fetchMeetingDetails();
      } else {
        toast.error("Failed to update meeting status");
      }
    } catch (error) {
      toast.error("Error updating meeting status" + error);
    }
  };

  const handleAddNote = async () => {
    if (!meetingId || !newNote.content.trim()) return;

    try {
      const response = await fetch(`/api/meetings/${meetingId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      if (response.ok) {
        toast.success("Note added successfully");
        setNewNote({ title: "", content: "", noteType: "General" });
        setShowAddNote(false);
        fetchMeetingDetails();
      } else {
        toast.error("Failed to add note");
      }
    } catch (error) {
      toast.error("Error adding note" + error);
    }
  };

  const handleResponseChange = async (response: string) => {
    if (!meetingId) return;

    try {
      const res = await fetch(`/api/meetings/${meetingId}/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response }),
      });

      if (res.ok) {
        toast.success(`Response updated to ${response}`);
        setUserResponse(response);
        fetchMeetingDetails();
      } else {
        toast.error("Failed to update response");
      }
    } catch (error) {
      toast.error("Error updating response" + error);
    }
  };

  const handleApproveMeeting = async (approved: boolean) => {
    if (!meetingId) return;

    try {
      const response = await fetch(`/api/meetings/${meetingId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved }),
      });

      if (response.ok) {
        toast.success(
          approved ? "Meeting approved" : "Meeting approval declined"
        );
        fetchMeetingDetails();
      } else {
        toast.error("Failed to update approval");
      }
    } catch (error) {
      toast.error("Error updating approval" + error);
    }
  };

  const handleSaveMoM = async () => {
    if (!meetingId) return;

    try {
      const response = await axios.put(`/api/meetings/${meetingId}/mom`, {
        openIssues: momForm.openIssues,
        newBusiness: momForm.newBusiness,
        updatesAndAnnouncements: momForm.updatesAndAnnouncements,
        adjourment: momForm.adjourment,
        meetingMinutes: true, // Mark that MoM has been added
      });

      if (response.status === 200) {
        toast.success("Minutes of Meeting saved successfully");
        setIsEditingMoM(false);
        fetchMeetingDetails();
      } else {
        toast.error("Failed to save MoM");
      }
    } catch (error) {
      toast.error("Error saving MoM: " + error);
    }
  };

  const downloadMeetingPDF = async () => {
    if (!meetingId) return;

    setIsDownloadingPDF(true);
    try {
      const response = await fetch(`/api/meetings/${meetingId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `meeting-${meeting?.title}-${format(
          new Date(),
          "yyyy-MM-dd"
        )}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("PDF downloaded successfully!");
      } else {
        toast.error("Failed to download PDF");
      }
    } catch (error) {
      toast.error("Error downloading PDF" + error);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

  const getResponseColor = (response: string) => {
    switch (response) {
      case "Accepted":
        return "default";
      case "Declined":
        return "destructive";
      case "Tentative":
        return "secondary";
      default:
        return "outline";
    }
  };

  const canEdit =
    meeting &&
    (meeting.organizer.userId === currentUserId ||
      userRole === "CEO" ||
      userRole === "Admin");

  const canChangeStatus =
    meeting &&
    (meeting.organizer.userId === currentUserId ||
      userRole === "CEO" ||
      userRole === "Admin");

  const canSeeApprovalWorkflow =
    meeting &&
    (meeting.organizer.userId === currentUserId ||
      userRole === "CEO" ||
      userRole === "Admin" ||
      meeting.approvals.some(
        (approval) =>
          approval.user.userId === currentUserId && approval.isApproved
      ));

  // const approvedCount =
  //   meeting?.approvals.filter((a) => a.isApproved).length || 0;

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <Loading />
        </DialogContent>
      </Dialog>
    );
  }

  if (!meeting) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <div className='text-center py-8'>
            <p>Meeting not found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-6xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              {getStatusIcon(meeting.status)}
              <DialogTitle className='text-xl'>
                {isEditing ? (
                  <Input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className='text-xl font-semibold'
                  />
                ) : (
                  meeting.title
                )}
              </DialogTitle>
              <Badge variant={getPriorityColor(meeting.priority)}>
                {meeting.priority}
              </Badge>
              <Badge
                variant={
                  meeting.status === "Completed" ? "default" : "secondary"
                }
              >
                {meeting.status}
              </Badge>
              {meeting.status === "InProgress" && (
                <Badge
                  variant='outline'
                  className='bg-blue-50 text-blue-700 border-blue-200'
                >
                  <Timer className='w-3 h-3 mr-1' />
                  {formatTimer(meetingTimer)}
                </Badge>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={downloadMeetingPDF}
                disabled={isDownloadingPDF}
                className='flex items-center gap-2 bg-transparent'
              >
                {isDownloadingPDF ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <FileDown className='w-4 h-4' />
                )}
                Download PDF
              </Button>
              {canEdit && (
                <>
                  {isEditing ? (
                    <>
                      <Button size='sm' onClick={handleUpdateMeeting}>
                        <Save className='w-4 h-4 mr-1' />
                        Save
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => setIsEditing(false)}
                      >
                        <X className='w-4 h-4 mr-1' />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className='w-4 h-4 mr-1' />
                      Edit
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Meeting Status Controls */}
          {meeting.status !== "Cancelled" &&
            meeting.status !== "Completed" &&
            canChangeStatus && (
              <Card className='border-blue-200 bg-blue-50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-blue-700'>
                    <Activity className='w-5 h-5' />
                    Meeting Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center gap-2'>
                    {meeting.status === "Scheduled" && (
                      <>
                        <Button
                          onClick={() => handleStatusChange("InProgress")}
                          className='flex items-center gap-2'
                        >
                          <Play className='w-4 h-4' />
                          Start Meeting
                        </Button>
                        <Button
                          variant='destructive'
                          onClick={() => handleStatusChange("Cancelled")}
                          className='flex items-center gap-2'
                        >
                          <XCircle className='w-4 h-4' />
                          Cancel Meeting
                        </Button>
                      </>
                    )}
                    {meeting.status === "InProgress" && (
                      <>
                        <Button
                          onClick={() => handleStatusChange("Completed")}
                          className='flex items-center gap-2'
                        >
                          <Square className='w-4 h-4' />
                          End Meeting
                        </Button>
                        <Button
                          variant='outline'
                          onClick={() => setIsTimerRunning(!isTimerRunning)}
                          className='flex items-center gap-2'
                        >
                          {isTimerRunning ? (
                            <Pause className='w-4 h-4' />
                          ) : (
                            <Play className='w-4 h-4' />
                          )}
                          {isTimerRunning ? "Pause Timer" : "Resume Timer"}
                        </Button>
                      </>
                    )}
                    {meeting.status === "Pending" && (
                      <Button
                        onClick={() => handleStatusChange("Scheduled")}
                        className='flex items-center gap-2'
                      >
                        <CheckCircle2 className='w-4 h-4' />
                        Approve & Schedule
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Approval Workflow */}
          {meeting.status === "Completed" && meeting.meetingMinutes && (
            <Card className='border-yellow-200 bg-yellow-50'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-yellow-700'>
                  <AlertTriangle className='w-5 h-5' />
                  {!meeting.meetingMinutes ? (
                    <span>Approval Required for Minutes of Meeting (MOM)</span>
                  ) : (
                    <span>Meeting Approvals</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <Button
                      onClick={() => handleApproveMeeting(true)}
                      className='flex items-center gap-2'
                    >
                      <ThumbsUp className='w-4 h-4' />
                      Approve
                    </Button>
                  </div>

                  {meeting.approvals.length > 0 && (
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>Approvals:</Label>
                      {meeting.approvals.map((approval, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-2 bg-white rounded border'
                        >
                          <div className='flex items-center gap-2'>
                            <Avatar className='w-6 h-6'>
                              <AvatarImage
                                src={
                                  approval.user.userImage || "/placeholder.svg"
                                }
                              />
                              <AvatarFallback>
                                {approval.user.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className='text-sm'>
                              {approval.user.fullName}
                            </span>
                          </div>
                          <Badge
                            variant={
                              approval.isApproved ? "default" : "destructive"
                            }
                          >
                            {approval.isApproved ? "Approved" : "Declined"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meeting Info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                Meeting Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4 text-gray-500' />
                    <span className='font-medium'>Date:</span>
                    <span>
                      {format(new Date(meeting.startDateTime), "PPP")}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-gray-500' />
                    <span className='font-medium'>Time:</span>
                    <span>
                      {format(new Date(meeting.startDateTime), "hh:mm a")} -{" "}
                      {format(new Date(meeting.endDateTime), "hh:mm a")}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <MapPin className='w-4 h-4 text-gray-500' />
                    <span className='font-medium'>Location:</span>
                    {isEditing ? (
                      <Input
                        value={editForm.venue}
                        onChange={(e) =>
                          setEditForm({ ...editForm, venue: e.target.value })
                        }
                        placeholder='Meeting location'
                      />
                    ) : (
                      <span>{meeting.venue || "Not specified"}</span>
                    )}
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4 text-gray-500' />
                    <span className='font-medium'>Organizer:</span>
                    <div className='flex items-center gap-2'>
                      <Avatar className='w-6 h-6'>
                        <AvatarImage
                          src={
                            meeting.organizer.userImage || "/placeholder.svg"
                          }
                        />
                        <AvatarFallback>
                          {meeting.organizer.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{meeting.organizer.fullName}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4 text-gray-500' />
                    <span className='font-medium'>Participants:</span>
                    <span>{meeting.participants.length}</span>
                  </div>
                </div>
              </div>

              {meeting.description && (
                <div className='mt-4'>
                  <span className='font-medium'>Description/Agenda:</span>
                  {isEditing ? (
                    <MeetingRichTextEditor
                      content={editForm.description}
                      onChange={(content: string) =>
                        setEditForm({ ...editForm, description: content })
                      }
                      placeholder='Enter meeting description or agenda, or use AI to generate one...'
                    />
                  ) : (
                    <div className='mt-1 p-3 bg-transparent rounded-lg'>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: meeting.description,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Response */}
          {meeting.participants.some(
            (p) => p.userId === currentUserId && p.responseStatus !== "Accepted"
          ) && (
            <Card>
              <CardHeader>
                <CardTitle>Your Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-2'>
                  <span>Current response:</span>
                  <Badge variant={getResponseColor(userResponse)}>
                    {userResponse}
                  </Badge>
                  <div className='flex gap-2 ml-4'>
                    <Button
                      size='sm'
                      variant={
                        userResponse === "Accepted" ? "default" : "outline"
                      }
                      onClick={() => handleResponseChange("Accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      size='sm'
                      variant={
                        userResponse === "Declined" ? "destructive" : "outline"
                      }
                      onClick={() => handleResponseChange("Declined")}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue='participants' className='w-full'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='participants'>Participants</TabsTrigger>
              <TabsTrigger value='notes'>Notes</TabsTrigger>
              <TabsTrigger value='mom'>Minutes of Meeting (MoM)</TabsTrigger>
            </TabsList>

            <TabsContent value='participants' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Users className='w-5 h-5' />
                    Participants ({meeting.participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {meeting.participants.map((participant) => (
                      <div
                        key={participant.userId}
                        className='flex items-center justify-between p-3 border rounded-lg'
                      >
                        <div className='flex items-center gap-3'>
                          <Avatar>
                            <AvatarImage
                              src={
                                participant.user.userImage || "/placeholder.svg"
                              }
                            />
                            <AvatarFallback>
                              {participant.user.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='font-medium'>
                              {participant.user.fullName}
                            </p>
                            <p className='text-sm text-gray-500'>
                              {participant.user.designation}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={getResponseColor(participant.responseStatus)}
                        >
                          {participant.responseStatus}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='notes' className='space-y-4'>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                      <FileText className='w-5 h-5' />
                      Notes ({meeting.notes.length})
                    </CardTitle>
                    <Button
                      size='sm'
                      onClick={() => setShowAddNote(true)}
                      className='flex items-center gap-2'
                    >
                      <Plus className='w-4 h-4' />
                      Add Note
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showAddNote && (
                    <div className='mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-transparent'>
                      <div className='space-y-4'>
                        <div>
                          <Label htmlFor='noteTitle'>Title (Optional)</Label>
                          <Input
                            id='noteTitle'
                            value={newNote.title}
                            onChange={(e) =>
                              setNewNote({ ...newNote, title: e.target.value })
                            }
                            placeholder='Note title'
                          />
                        </div>
                        <div>
                          <Label htmlFor='noteType'>Type</Label>
                          <Select
                            value={newNote.noteType}
                            onValueChange={(value) =>
                              setNewNote({
                                ...newNote,
                                noteType: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Note Type' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='General'>General</SelectItem>
                              <SelectItem value='ActionItem'>
                                Action Item
                              </SelectItem>
                              <SelectItem value='Decision'>Decision</SelectItem>
                              <SelectItem value='KeyPoint'>
                                Key Point
                              </SelectItem>
                              <SelectItem value='Question'>Question</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Content</Label>
                          <MeetingRichTextEditor
                            content={newNote.content}
                            onChange={(content) =>
                              setNewNote({ ...newNote, content })
                            }
                            placeholder='Write your note here...'
                          />
                        </div>
                        <div className='flex gap-2'>
                          <Button onClick={handleAddNote}>
                            <Save className='w-4 h-4 mr-1' />
                            Save Note
                          </Button>
                          <Button
                            variant='outline'
                            onClick={() => setShowAddNote(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className='space-y-4'>
                    {meeting.notes.length === 0 ? (
                      <div className='text-center py-8 text-gray-500'>
                        <MessageSquare className='w-12 h-12 mx-auto mb-2 opacity-50' />
                        <p>No notes added yet</p>
                      </div>
                    ) : (
                      meeting.notes.map((note) => (
                        <div key={note.id} className='border rounded-lg p-4'>
                          <div className='flex items-start justify-between mb-2'>
                            <div className='flex items-center gap-2'>
                              <Avatar className='w-6 h-6'>
                                <AvatarImage
                                  src={
                                    note.author.userImage || "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback>
                                  {note.author.fullName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className='font-medium'>
                                {note.author.fullName}
                              </span>
                              <Badge variant='outline' className='text-xs'>
                                {note.noteType}
                              </Badge>
                            </div>
                            <span className='text-xs text-gray-500'>
                              {format(new Date(note.createdAt), "PPp")}
                            </span>
                          </div>
                          {note.title && (
                            <h4 className='font-medium mb-2'>{note.title}</h4>
                          )}
                          <div
                            className='prose prose-sm max-w-none'
                            dangerouslySetInnerHTML={{ __html: note.content }}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='mom' className='space-y-4'>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                      <FileText className='w-5 h-5' />
                      Minutes of Meeting (MoM)
                    </CardTitle>
                    {meeting?.status === "Completed" && !isEditingMoM && (
                      <Button
                        size='sm'
                        onClick={() => {
                          setIsEditingMoM(true);
                          setMomForm({
                            businessFromLastMeeting:
                              meeting.businessFromLastMeeting || "",
                            openIssues: meeting.openIssues || "",
                            newBusiness: meeting.newBusiness || "",
                            updatesAndAnnouncements:
                              meeting.updatesAndAnnouncements || "",
                            adjourment: meeting.adjourment || "",
                          });
                        }}
                        className='flex items-center gap-2'
                      >
                        <Edit className='w-4 h-4' />
                        {meeting.meetingMinutes ? "Edit MoM" : "Add MoM"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingMoM ? (
                    <div className='space-y-4'>
                      <div>
                        <Label>Open Issues</Label>
                        <MeetingRichTextEditor
                          content={momForm.openIssues}
                          onChange={(content) =>
                            setMomForm({ ...momForm, openIssues: content })
                          }
                          placeholder='Open issues and pending items...'
                        />
                      </div>

                      <div>
                        <Label>New Business</Label>
                        <MeetingRichTextEditor
                          content={momForm.newBusiness}
                          onChange={(content) =>
                            setMomForm({ ...momForm, newBusiness: content })
                          }
                          placeholder='New business discussed...'
                        />
                      </div>

                      <div>
                        <Label>Updates and Announcements</Label>
                        <MeetingRichTextEditor
                          content={momForm.updatesAndAnnouncements}
                          onChange={(content) =>
                            setMomForm({
                              ...momForm,
                              updatesAndAnnouncements: content,
                            })
                          }
                          placeholder='Updates and announcements...'
                        />
                      </div>

                      <div>
                        <Label>Adjournment</Label>
                        <MeetingRichTextEditor
                          content={momForm.adjourment}
                          onChange={(content) =>
                            setMomForm({ ...momForm, adjourment: content })
                          }
                          placeholder='Meeting adjournment notes...'
                        />
                      </div>

                      <div className='flex gap-2'>
                        <Button onClick={handleSaveMoM}>
                          <Save className='w-4 h-4 mr-1' />
                          Save MoM
                        </Button>
                        <Button
                          variant='outline'
                          onClick={() => setIsEditingMoM(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='prose max-w-none'>
                      {meeting.meetingMinutes ? (
                        <>
                          {meeting.businessFromLastMeeting ? (
                            <div className='mb-6'>
                              <h3 className='font-semibold mb-2'>
                                Business from Last Meeting
                              </h3>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: meeting.businessFromLastMeeting,
                                }}
                              />
                            </div>
                          ) : (
                            <div className='mb-6'>
                              <h3 className='font-semibold mb-2'>
                                Business from Last Meeting
                              </h3>
                              <p className='text-gray-500'>
                                No business carried over
                              </p>
                            </div>
                          )}

                          {meeting.openIssues && (
                            <div className='mb-6'>
                              <h3 className='font-semibold mb-2'>
                                Open Issues
                              </h3>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: meeting.openIssues,
                                }}
                              />
                            </div>
                          )}

                          {meeting.newBusiness && (
                            <div className='mb-6'>
                              <h3 className='font-semibold mb-2'>
                                New Business
                              </h3>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: meeting.newBusiness,
                                }}
                              />
                            </div>
                          )}

                          {meeting.updatesAndAnnouncements && (
                            <div className='mb-6'>
                              <h3 className='font-semibold mb-2'>
                                Updates and Announcements
                              </h3>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: meeting.updatesAndAnnouncements,
                                }}
                              />
                            </div>
                          )}

                          {meeting.adjourment && (
                            <div className='mb-6'>
                              <h3 className='font-semibold mb-2'>
                                Adjournment
                              </h3>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: meeting.adjourment,
                                }}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className='text-center py-8 text-gray-500'>
                          <MessageSquare className='w-12 h-12 mx-auto mb-2 opacity-50' />
                          <p>Minutes of Meeting not added yet</p>
                          {meeting.organizer.userId === currentUserId && (
                            <p className='text-sm mt-2'>
                              Only the meeting organizer can add MoM
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingDetailDialog;
