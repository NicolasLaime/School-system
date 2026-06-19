"use client"
import { PageHeader } from "@/components/layout/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { AlertCircle } from "lucide-react"

export default function ComplainsPage() {
  return (
    <div>
      <PageHeader title="Reclamos" breadcrumbs={[{ label: "Reclamos" }]} />
      <EmptyState
        icon={AlertCircle}
        title="Módulo en desarrollo"
        description="El módulo de reclamos estará disponible próximamente."
      />
    </div>
  )
}
