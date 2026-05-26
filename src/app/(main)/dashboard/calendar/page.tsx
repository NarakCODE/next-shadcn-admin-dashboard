"use client";

import { useState } from "react";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, NotebookPen, Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  time?: string;
  color: EventColor;
  description?: string;
  location?: string;
  type: "event" | "note";
};

type EventColor = "default" | "blue" | "green" | "red" | "yellow" | "purple";

const eventColorMap: Record<EventColor, string> = {
  default: "bg-primary text-primary-foreground",
  blue: "bg-blue-500 text-white",
  green: "bg-emerald-500 text-white",
  red: "bg-red-500 text-white",
  yellow: "bg-amber-500 text-white",
  purple: "bg-violet-500 text-white",
};

const eventColorBadgeMap: Record<EventColor, string> = {
  default: "bg-primary",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  red: "bg-red-500",
  yellow: "bg-amber-500",
  purple: "bg-violet-500",
};

const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    date: new Date(),
    time: "09:00",
    color: "blue",
    description: "Daily sync with the team",
    location: "Zoom Room 1",
    type: "event",
  },
  {
    id: "2",
    title: "Design Review",
    date: new Date(),
    time: "14:00",
    color: "purple",
    description: "Review new dashboard mockups",
    location: "Conference Room B",
    type: "event",
  },
  {
    id: "3",
    title: "Sprint Planning",
    date: new Date(Date.now() + 86400000 * 2),
    time: "10:00",
    color: "green",
    type: "event",
  },
  {
    id: "4",
    title: "Remember to update dependencies",
    date: new Date(Date.now() + 86400000 * 5),
    color: "yellow",
    type: "note",
  },
  {
    id: "5",
    title: "Client Presentation",
    date: new Date(Date.now() + 86400000 * 7),
    time: "15:00",
    color: "red",
    location: "Main Office",
    type: "event",
  },
];

const colorOptions: { value: EventColor; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "red", label: "Red" },
  { value: "yellow", label: "Yellow" },
  { value: "purple", label: "Purple" },
];

export default function Page() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    color: "default" as EventColor,
    description: "",
    location: "",
    type: "event" as "event" | "note",
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDay = (date: Date) => events.filter((event) => isSameDay(event.date, date));

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setNewEvent({
      title: "",
      time: "",
      color: "default",
      description: "",
      location: "",
      type: "event",
    });
    setIsCreateOpen(true);
  };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim() || !selectedDate) return;

    const event: CalendarEvent = {
      id: String(events.length + 1),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time || undefined,
      color: newEvent.color,
      description: newEvent.description || undefined,
      location: newEvent.location || undefined,
      type: newEvent.type,
    };

    setEvents([...events, event]);
    setIsCreateOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
    setIsEventDetailOpen(false);
    setSelectedEvent(null);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-medium text-xl">Calendar</h1>
          <p className="text-muted-foreground text-sm">Manage your events and notes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={handlePrevMonth}>
              <ChevronLeft />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={handleNextMonth}>
              <ChevronRight />
            </Button>
          </div>
          <h2 className="min-w-32 font-medium text-lg">{format(currentMonth, "MMMM yyyy")}</h2>
          <Button size="sm" onClick={() => handleDayClick(new Date())}>
            <Plus data-icon="inline-start" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-hidden rounded-lg border bg-card">
        <div className="flex h-full flex-col">
          {/* Week day headers */}
          <div className="grid grid-cols-7 border-b">
            {weekDays.map((day) => (
              <div
                key={day}
                className="flex h-10 items-center justify-center border-r font-medium text-xs last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid flex-1 grid-cols-7">
            {days.map((day, dayIdx) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "group relative flex min-h-24 flex-col border-r border-b p-1 transition-colors hover:bg-muted/50",
                    dayIdx % 7 === 6 && "border-r-0",
                    !isCurrentMonth && "bg-muted/30",
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  {/* Day number */}
                  <div className="flex items-center justify-between px-1 pt-1">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs",
                        isTodayDate && "bg-primary font-medium text-primary-foreground",
                        !isCurrentMonth && "text-muted-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {dayEvents.length > 0 && (
                      <Badge
                        variant="outline"
                        className="hidden size-5 items-center justify-center p-0 text-[10px] group-hover:flex"
                      >
                        {dayEvents.length}
                      </Badge>
                    )}
                  </div>

                  {/* Events */}
                  <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-0.5 px-0.5 py-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <button
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          className={cn(
                            "truncate rounded px-1.5 py-0.5 text-left font-medium text-[10px]",
                            eventColorMap[event.color],
                          )}
                        >
                          {event.time && <span className="mr-1 opacity-75">{event.time}</span>}
                          {event.title}
                        </button>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="px-1.5 text-[10px] text-muted-foreground">+{dayEvents.length - 3} more</span>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}</DialogTitle>
            <DialogDescription>Add a new event or note to your calendar</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel>Type</FieldLabel>
              <Select
                value={newEvent.type}
                onValueChange={(value: "event" | "note") => setNewEvent({ ...newEvent, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="size-4" />
                      Event
                    </div>
                  </SelectItem>
                  <SelectItem value="note">
                    <div className="flex items-center gap-2">
                      <NotebookPen className="size-4" />
                      Note
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="event-title">Title</FieldLabel>
              <Input
                id="event-title"
                placeholder={newEvent.type === "event" ? "Enter event title" : "Enter note"}
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Field>

            {newEvent.type === "event" && (
              <>
                <Field>
                  <FieldLabel htmlFor="event-time">Time</FieldLabel>
                  <Input
                    id="event-time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="event-location">Location</FieldLabel>
                  <Input
                    id="event-location"
                    placeholder="Add location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </Field>
              </>
            )}

            <Field>
              <FieldLabel htmlFor="event-description">
                {newEvent.type === "note" ? "Note Details" : "Description"}
              </FieldLabel>
              <Textarea
                id="event-description"
                placeholder="Add details..."
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={3}
              />
            </Field>

            <Field>
              <FieldLabel>Color</FieldLabel>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewEvent({ ...newEvent, color: color.value })}
                    className={cn(
                      "size-6 rounded-full transition-transform",
                      eventColorBadgeMap[color.value],
                      newEvent.color === color.value && "scale-110 ring-2 ring-foreground ring-offset-2",
                    )}
                    aria-label={`Select ${color.label} color`}
                  />
                ))}
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent} disabled={!newEvent.title.trim()}>
              {newEvent.type === "event" ? "Create Event" : "Add Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
        <DialogContent>
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn(eventColorMap[selectedEvent.color], "border-transparent")}>
                        {selectedEvent.type === "event" ? "Event" : "Note"}
                      </Badge>
                    </div>
                    <DialogTitle>{selectedEvent.title}</DialogTitle>
                    <DialogDescription>{format(selectedEvent.date, "EEEE, MMMM d, yyyy")}</DialogDescription>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                    <X />
                  </Button>
                </div>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                {selectedEvent.time && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="text-muted-foreground" />
                    <span>{selectedEvent.time}</span>
                  </div>
                )}

                {selectedEvent.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="rounded-md bg-muted p-3 text-sm">{selectedEvent.description}</div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEventDetailOpen(false)}>
                  Close
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
