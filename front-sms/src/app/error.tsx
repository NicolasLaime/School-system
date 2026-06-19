"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="text-8xl font-bold text-destructive/20 mb-4">!</div>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Algo salió mal</h1>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        Ocurrió un error inesperado. Por favor intentá de nuevo.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Reintentar</Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Volver al Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
