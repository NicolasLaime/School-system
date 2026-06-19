"use client"
import { PageHeader } from "@/components/layout/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Megaphone } from "lucide-react"

export default function NoticesPage() {
  return (
    <div>
      <PageHeader title="Comunicados" breadcrumbs={[{ label: "Comunicados" }]} />
      <EmptyState
        icon={Megaphone}
        title="Módulo en desarrollo"
        description="El módulo de comunicados estará disponible próximamente."
      />
    </div>
  )
}
