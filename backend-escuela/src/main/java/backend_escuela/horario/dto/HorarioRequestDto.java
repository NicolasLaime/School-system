package backend_escuela.horario.dto;

import backend_escuela.horario.entity.DiaSemana;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.time.LocalTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class HorarioRequestDto {

    @NotNull(message = "El día es obligatorio") private DiaSemana diaSemana;
    @NotNull(message = "Hora de inicio obligatoria") private LocalTime horaInicio;
    @NotNull(message = "Hora de fin obligatoria") private LocalTime horaFin;
    @NotNull(message = "La asignatura es obligatoria") private Long asignaturaId;
    @NotNull(message = "La sección es obligatoria") private Long seccionId;



}
