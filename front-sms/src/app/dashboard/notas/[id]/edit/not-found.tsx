import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container mx-auto px-10 py-5">
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <h2 className="text-2xl font-bold">Nota no encontrada</h2>
        <p className="text-muted-foreground">La nota que buscas no existe o ha sido eliminada.</p>
        <Link
          href="/dashboard/notas"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Volver al listado
        </Link>
      </div>
    </section>
  )
}
