"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCountUp } from "@/hooks/useCountUp"
import { cardEntrance } from "@/lib/animations"
import { cn } from "@/lib/utils"

export interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  iconColor?: "primary" | "success" | "warning" | "destructive" | "info"
  trend?: number
  trendLabel?: string
  animate?: boolean
  isLoading?: boolean
  onClick?: () => void
  index?: number
}

const iconColorMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info-muted text-info",
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = "primary",
  trend,
  trendLabel = "vs mes anterior",
  animate = true,
  isLoading,
  onClick,
  index = 0,
}: StatsCardProps) {
  const numericValue = typeof value === "number" ? value : NaN
  const shouldAnimate = animate && !isNaN(numericValue)
  const animatedValue = useCountUp(shouldAnimate ? numericValue : 0)
  const displayValue = shouldAnimate ? animatedValue : value

  const TrendIcon = trend && trend > 0 ? TrendingUp : trend && trend < 0 ? TrendingDown : Minus
  const trendColor =
    trend && trend > 0
      ? "text-success"
      : trend && trend < 0
        ? "text-destructive"
        : "text-muted-foreground"

  if (isLoading) {
    return (
      <Card className="p-5">
        <Skeleton className="h-8 w-8 rounded-lg mb-3" />
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-4 w-32" />
      </Card>
    )
  }

  return (
    <motion.div custom={index} variants={cardEntrance} initial="hidden" animate="visible">
      <Card
        className={cn(
          "p-5 cursor-default transition-shadow hover:shadow-[var(--shadow-card-hover)]",
          onClick && "cursor-pointer"
        )}
        onClick={onClick}
      >
        <CardContent className="p-0 space-y-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              iconColorMap[iconColor]
            )}
          >
            <Icon size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight">{displayValue}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
          </div>
          {trend !== undefined && (
            <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
              <TrendIcon size={12} />
              <span>
                {Math.abs(trend)}% {trendLabel}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
