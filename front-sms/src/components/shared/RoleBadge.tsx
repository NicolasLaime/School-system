import { Badge } from "@/components/ui/badge"
import { Shield, GraduationCap, Users, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export type UserRole = "ROLE_ADMIN" | "ROLE_DOCENTE" | "ROLE_DIRECTIVO" | "ROLE_SUPERADMIN"

export interface RoleBadgeProps {
  role: UserRole
  iconOnly?: boolean
  className?: string
}

const ROLE_CONFIG: Record<
  UserRole,
  {
    label: string
    icon: React.ComponentType<{ size?: number; className?: string }>
    className: string
  }
> = {
  ROLE_SUPERADMIN: {
    label: "Super Admin",
    icon: ShieldCheck,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  ROLE_ADMIN: {
    label: "Admin",
    icon: Shield,
    className: "bg-info-muted text-info border-info/20",
  },
  ROLE_DIRECTIVO: {
    label: "Directivo",
    icon: Users,
    className: "bg-warning-muted text-warning border-warning/20",
  },
  ROLE_DOCENTE: {
    label: "Docente",
    icon: GraduationCap,
    className: "bg-success-muted text-success border-success/20",
  },
}

export function RoleBadge({ role, iconOnly = false, className }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role]

  if (!config) return null

  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium gap-1 rounded-full py-0.5 px-2",
        config.className,
        className
      )}
    >
      <Icon size={10} />
      {!iconOnly && <span>{config.label}</span>}
    </Badge>
  )
}
