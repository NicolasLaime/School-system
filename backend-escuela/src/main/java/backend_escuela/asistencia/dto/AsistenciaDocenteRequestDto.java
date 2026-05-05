package backend_escuela.asistencia.dto;

import backend_escuela.asistencia.entity.EstadoAsistencia;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsistenciaDocenteRequestDto {

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotNull(message = "El estado es obligatorio")
    private EstadoAsistencia estado;

    @NotNull(message = "El docente es obligatorio")
    private Long docenteId;






}
