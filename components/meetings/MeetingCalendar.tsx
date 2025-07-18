"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface MeetingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    organizer: string;
    participants: number;
    location?: string;
    status: "Scheduled" | "InProgress" | "Completed" | "Cancelled";
    priority: "Low" | "Medium" | "High" | "Urgent";
  };
}

interface MeetingCalendarProps {
  meetings: MeetingEvent[];
  onSelectEvent: (event: MeetingEvent) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  onEventDrop: (event: { event: MeetingEvent; start: Date; end: Date }) => void;
  view: View;
  onViewChange: (view: View) => void;
  date: Date;
  onNavigate: (date: Date) => void;
}

const MeetingCalendar: React.FC<MeetingCalendarProps> = ({
  meetings,
  onSelectEvent,
  onSelectSlot,
  onEventDrop,
  view,
  onViewChange,
  date,
  onNavigate,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<MeetingEvent | null>(null);

  const eventStyleGetter = useCallback((event: MeetingEvent) => {
    let backgroundColor = "#3174ad";
    let borderColor = "#3174ad";

    switch (event.resource.priority) {
      case "Urgent":
        backgroundColor = "#dc3545";
        borderColor = "#dc3545";
        break;
      case "High":
        backgroundColor = "#fd7e14";
        borderColor = "#fd7e14";
        break;
      case "Medium":
        backgroundColor = "#20c997";
        borderColor = "#20c997";
        break;
      case "Low":
        backgroundColor = "#6c757d";
        borderColor = "#6c757d";
        break;
    }

    if (event.resource.status === "Completed") {
      backgroundColor = "#28a745";
      borderColor = "#28a745";
    } else if (event.resource.status === "Cancelled") {
      backgroundColor = "#6c757d";
      borderColor = "#6c757d";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "12px",
        padding: "2px 4px",
      },
    };
  }, []);

  const handleSelectEvent = useCallback(
    (event: MeetingEvent) => {
      setSelectedEvent(event);
      onSelectEvent(event);
    },
    [onSelectEvent]
  );

  const handleEventDrop = useCallback(
    (args: { event: MeetingEvent; start: Date; end: Date }) => {
      onEventDrop(args);
    },
    [onEventDrop]
  );

  const CustomEvent = ({ event }: { event: MeetingEvent }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className='h-full w-full flex flex-col justify-center'
    >
      <div className='font-semibold text-xs truncate'>{event.title}</div>
      <div className='text-xs opacity-90 flex items-center gap-1'>
        <Users className='w-3 h-3' />
        {event.resource.participants}
      </div>
    </motion.div>
  );

  const CustomToolbar = ({
    label,
    onNavigate: handleNavigate,
    onView: handleViewChange,
    view: currentView,
  }: {
    label: string;
    onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
    onView: (view: View) => void;
    view: View;
  }) => {
    const views: View[] = ["month", "week", "day", "agenda"];

    return (
      <div className='flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleNavigate("PREV")}
          >
            Previous
          </Button>
          <h2 className='text-xl font-semibold'>{label}</h2>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleNavigate("NEXT")}
          >
            Next
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleNavigate("TODAY")}
          >
            Today
          </Button>
        </div>
        <div className='flex gap-2'>
          {views.map((viewName) => (
            <Button
              key={viewName}
              variant={currentView === viewName ? "default" : "outline"}
              size='sm'
              onClick={() => handleViewChange(viewName)}
              className='capitalize'
            >
              {viewName}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='h-full'
    >
      <Card className='h-full'>
        <CardContent className='p-0 h-full'>
          <motion.div style={{ height: "700px" }}>
            <Calendar
              localizer={localizer}
              events={meetings}
              startAccessor='start'
              endAccessor='end'
              view={view}
              onView={onViewChange}
              date={date}
              onNavigate={onNavigate}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={onSelectSlot}
              onEventDrop={handleEventDrop as any} // Type assertion needed here
              eventPropGetter={eventStyleGetter}
              components={{
                event: CustomEvent,
                toolbar: CustomToolbar,
              }}
              selectable
              resizable
              className='meeting-calendar'
              formats={{
                timeGutterFormat: "HH:mm",
                eventTimeRangeFormat: ({ start, end }) =>
                  `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`,
              }}
            />
          </motion.div>
        </CardContent>
      </Card>

      <style jsx global>{`
        .meeting-calendar .rbc-calendar {
          font-family: inherit;
        }

        .meeting-calendar .rbc-header {
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
          padding: 8px 12px;
          font-weight: 600;
        }

        .meeting-calendar .rbc-today {
          background-color: #e3f2fd;
        }

        .meeting-calendar .rbc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 12px;
        }

        .meeting-calendar .rbc-selected {
          background-color: #1976d2 !important;
        }

        .meeting-calendar .rbc-time-view .rbc-time-gutter {
          background: #f8f9fa;
        }

        .meeting-calendar .rbc-time-slot {
          border-top: 1px solid #f0f0f0;
        }

        .meeting-calendar .rbc-current-time-indicator {
          background-color: #dc3545;
          height: 2px;
        }
      `}</style>
    </motion.div>
  );
};

export default MeetingCalendar;
