"use client"
import { PageHeader } from "@/components/layout/PageHeader"
import { useGetAsignaturasConDocentesQuery, useAsignarDocenteMutation, useDesasignarDocenteMutation } from '@/redux/services/asignatura.Api'
import { useGetUsuariosByRolQuery } from '@/redux/services/authApi'
import { Loader2, User, BookOpen, GraduationCap, Hash, Trash2, Pencil } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const Page = () => {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const { data, isLoading, isError, refetch } = useGetAsignaturasConDocentesQuery()
  const { data: docentesData, isLoading: isLoadingDocentes } = useGetUsuariosByRolQuery('DOCENTE')
  const [asignarDocente, { isLoading: isAsignando }] = useAsignarDocenteMutation()
  const [desasignarDocente, { isLoading: isDesasignando }] = useDesasignarDocenteMutation()
  const [open, setOpen] = useState(false)
  const [selectedDocenteId, setSelectedDocenteId] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  if (isLoading) return (
    <section className="container mx-auto py-10">
      <Loader2 className="mx-auto h-48 w-48 animate-spin" />
    </section>
  )

  if (isError) return <div className="container mx-auto py-10 px-5 text-destructive text-center">Error al cargar los datos</div>

  const allRows = data?.data?.flatMap((a) => a.docentes ?? []) ?? []
  const claseData = allRows.find((item) => item.id === id)

  if (!claseData) {
    return (
      <div className="container mx-auto py-10 px-5">
        <p className="text-destructive text-center">Clase no encontrada</p>
      </div>
    )
  }

  const handleAsignar = async () => {
    setError('')
    setMensaje('')
    if (!selectedDocenteId) {
      setError('Debe seleccionar un docente')
      return
    }
    try {
      await asignarDocente({
        docenteId: Number(selectedDocenteId),
        asignaturaId: claseData.asignaturaId,
        seccionId: claseData.seccionId,
      }).unwrap()
      setMensaje('Docente asignado correctamente')
      setSelectedDocenteId('')
      setTimeout(() => {
        setOpen(false)
        refetch()
      }, 1500)
    } catch (err) {
      setError((err as { data?: { error?: string } })?.data?.error || 'Error al asignar docente')
    }
  }

  const handleDesasignar = async () => {
    setError('')
    setMensaje('')
    try {
      await desasignarDocente({
        docenteId: claseData.docenteId,
        asignaturaId: claseData.asignaturaId,
        seccionId: claseData.seccionId,
      }).unwrap()
      setMensaje('Docente desasignado correctamente')
      setTimeout(() => {
        router.push('/dashboard/clases')
      }, 1500)
    } catch (err) {
      setError((err as { data?: { error?: string } })?.data?.error || 'Error al desasignar docente')
    }
  }

  return (
    <main className="container mx-auto py-10 px-5">
      <PageHeader title="Información de la Clase" breadcrumbs={[{ label: "Clases", href: "/dashboard/clases" }, { label: "Información" }]} />

      {mensaje && (
        <Alert className="border-green-200 my-4">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{mensaje}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Información de la Clase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ID:</span>
              <span className="font-medium">{claseData.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Materia:</span>
              <span className="font-medium">{claseData.asignaturaNombre}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sección:</span>
              <Badge variant="outline">{claseData.seccionNombre}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Grado:</span>
              <span className="font-medium">{claseData.gradoNombre}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Docente Asignado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-lg font-semibold">
                {claseData.docenteNombre} {claseData.docenteApellido}
              </p>
              <p className="text-sm text-muted-foreground">ID: {claseData.docenteId}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Pencil className="mr-2 h-4 w-4" />
                    Cambiar Docente
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cambiar Docente</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nuevo Docente</label>
                      <Select value={selectedDocenteId} onValueChange={setSelectedDocenteId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar docente" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingDocentes ? (
                            <SelectItem value="loading" disabled>Cargando docentes...</SelectItem>
                          ) : (
                            docentesData?.data?.map((docente) => (
                              <SelectItem key={docente.id} value={String(docente.id)}>
                                {docente.nombre} {docente.apellido}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAsignar} disabled={isAsignando} className="w-full cursor-pointer">
                      {isAsignando ? 'Asignando...' : 'Asignar'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDesasignar}
                disabled={isDesasignando}
                className="cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDesasignando ? 'Quitando...' : 'Quitar Docente'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default Page
