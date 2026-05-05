package backend_escuela.asistencia.dto;

import backend_escuela.asistencia.entity.EstadoAsistencia;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsistenciaAlumnoResponseDto {

    private Long id;
    private LocalDate fecha;
    private EstadoAsistencia estado;
    private Long alumnoId;
    private String alumnoNombre;
    private String alumnoApellido;
    private Long seccionId;
    private String seccionNombre;




}
