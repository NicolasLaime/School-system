import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthLoader } from "@/components/dashboard/auth-loader"
import HelpChat from "@/components/helpBotData"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AuthLoader />
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <ModeToggle />
        {children}
      </main>
      {/* Chat flotante SIEMPRE visible */}
      <HelpChat />
    </SidebarProvider>
  )
}