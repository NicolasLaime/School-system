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
public class AsistenciaDocenteResponseDto {

    private Long id;
    private LocalDate fecha;
    private EstadoAsistencia estado;

    private Long docenteId;
    private String docenteNombre;
    private String docenteApellido;



}
