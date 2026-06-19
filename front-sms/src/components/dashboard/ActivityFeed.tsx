"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmptyState } from "@/components/shared/EmptyState"
import { Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export interface Activity {
  id: string
  actorAvatar?: string
  actorName: string
  action: string
  timestamp: Date | string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="Sin actividad reciente"
        description="No hay actividad registrada en los últimos días."
      />
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Actividad Reciente</h3>
      <div className="space-y-3">
        {activities.map((activity) => {
          const date =
            typeof activity.timestamp === "string"
              ? new Date(activity.timestamp)
              : activity.timestamp
          const timeAgo = formatDistanceToNow(date, {
            addSuffix: true,
            locale: es,
          })

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.actorAvatar} alt={activity.actorName} />
                <AvatarFallback className="text-xs">
                  {activity.actorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.actorName}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
