"use client"
import React, { useState, useEffect } from 'react'
import { User } from '../../../types/Usuario.type'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useUpdateClaseMutation } from '@/redux/services/clasesApi'
import { useGetUserByIdQuery } from '@/redux/services/authApi'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Alert, AlertDescription } from '../ui/alert'
import { AlertCircle, CheckCircle2, Search, Edit, X, Info } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface InformacionDocenteProps {
  docente: User
  anioLectivo: number
  claseId: string
  docenteId: string
  onDocenteUpdated?: () => void
}

const InformacionDocente = ({ docenteId, docente, anioLectivo, claseId, onDocenteUpdated }: InformacionDocenteProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [docenteIdBusqueda, setDocenteIdBusqueda] = useState("")
  const [nuevoDocente, setNuevoDocente] = useState<User | null>(null)
  const [mensaje, setMensaje] = useState({
    error: "",
    success: "",
    docente: "",
  })

  const [updateClase, { isLoading }] = useUpdateClaseMutation()
  const { data: docenteData, isLoading: isLoadingDocente, isError: isErrorDocente, refetch: refetchDocente } = useGetUserByIdQuery(docenteIdBusqueda, {
    skip: !docenteIdBusqueda,
  })

  // Efecto para manejar la búsqueda del nuevo docente
  useEffect(() => {
    if (docenteData) {
      if (docenteData.data.rol === 'DOCENTE') {
        setNuevoDocente(docenteData.data)
        setMensaje(prev => ({
          ...prev,
          docente: `Docente encontrado: ${docenteData.data.nombre} (${docenteData.data.email})`,
          error: ""
        }))
      } else {
        setMensaje(prev => ({
          ...prev,
          docente: "",
          error: "El usuario encontrado no es un docente"
        }))
        setNuevoDocente(null)
      }
    }
  }, [docenteData])

  // Efecto para manejar errores de búsqueda
  useEffect(() => {
    if (isErrorDocente && docenteIdBusqueda) {
      setMensaje(prev => ({
        ...prev,
        docente: "",
        error: "Docente no encontrado. Verifica el ID."
      }))
      setNuevoDocente(null)
    }
  }, [isErrorDocente, docenteIdBusqueda])

  const handleBuscarDocente = () => {
    if (docenteIdBusqueda.trim()) {
      setMensaje(prev => ({ ...prev, docente: "Buscando docente...", error: "" }))
      refetchDocente()
    }
  }

  const handleActualizarDocente = async () => {
    if (!nuevoDocente) return

    try {
      const response = await updateClase({
        id: claseId,
        data: {
          docenteId: nuevoDocente.id,
          anioLectivo // Mantener el mismo año lectivo
        }
      }).unwrap()

      if (response) {
        toast.success("Docente actualizado correctamente")
        setMensaje({
          error: "",
          success: "Docente actualizado correctamente",
          docente: ""
        })
        setIsEditing(false)
        setDocenteIdBusqueda("")
        setNuevoDocente(null)
        
        // Notificar al componente padre para actualizar los datos
        if (onDocenteUpdated) {
          onDocenteUpdated()
        }
      }
    } catch (error) {
      console.error("Error al actualizar docente:", error)
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al actualizar el docente."
      setMensaje({
        error: errorMessage,
        success: "",
        docente: ""
      })
      toast.error("Error al actualizar docente")
    }
  }

  const cancelarEdicion = () => {
    setIsEditing(false)
    setDocenteIdBusqueda("")
    setNuevoDocente(null)
    setMensaje({
      error: "",
      success: "",
      docente: ""
    })
  }

  return (
    <div className="space-y-4">
      {/* Card de información actual del docente */}
      <Card className="w-150">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Información del Docente Actual</CardTitle>
          <div className='flex gap-2'>

          {!isEditing && (
            <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 cursor-pointer"
            >
              <Edit className="h-4 w-4" />
              Cambiar Docente
            </Button>
          )}
          <Link href={`/dashboard/usuarios/${docenteId}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Info className="h-4 w-4" />
             Ver información del docente
            </Button>
          </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Año Lectivo:</strong> {anioLectivo}</p>
            <p><strong>Nombre:</strong> {docente.nombre}</p>
            <p><strong>Email:</strong> {docente.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Card de búsqueda de nuevo docente (solo visible en modo edición) */}
      {isEditing && (
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Nuevo Docente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ingresa el ID del nuevo docente"
                value={docenteIdBusqueda}
                onChange={(e) => setDocenteIdBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleBuscarDocente())}
                className="flex-1"
              />
              <Button
                onClick={handleBuscarDocente}
                disabled={isLoadingDocente || !docenteIdBusqueda.trim()}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {isLoadingDocente ? "Buscando..." : "Buscar"}
              </Button>
            </div>

            {mensaje.docente && (
              <Alert variant={isErrorDocente ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{mensaje.docente}</AlertDescription>
              </Alert>
            )}

            {mensaje.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{mensaje.error}</AlertDescription>
              </Alert>
            )}

            {nuevoDocente && (
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-green-800">Nuevo Docente Encontrado:</h4>
                  <div className="space-y-1 mt-2">
                    <p><strong>Nombre:</strong> {nuevoDocente.nombre}</p>
                    <p><strong>Email:</strong> {nuevoDocente.email}</p>
                    <p><strong>Teléfono:</strong> {nuevoDocente.telefono || "No registrado"}</p>
                    <p><strong>Rol:</strong> {nuevoDocente.rol}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleActualizarDocente}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isLoading ? "Actualizando..." : "Confirmar Cambio"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={cancelarEdicion}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {mensaje.success && (
              <Alert className="">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  {mensaje.success}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default InformacionDocente