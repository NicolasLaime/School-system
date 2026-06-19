import { PageHeader } from "@/components/layout/PageHeader"
import { CalendarWrapper } from "./calendar-wrapper"

export default function CalendarPage() {
  return (
    <div>
      <PageHeader title="Calendario" breadcrumbs={[{ label: "Calendario" }]} />
      <CalendarWrapper />
    </div>
  )
}
