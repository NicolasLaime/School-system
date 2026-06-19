import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType = "activo" | "inactivo" | "pendiente"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const STATUS_CONFIG: Record<StatusType, { label: string; className: string }> = {
  activo: {
    label: "Activo",
    className: "bg-success-muted text-success border-success/20",
  },
  inactivo: {
    label: "Inactivo",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  pendiente: {
    label: "Pendiente",
    className: "bg-warning-muted text-warning border-warning/20",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  if (!config) return null

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium rounded-full", config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
