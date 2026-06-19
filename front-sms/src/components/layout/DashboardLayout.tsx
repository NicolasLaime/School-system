"use client"

import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardTopbar } from "./DashboardTopbar"
import { AnimatedPage } from "./AnimatedPage"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarInset className="flex flex-col min-h-screen">
      <DashboardTopbar />
      <main className="flex-1 overflow-y-auto bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AnimatedPage>{children}</AnimatedPage>
        </div>
      </main>
    </SidebarInset>
  )
}
