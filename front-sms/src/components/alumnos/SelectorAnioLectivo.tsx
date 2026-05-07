// components/alumnos/SelectorAnioLectivo.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectorAnioLectivoProps {
  anios: number[];
  anioSeleccionado: number;
  onAnioChange: (anio: number) => void;
  className?: string;
}

export const SelectorAnioLectivo = ({
  anios,
  anioSeleccionado,
  onAnioChange,
  className = ""
}: SelectorAnioLectivoProps) => {
  return (
    <Select
      value={anioSeleccionado.toString()}
      onValueChange={(value) => onAnioChange(parseInt(value))}
    >
      <SelectTrigger className={`w-32 ${className}`}>
        <SelectValue placeholder="Seleccionar año" />
      </SelectTrigger>
      <SelectContent>
        {anios.map(anio => (
          <SelectItem key={anio} value={anio.toString()}>
            {anio}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};