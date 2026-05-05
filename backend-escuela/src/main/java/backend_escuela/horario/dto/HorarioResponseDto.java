package backend_escuela.horario.dto;

import backend_escuela.horario.entity.DiaSemana;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HorarioResponseDto {


    private Long id;
    private DiaSemana diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private Long asignaturaId;
    private String asignaturaNombre;
    private Long seccionId;
    private String seccionNombre;




}
