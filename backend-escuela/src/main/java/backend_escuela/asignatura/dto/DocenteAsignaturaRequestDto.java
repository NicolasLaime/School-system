package backend_escuela.asignatura.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocenteAsignaturaRequestDto {


    @NotNull(message = "El docente es obligatorio")
    private Long docenteId;

    @NotNull(message = "La asignatura es obligatoria")
    private Long asignaturaId;

    @NotNull(message = "La sección es obligatoria")
    private Long seccionId;



}
