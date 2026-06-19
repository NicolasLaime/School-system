import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="text-8xl font-bold text-muted-foreground/20 mb-4">404</div>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Página no encontrada</h1>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        La página que buscas no existe o ha sido movida.
      </p>
      <Button asChild>
        <Link href="/dashboard">Volver al Dashboard</Link>
      </Button>
    </div>
  )
}
