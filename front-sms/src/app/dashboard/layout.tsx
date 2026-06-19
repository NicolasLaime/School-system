import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import HelpChat from "@/components/helpBotData"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <DashboardLayout>
        {children}
      </DashboardLayout>
      <HelpChat defaultOpen={false} />
    </SidebarProvider>
  )
}
