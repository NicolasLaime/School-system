"use client"

import { useCallback } from "react"
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { es } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { SkeletonTable } from "@/components/shared/SkeletonTable"

type CalendarEventType = "clase" | "examen" | "feriado" | "reunion" | "comunicado"
type CalendarView = "month" | "week" | "day" | "agenda"

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: CalendarEventType
  description?: string
  claseId?: number
  allDay?: boolean
  createdBy?: number
}

interface CalendarModuleProps {
  events?: CalendarEvent[]
  defaultView?: CalendarView
  allowCreate?: boolean
  onEventCreate?: (event: Omit<CalendarEvent, "id">) => Promise<void>
  onEventClick?: (event: CalendarEvent) => void
  isLoading?: boolean
  visibleTypes?: CalendarEventType[]
}

const locales = { es }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

const typeStyleMap: Record<string, string> = {
  clase: "var(--color-primary)",
  examen: "var(--color-warning)",
  feriado: "var(--color-destructive)",
  reunion: "var(--color-info)",
  comunicado: "var(--color-secondary)",
}

const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este período.",
  showMore: (total: number) => `+${total} más`,
}

export function CalendarModule({
  events = [],
  defaultView = "month",
  isLoading = false,
  onEventClick,
}: CalendarModuleProps) {
  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      onEventClick?.(event)
    },
    [onEventClick]
  )

  const eventPropGetter = useCallback(
    (event: CalendarEvent) => ({
      style: {
        backgroundColor: typeStyleMap[event.type] || "var(--color-primary)",
        borderRadius: "4px",
        border: "none",
        fontSize: "11px",
        padding: "2px 4px",
      },
    }),
    []
  )

  if (isLoading) {
    return <SkeletonTable rows={12} columns={7} showToolbar={false} showPagination={false} />
  }

  return (
    <div className="h-[700px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={defaultView as "month" | "week" | "day" | "agenda"}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        messages={messages}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        culture="es"
        className="rounded-lg border border-border bg-card"
      />
    </div>
  )
}
