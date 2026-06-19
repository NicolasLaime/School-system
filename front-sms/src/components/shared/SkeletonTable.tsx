import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface SkeletonTableProps {
  rows?: number
  columns?: number
  showToolbar?: boolean
  showPagination?: boolean
}

export function SkeletonTable({
  rows = 8,
  columns = 5,
  showToolbar = true,
  showPagination = true,
}: SkeletonTableProps) {
  return (
    <div className="space-y-4">
      {showToolbar && (
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-24 ml-auto" />
          <Skeleton className="h-9 w-24" />
        </div>
      )}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="flex gap-4 p-3 bg-muted/40 border-b border-border">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4" style={{ flex: i === 0 ? "0 0 20px" : 1 }} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className={cn(
              "flex gap-4 p-3 border-b border-border last:border-0",
              rowIdx % 2 === 0 ? "bg-background" : "bg-muted/20"
            )}
          >
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton
                key={colIdx}
                className="h-4 rounded"
                style={{ flex: colIdx === 0 ? "0 0 20px" : 1, animationDelay: `${rowIdx * 50}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
      {showPagination && (
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-20" />
        </div>
      )}
    </div>
  )
}
