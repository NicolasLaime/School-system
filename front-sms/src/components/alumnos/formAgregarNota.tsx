"use client";
import React, { useState } from "react";
import { useCreateOrUpdateNotaMutation } from "@/redux/services/notasApi";
import { useGetAsignaturasQuery } from "@/redux/services/asignatura.Api";
import { useSelector } from "react-redux";
import { selectUserLogin } from "@/redux/features/userSlice";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface FormAgregarNotaProps {
  alumnoId: string;
  onNotaAgregada: () => void;
  onCancelar: () => void;
}

const FormAgregarNota = ({ alumnoId, onNotaAgregada, onCancelar }: FormAgregarNotaProps) => {
  const [createOrUpdateNota] = useCreateOrUpdateNotaMutation();
  const { data: asignaturasData } = useGetAsignaturasQuery();
  const userLogin = useSelector(selectUserLogin);

  const [materiaId, setMateriaId] = useState("");
  const [bimestre, setBimestre] = useState<"1" | "2" | "3" | "4">("1");
  const [nota, setNota] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [notaExistente, _setNotaExistente] = useState<{
  //   id: string;
  //   notaActual: number;
  // } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userLogin?.id) {
      setError("Usuario no autenticado");
      return;
    }

    if (!materiaId) {
      setError("Debes seleccionar una materia");
      return;
    }

    const notaNum = parseFloat(nota);
    if (isNaN(notaNum)) {
      setError("Debes ingresar una nota válida");
      return;
    }

    if (notaNum < 1 || notaNum > 10) {
      setError("La nota debe estar entre 1 y 10");
      return;
    }

    setIsLoading(true);
    setMensaje("");
    setError("");

    try {
      const result = await createOrUpdateNota({
        estudianteId: alumnoId,
        materiaId,
        bimestre: parseInt(bimestre),
        valor: notaNum,
        docenteId: userLogin.id
      }).unwrap();

      if (result.action === "updated") {
        toast.success("Nota actualizada correctamente");
      } else {
        toast.success("Nota creada correctamente");
      }

      // Resetear formulario
      setMateriaId("");
      setBimestre("1");
      setNota("");

      // Cerrar el formulario después de 1 segundo
      setTimeout(() => {
        onNotaAgregada();
      }, 1000);

    } catch (error) {
      console.error("Error al procesar nota:", error);
      let errorMessage = "Error al procesar la nota";

      // Verificar si es un error de RTK Query
      if (typeof error === 'object' && error !== null && 'data' in error) {
        const rtkError = error as { data?: { message?: string } };
        if (rtkError.data?.message) {
          errorMessage = rtkError.data.message;
        }
      }
      // Verificar si es un Error estándar
      else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm ">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Agregar/Editar Nota</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancelar}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="materia">Materia *</Label>
            <Select
              value={materiaId}
              onValueChange={setMateriaId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una materia" />
              </SelectTrigger>
              <SelectContent>
                {asignaturasData?.data?.map((asignatura) => (
                  <SelectItem key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bimestre">Bimestre *</Label>
            <Select
              value={bimestre}
              onValueChange={(v) => setBimestre(v as "1" | "2" | "3" | "4")}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1° Bimestre</SelectItem>
                <SelectItem value="2">2° Bimestre</SelectItem>
                <SelectItem value="3">3° Bimestre</SelectItem>
                <SelectItem value="4">4° Bimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nota">Nota (1-10) *</Label>
          <Input
            id="nota"
            type="number"
            min="1"
            max="10"
            step="0.1"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej: 8.5"
            className="w-full"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          {/* <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : notaExistente ? (
              "Actualizar Nota"
            ) : (
              "Agregar Nota"
            )}
          </Button> */}
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Guardar Nota"  // Texto constante
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancelar}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>

      {/* Alertas de estado */}
      <div className="mt-5 space-y-3">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mensaje && (
          <Alert className="border-green-200 ">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {mensaje}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default FormAgregarNota;