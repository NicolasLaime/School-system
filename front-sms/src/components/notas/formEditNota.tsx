import React, { useState, useEffect } from 'react'
import { NotaData } from '../../../types/nota.type'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateNotaMutation } from '@/redux/services/notasApi'
import { useGetAsignaturasQuery } from '@/redux/services/asignatura.Api'
import { useRouter } from "next/navigation"
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formNotaSchema = z.object({
  bimestre: z.string().min(1, { message: "El bimestre es requerido" }),
  cicloLectivo: z.string().min(4, { message: "El ciclo lectivo es requerido" }),
  tipoNota: z.string().min(1, { message: "El tipo de nota es requerido" }),
  valor: z.string().min(1, { message: "El valor es requerido" }),
  docenteId: z.string().min(1, { message: "El docente es requerido" }),
})

interface Props {
  dataNota: NotaData | undefined
}

const FormEditNota = ({ dataNota }: Props) => {
  const router = useRouter()
  const [updateNotaApi, { isLoading }] = useUpdateNotaMutation()
  const { data: asignaturasData, isLoading: isLoadingAsignaturas } = useGetAsignaturasQuery()
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")

  const form = useForm<z.infer<typeof formNotaSchema>>({
    resolver: zodResolver(formNotaSchema),
    defaultValues: {
      bimestre: dataNota?.bimestre || "",
      cicloLectivo: dataNota?.cicloLectivo || "",
      tipoNota: dataNota?.tipoNota || "",
      valor: dataNota?.valor?.toString() || "",
      docenteId: dataNota?.docenteId?.toString() || "",
    },
  })

  useEffect(() => {
    if (dataNota) {
      form.reset({
        bimestre: dataNota.bimestre || "",
        cicloLectivo: dataNota.cicloLectivo || "",
        tipoNota: dataNota.tipoNota || "",
        valor: dataNota.valor?.toString() || "",
        docenteId: dataNota.docenteId?.toString() || "",
      })
    }
  }, [dataNota, form])

  const handlerEdit = async (values: z.infer<typeof formNotaSchema>) => {
    if (!dataNota?.id) {
      setError("Nota no encontrada")
      return
    }

    setError("")
    setMensaje("")

    try {
      const response = await updateNotaApi({
        id: dataNota.id,
        data: {
          bimestre: values.bimestre,
          cicloLectivo: values.cicloLectivo,
          tipoNota: values.tipoNota,
          valor: Number(values.valor),
          docenteId: Number(values.docenteId),
        },
      }).unwrap()

      if (response) {
        setMensaje("Nota actualizada correctamente")
        router.push("/dashboard/notas")
      } else {
        setError("Error al actualizar la nota")
      }
    } catch (error: unknown) {
      console.error("Error al actualizar nota:", error)

      let errorMessage = "Error inesperado al actualizar la nota."

      if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error.data as { error?: string; message?: string }
        if (errorData?.error && typeof errorData.error === 'string') {
          errorMessage = errorData.error
        } else if (errorData?.message && typeof errorData.message === 'string') {
          errorMessage = errorData.message
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as { message: string }
        if (typeof errorObj.message === 'string') {
          errorMessage = errorObj.message
        }
      }

      setError(errorMessage)
    }
  }

  if (!dataNota) {
    return <div>Cargando datos de la nota...</div>
  }

  if (isLoadingAsignaturas) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="animate-spin h-48 w-48 mx-auto" />
      </section>
    )
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlerEdit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="bimestre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bimestre</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un bimestre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PRIMERO">Primero</SelectItem>
                      <SelectItem value="SEGUNDO">Segundo</SelectItem>
                      <SelectItem value="TERCERO">Tercero</SelectItem>
                      <SelectItem value="CUARTO">Cuarto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Bimestre de la nota.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cicloLectivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciclo Lectivo</FormLabel>
                  <FormControl>
                    <Input placeholder="2024-2025" {...field} />
                  </FormControl>
                  <FormDescription>Ciclo lectivo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipoNota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Nota</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EXAMEN">Examen</SelectItem>
                      <SelectItem value="TRABAJO_PRACTICO">Trabajo Practico</SelectItem>
                      <SelectItem value="TAREA">Tarea</SelectItem>
                      <SelectItem value="PARTICIPACION">Participacion</SelectItem>
                      <SelectItem value="PROYECTO">Proyecto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Tipo de evaluacion.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="10" step="0.1" placeholder="0-10" {...field} />
                  </FormControl>
                  <FormDescription>Valor de la nota (0-10).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="docenteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Docente ID</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ID del docente" {...field} />
                  </FormControl>
                  <FormDescription>ID del docente que asigna la nota.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              {isLoading ? "Guardando..." : "Actualizar Nota"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/dashboard/notas")}
            >
              Cancelar
            </Button>
          </div>
        </form>

        <div className="mt-5 space-y-3">
          {error && typeof error === 'string' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {mensaje && typeof mensaje === 'string' && (
            <Alert variant="default">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {mensaje}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Form>
    </div>
  )
}

export default FormEditNota
