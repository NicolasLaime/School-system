"use client"
import React, { useState } from 'react'
import { AsignaturaConDocentes, DocenteAsignado } from '../../../types/materia.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Trash2, AlertCircle, CheckCircle2, User, BookOpen, GraduationCap, Hash } from 'lucide-react'
import {
  useAsignarDocenteMutation,
  useDesasignarDocenteMutation,
} from '@/redux/services/asignatura.Api'
import { useGetSeccionesQuery } from '@/redux/services/seccionesApi'
import { useGetUsuariosByRolQuery } from '@/redux/services/authApi'

interface MateriaInfoProps {
  materia: AsignaturaConDocentes
}

const MateriaInfo = ({ materia }: MateriaInfoProps) => {
  const [open, setOpen] = useState(false)
  const [selectedDocenteId, setSelectedDocenteId] = useState('')
  const [selectedSeccionId, setSelectedSeccionId] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const [asignarDocente, { isLoading: isAsignando }] = useAsignarDocenteMutation()
  const [desasignarDocente, { isLoading: isDesasignando }] = useDesasignarDocenteMutation()
  const { data: secciones, isLoading: isLoadingSecciones } = useGetSeccionesQuery()
  const { data: docentesData, isLoading: isLoadingDocentes } = useGetUsuariosByRolQuery('DOCENTE')

  const handleAsignar = async () => {
    setError('')
    setMensaje('')
    if (!selectedDocenteId || !selectedSeccionId) {
      setError('Debe seleccionar un docente y una sección')
      return
    }
    try {
      const response = await asignarDocente({
        docenteId: Number(selectedDocenteId),
        asignaturaId: materia.id,
        seccionId: Number(selectedSeccionId),
      }).unwrap()
      if (response) {
        setMensaje('Docente asignado correctamente')
        setSelectedDocenteId('')
        setSelectedSeccionId('')
        setTimeout(() => setOpen(false), 1500)
      }
    } catch (err) {
      const errorMsg =
        (err as { data?: { error?: string } })?.data?.error ||
        'Error al asignar docente'
      setError(errorMsg)
    }
  }

  const handleDesasignar = async (docenteId: number, seccionId: number) => {
    setError('')
    setMensaje('')
    try {
      await desasignarDocente({
        docenteId,
        asignaturaId: materia.id,
        seccionId,
      }).unwrap()
      setMensaje('Docente desasignado correctamente')
    } catch (err) {
      const errorMsg =
        (err as { data?: { error?: string } })?.data?.error ||
        'Error al desasignar docente'
      setError(errorMsg)
    }
  }

  return (
    <div className="space-y-6 py-10">
      {mensaje && (
        <Alert className="border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{mensaje}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Información de la Asignatura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ID:</span>
              <span className="font-medium">{materia.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Nombre:</span>
              <span className="font-medium">{materia.nombre}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Código:</span>
              <Badge variant="outline">{materia.codigo}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Grado:</span>
              <span className="font-medium">{materia.gradoNombre}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ciclo Educativo:</span>
              <Badge>{materia.cicloEducativoNombre}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Docente a Cargo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {materia.docenteId ? (
              <div className="space-y-1">
                <p className="text-lg font-semibold">
                  {materia.docenteNombre} {materia.docenteApellido}
                </p>
                <p className="text-sm text-muted-foreground">ID: {materia.docenteId}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Sin docente asignado</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Docentes por Sección
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Asignar Docente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Asignar Docente a {materia.nombre}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Docente</label>
                  <Select value={selectedDocenteId} onValueChange={setSelectedDocenteId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar docente" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingDocentes ? (
                        <SelectItem value="loading" disabled>
                          Cargando docentes...
                        </SelectItem>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sección</label>
                  <Select value={selectedSeccionId} onValueChange={setSelectedSeccionId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sección" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingSecciones ? (
                        <SelectItem value="loading" disabled>
                          Cargando secciones...
                        </SelectItem>
                      ) : (
                        secciones?.data?.map((seccion) => (
                          <SelectItem key={seccion.id} value={String(seccion.id)}>
                            {seccion.nombre} - {seccion.gradoNombre}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAsignar}
                  disabled={isAsignando}
                  className="w-full cursor-pointer"
                >
                  {isAsignando ? 'Asignando...' : 'Asignar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {materia.docentes && materia.docentes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Docente</TableHead>
                  <TableHead>Sección</TableHead>
                  <TableHead>Grado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materia.docentes.map((docenteAsignado: DocenteAsignado) => (
                  <TableRow key={docenteAsignado.id}>
                    <TableCell className="font-medium">
                      {docenteAsignado.docenteNombre} {docenteAsignado.docenteApellido}
                    </TableCell>
                    <TableCell>{docenteAsignado.seccionNombre}</TableCell>
                    <TableCell>{docenteAsignado.gradoNombre}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDesasignar(
                            docenteAsignado.docenteId,
                            docenteAsignado.seccionId
                          )
                        }
                        disabled={isDesasignando}
                        className="cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No hay docentes asignados a esta asignatura
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MateriaInfo
