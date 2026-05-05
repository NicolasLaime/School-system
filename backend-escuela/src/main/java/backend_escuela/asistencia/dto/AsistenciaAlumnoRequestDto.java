package backend_escuela.asistencia.dto;

import backend_escuela.asistencia.entity.EstadoAsistencia;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AsistenciaAlumnoRequestDto {

    @NotNull(message = "La fecha es obligatoria") private LocalDate fecha;
    @NotNull(message = "El estado es obligatorio") private EstadoAsistencia estado;
    @NotNull(message = "El alumno es obligatorio") private Long alumnoId;
    @NotNull(message = "La sección es obligatoria") private Long seccionId;



}
