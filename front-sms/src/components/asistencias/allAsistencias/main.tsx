"use client"

import { useState } from "react"
import { useGetAsistenciasDocenteQuery, useGetAsistenciasAlumnoBySeccionQuery } from "@/redux/services/asistenciasApi"
import { useGetSeccionesQuery } from "@/redux/services/seccionesApi"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const MainAllAsistencias = () => {
  const [tipo, setTipo] = useState<"docente" | "alumno">("docente")
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
  const [seccionId, setSeccionId] = useState<string>("")

  const { data: seccionesData } = useGetSeccionesQuery()
  const { data: asistenciasDocente, isLoading: isLoadingDocente } = useGetAsistenciasDocenteQuery(
    { fecha },
    { skip: tipo !== "docente" }
  )
  const { data: asistenciasAlumno, isLoading: isLoadingAlumno } = useGetAsistenciasAlumnoBySeccionQuery(
    { seccionId, fecha },
    { skip: tipo !== "alumno" || !seccionId }
  )

  const isLoading = tipo === "docente" ? isLoadingDocente : isLoadingAlumno
  const asistencias = tipo === "docente" ? asistenciasDocente?.data : asistenciasAlumno?.data

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "PRESENTE": return "text-green-600"
      case "AUSENTE": return "text-red-600"
      case "TARDANZA": return "text-yellow-600"
      case "JUSTIFICADO": return "text-blue-600"
      default: return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end flex-wrap">
        <div className="flex gap-2">
          <Button
            variant={tipo === "docente" ? "default" : "outline"}
            onClick={() => setTipo("docente")}
          >
            Docentes
          </Button>
          <Button
            variant={tipo === "alumno" ? "default" : "outline"}
            onClick={() => setTipo("alumno")}
          >
            Alumnos
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Fecha</label>
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-48"
          />
        </div>

        {tipo === "alumno" && (
          <div>
            <label className="text-sm font-medium mb-1 block">Seccion</label>
            <Select onValueChange={setSeccionId} value={seccionId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecciona una seccion" />
              </SelectTrigger>
              <SelectContent>
                {seccionesData?.data?.map((seccion) => (
                  <SelectItem key={seccion.id} value={String(seccion.id)}>
                    {seccion.nombre} - {seccion.cicloLectivo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-10 w-10" />
        </div>
      ) : asistencias && asistencias.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asistencias.map((asistencia: any) => (
                <TableRow key={asistencia.id}>
                  <TableCell className="font-medium">
                    {tipo === "docente"
                      ? asistencia.docenteNombre || `Docente #${asistencia.docenteId}`
                      : asistencia.alumnoNombre || `Alumno #${asistencia.alumnoId}`}
                  </TableCell>
                  <TableCell>{asistencia.fecha}</TableCell>
                  <TableCell className={getEstadoColor(asistencia.estado)}>
                    {asistencia.estado}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">No hay asistencias registradas para esta fecha.</p>
      )}
    </div>
  )
}

export default MainAllAsistencias
