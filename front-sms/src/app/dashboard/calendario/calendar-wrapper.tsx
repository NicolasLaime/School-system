"use client"

import dynamic from "next/dynamic"
import { SkeletonTable } from "@/components/shared/SkeletonTable"

const CalendarModuleDynamic = dynamic(
  () => import("@/components/calendar/CalendarModule").then((mod) => ({ default: mod.CalendarModule })),
  {
    ssr: false,
    loading: () => <SkeletonTable rows={12} columns={7} showToolbar={false} showPagination={false} />,
  }
)

export function CalendarWrapper() {
  return <CalendarModuleDynamic />
}
