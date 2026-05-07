import Link from "next/link"
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Seccion no encontrada</h2>
      <p className="mb-4">No se pudo encontrar la seccion solicitada.</p>
      <Link href="/dashboard/secciones" className="text-blue-600 hover:underline">
        Volver al listado de secciones
      </Link>
    </div>
  )
}
