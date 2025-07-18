"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MeetingRichTextEditor from "./MeetingRichTextEditor";
import { Progress } from "../ui/progress";
import { meetingAI } from "@/lib/ai/meeting-ai";

const meetingSchema = z.object({
  title: z.string().min(1, "Meeting title is required"),
  description: z.string().optional(),
  startDateTime: z.string().min(1, "Start date and time is required"),
  endDateTime: z.string().min(1, "End date and time is required"),
  venue: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  visibilityType: z.enum(["CC", "BCC"]),
  participantIds: z
    .array(z.string())
    .min(1, "At least one participant is required"),
  departmentIds: z.array(z.string()).optional(),
  businessFromLastMeeting: z.string().optional(),
  linkedMeetingId: z.string().optional(),
});

type MeetingFormData = z.infer<typeof meetingSchema>;

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

interface PreviousMeeting {
  id: string;
  title: string;
  startDateTime: string;
}

interface CreateMeetingModalProps {
  trigger: React.ReactNode;
  employees: Employee[];
  departments: Department[];
  currentUserId: string;
  userRole: string;
  onMeetingCreated: () => void;
  previousMeetings: PreviousMeeting[];
}

const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  trigger,
  employees,
  departments,
  currentUserId,
  userRole,
  onMeetingCreated,
  previousMeetings,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<Employee[]>(
    []
  );
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLinkedMeeting, setSelectedLinkedMeeting] =
    useState<PreviousMeeting | null>(null);
  const [isGeneratingAgenda, setIsGeneratingAgenda] = useState(false);
  const [agendaProgress, setAgendaProgress] = useState(0);
  const [generatedAgenda, setGeneratedAgenda] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: "",
      description: "",
      venue: "",
      priority: "Medium",
      visibilityType: "CC",
      participantIds: [],
      departmentIds: [],
      businessFromLastMeeting: "",
      linkedMeetingId: "",
    },
  });

  const watchedTitle = watch("title");
  const watchedStartDateTime = watch("startDateTime");
  const watchedEndDateTime = watch("endDateTime");

  // Filter employees based on user role
  const availableEmployees = employees.filter((emp) => {
    if (userRole === "CEO" || userRole === "Admin") {
      return emp.userId !== currentUserId;
    } else if (userRole === "Manager") {
      const currentUser = employees.find((e) => e.userId === currentUserId);
      return (
        emp.department?.id === currentUser?.department?.id &&
        emp.userId !== currentUserId
      );
    }
    return false;
  });

  // Filter departments based on user role
  const availableDepartments = departments.filter((dept) => {
    if (userRole === "CEO" || userRole === "Admin") {
      return true;
    } else if (userRole === "Manager") {
      const currentUser = employees.find((e) => e.userId === currentUserId);
      return dept.id === currentUser?.department?.id;
    }
    return false;
  });

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return availableEmployees;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return availableEmployees.filter(
      (employee) =>
        employee.fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
        employee.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        (employee.designation &&
          employee.designation.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (employee.department &&
          employee.department.name.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [availableEmployees, searchTerm]);

  const handleParticipantToggle = (employee: Employee) => {
    const isSelected = selectedParticipants.some(
      (p) => p.userId === employee.userId
    );
    if (isSelected) {
      const newParticipants = selectedParticipants.filter(
        (p) => p.userId !== employee.userId
      );
      setSelectedParticipants(newParticipants);
      setValue(
        "participantIds",
        newParticipants.map((p) => p.userId)
      );
    } else {
      const newParticipants = [...selectedParticipants, employee];
      setSelectedParticipants(newParticipants);
      setValue(
        "participantIds",
        newParticipants.map((p) => p.userId)
      );
    }
  };

  const handleDepartmentToggle = (department: Department) => {
    const isSelected = selectedDepartments.some((d) => d.id === department.id);
    if (isSelected) {
      const newDepartments = selectedDepartments.filter(
        (d) => d.id !== department.id
      );
      setSelectedDepartments(newDepartments);
      setValue(
        "departmentIds",
        newDepartments.map((d) => d.id)
      );
    } else {
      const newDepartments = [...selectedDepartments, department];
      setSelectedDepartments(newDepartments);
      setValue(
        "departmentIds",
        newDepartments.map((d) => d.id)
      );
    }
  };

  const handleLinkedMeetingSelect = (meetingId: string) => {
    const meeting = previousMeetings.find((m) => m.id === meetingId) || null;
    setSelectedLinkedMeeting(meeting);
    setValue("linkedMeetingId", meetingId);
  };

  const generateAgenda = async () => {
    if (!watchedTitle || selectedParticipants.length === 0) {
      toast.error("Please enter a meeting title and select participants first");
      return;
    }

    setIsGeneratingAgenda(true);
    setAgendaProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAgendaProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      const duration =
        watchedStartDateTime && watchedEndDateTime
          ? Math.round(
              (new Date(watchedEndDateTime).getTime() -
                new Date(watchedStartDateTime).getTime()) /
                (1000 * 60)
            )
          : 60;

      const agenda = await meetingAI.generateMeetingAgenda(
        watchedTitle,
        duration,
        selectedParticipants.map((p) => p.fullName)
      );

      clearInterval(progressInterval);
      setAgendaProgress(100);

      setGeneratedAgenda(agenda);
      setValue("description", agenda);
    } catch (error) {
      toast.error(
        "Error generating agenda" +
          (error instanceof Error ? `: ${error.message}` : "")
      );
    } finally {
      setIsGeneratingAgenda(false);
      setTimeout(() => setAgendaProgress(0), 1000);
    }
  };

  const onSubmit = async (data: MeetingFormData) => {
    try {
      console.log("Submitting meeting data:", data);
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startDateTime: new Date(data.startDateTime),
          endDateTime: new Date(data.endDateTime),
          organizerId: currentUserId,
        }),
      });

      if (response.ok) {
        toast.success("Meeting created successfully!");
        setOpen(false);
        reset();
        setSelectedParticipants([]);
        setSelectedDepartments([]);
        setSelectedLinkedMeeting(null);
        onMeetingCreated();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create meeting");
      }
    } catch (error) {
      toast.error(
        "An error occurred while creating the meeting" +
          (error instanceof Error ? `: ${error.message}` : "")
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Calendar className='w-5 h-5' />
            Schedule New Meeting
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <Tabs defaultValue='basic' className='w-full'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='basic'>Basic Info</TabsTrigger>
              <TabsTrigger value='participants'>Participants</TabsTrigger>
              <TabsTrigger value='agenda'>Agenda & AI</TabsTrigger>
              <TabsTrigger value='review'>Review</TabsTrigger>
            </TabsList>

            <TabsContent value='basic' className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Meeting Title *</Label>
                  <Input
                    id='title'
                    {...register("title")}
                    placeholder='Enter meeting title'
                  />
                  {errors.title && (
                    <p className='text-sm text-red-500'>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='location'>Location</Label>
                  <Input
                    id='location'
                    {...register("venue")}
                    placeholder='Meeting room or online link'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='startDateTime'>Start Date & Time *</Label>
                  <Input
                    id='startDateTime'
                    type='datetime-local'
                    {...register("startDateTime")}
                  />
                  {errors.startDateTime && (
                    <p className='text-sm text-red-500'>
                      {errors.startDateTime.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='endDateTime'>End Date & Time *</Label>
                  <Input
                    id='endDateTime'
                    type='datetime-local'
                    {...register("endDateTime")}
                  />
                  {errors.endDateTime && (
                    <p className='text-sm text-red-500'>
                      {errors.endDateTime.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='priority'>Priority</Label>
                  <Select
                    onValueChange={(
                      value: "Low" | "Medium" | "High" | "Urgent"
                    ) => setValue("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select priority' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Low'>Low</SelectItem>
                      <SelectItem value='Medium'>Medium</SelectItem>
                      <SelectItem value='High'>High</SelectItem>
                      <SelectItem value='Urgent'>Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='visibilityType'>Visibility</Label>
                  <Select
                    onValueChange={(value: "CC" | "BCC") =>
                      setValue("visibilityType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select visibility' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='CC'>
                        CC - Participants can see each other
                      </SelectItem>
                      <SelectItem value='BCC'>
                        BCC - Participants cannot see each other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='linkedMeetingId'>
                    Link to Previous Meeting
                  </Label>
                  <Select
                    onValueChange={handleLinkedMeetingSelect}
                    value={selectedLinkedMeeting?.id || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select previous meeting (optional)' />
                    </SelectTrigger>
                    <SelectContent>
                      {previousMeetings.map((meeting) => (
                        <SelectItem key={meeting.id} value={meeting.id}>
                          {meeting.title} -{" "}
                          {format(new Date(meeting.startDateTime), "PPP")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Add this field for business from last meeting */}
                {selectedLinkedMeeting && (
                  <div className='space-y-2'>
                    <Label htmlFor='businessFromLastMeeting'>
                      Business from {selectedLinkedMeeting.title}
                    </Label>
                    <MeetingRichTextEditor
                      content={watch("businessFromLastMeeting") || ""}
                      onChange={(content) =>
                        setValue("businessFromLastMeeting", content)
                      }
                      placeholder={`Enter business carried over from ${selectedLinkedMeeting.title}`}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value='participants' className='space-y-4'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Individual Participants */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Users className='w-5 h-5' />
                      Individual Participants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='relative mb-4'>
                      <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                      <Input
                        placeholder='Search participants...'
                        className='pl-9'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className='max-h-64 overflow-y-auto'>
                      {filteredEmployees.length === 0 ? (
                        <div className='text-center py-4 text-gray-500'>
                          No participants found
                        </div>
                      ) : (
                        <div className='space-y-2'>
                          {filteredEmployees.map((employee) => (
                            <div
                              key={employee.userId}
                              className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50'
                            >
                              <Checkbox
                                checked={selectedParticipants.some(
                                  (p) => p.userId === employee.userId
                                )}
                                onCheckedChange={() =>
                                  handleParticipantToggle(employee)
                                }
                              />
                              <div className='flex items-center gap-2 flex-1'>
                                {employee.userImage ? (
                                  <Avatar>
                                    <AvatarImage
                                      src={
                                        employee.userImage || "/placeholder.svg"
                                      }
                                      alt={employee.fullName}
                                    />
                                    <AvatarFallback>
                                      {employee.fullName
                                        .charAt(0)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <Avatar className='w-8 h-8'>
                                    <AvatarFallback>
                                      {employee.fullName
                                        .charAt(0)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div>
                                  <p className='text-sm font-medium'>
                                    {employee.fullName}
                                  </p>
                                  <p className='text-xs text-gray-500'>
                                    {employee.designation} -{" "}
                                    {employee.department?.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Departments */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Users className='w-5 h-5' />
                      Departments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      {availableDepartments.map((department) => (
                        <div
                          key={department.id}
                          className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50'
                        >
                          <Checkbox
                            checked={selectedDepartments.some(
                              (d) => d.id === department.id
                            )}
                            onCheckedChange={() =>
                              handleDepartmentToggle(department)
                            }
                          />
                          <div className='flex-1'>
                            <p className='text-sm font-medium'>
                              {department.name}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {department.employeeCount} employees
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Selected Participants Preview */}
              {(selectedParticipants.length > 0 ||
                selectedDepartments.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Participants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {selectedParticipants.map((participant) => (
                        <Badge
                          key={participant.userId}
                          variant='secondary'
                          className='flex items-center gap-1'
                        >
                          {participant.fullName}
                          <X
                            className='w-3 h-3 cursor-pointer'
                            onClick={() => handleParticipantToggle(participant)}
                          />
                        </Badge>
                      ))}
                      {selectedDepartments.map((department) => (
                        <Badge
                          key={department.id}
                          variant='outline'
                          className='flex items-center gap-1'
                        >
                          {department.name} Dept.
                          <X
                            className='w-3 h-3 cursor-pointer'
                            onClick={() => handleDepartmentToggle(department)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value='agenda' className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='description'>
                  Meeting Description / Agenda
                </Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={generateAgenda}
                  disabled={isGeneratingAgenda}
                  className='flex items-center gap-2 bg-transparent'
                >
                  <Sparkles className='w-4 h-4' />
                  {isGeneratingAgenda ? "Generating..." : "Generate with AI"}
                </Button>
              </div>

              {isGeneratingAgenda && (
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-blue-600'>
                      Creating intelligent agenda...
                    </span>
                    <span className='text-sm text-blue-600'>
                      {agendaProgress}%
                    </span>
                  </div>
                  <Progress value={agendaProgress} className='h-2' />
                </div>
              )}

              <MeetingRichTextEditor
                content={watch("description") || ""}
                onChange={(content) => setValue("description", content)}
                placeholder='Enter meeting description or agenda, or use AI to generate one...'
              />

              {generatedAgenda && (
                <Card className='border-green-200 bg-green-50'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-green-700'>
                      <CheckCircle className='w-5 h-5' />
                      AI Generated Agenda
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='bg-green-600 p-4 rounded-lg border'>
                      <div
                        dangerouslySetInnerHTML={{ __html: generatedAgenda }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value='review' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Summary</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <Label className='font-medium'>Title</Label>
                      <p className='text-sm text-gray-600'>
                        {watchedTitle || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <Label className='font-medium'>Priority</Label>
                      <Badge
                        variant={
                          watch("priority") === "High" ||
                          watch("priority") === "Urgent"
                            ? "destructive"
                            : "secondary"
                        }
                        className='ml-2'
                      >
                        {watch("priority") || "Medium"}
                      </Badge>
                    </div>
                    <div>
                      <Label className='font-medium'>Date & Time</Label>
                      <p className='text-sm text-gray-600'>
                        {watchedStartDateTime && watchedEndDateTime
                          ? `${format(
                              new Date(watchedStartDateTime),
                              "PPP HH:mm"
                            )} - ${format(
                              new Date(watchedEndDateTime),
                              "HH:mm"
                            )}`
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <Label className='font-medium'>Location</Label>
                      <p className='text-sm text-gray-600'>
                        {watch("venue") || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <Label className='font-medium'>Participants</Label>
                      <p className='text-sm text-gray-600'>
                        {selectedParticipants.length} individuals,{" "}
                        {selectedDepartments.length} departments
                      </p>
                    </div>
                  </div>

                  {watch("description") && (
                    <div>
                      <Label className='font-medium'>Agenda</Label>
                      <div className='mt-1 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: watch("description") || "",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedParticipants.length > 0 && (
                    <div>
                      <Label className='font-medium'>
                        Selected Participants
                      </Label>
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {selectedParticipants.map((participant) => (
                          <div
                            key={participant.userId}
                            className='flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1'
                          >
                            {participant.userImage ? (
                              <Avatar>
                                <AvatarImage
                                  src={
                                    participant.userImage || "/placeholder.svg"
                                  }
                                  alt={participant.fullName}
                                />
                                <AvatarFallback>
                                  {participant.fullName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <Avatar className='w-8 h-8'>
                                <AvatarFallback>
                                  {participant.fullName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <span className='text-sm'>
                              {participant.fullName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className='flex justify-end gap-2 pt-4 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeetingModal;
