import Link from "next/link"
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Grado no encontrado</h2>
      <p className="mb-4">No se pudo encontrar el grado solicitado.</p>
      <Link href="/dashboard/grados" className="text-blue-600 hover:underline">
        Volver al listado de grados
      </Link>
    </div>
  )
}
