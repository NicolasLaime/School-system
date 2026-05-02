package backend_escuela.notas.dto;

import backend_escuela.shared.enums.Bimestre;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotaRequestDto {

    @NotNull(message = "El alumno es obligatorio")
    private Long alumnoId;

    @NotNull(message = "La asignatura es obligatoria")
    private Long asignaturaId;

    @NotNull(message = "La sección es obligatoria")
    private Long seccionId;

    @NotNull(message = "El bimestre es obligatorio")
    private Bimestre bimestre;

    @NotBlank(message = "El ciclo lectivo es obligatorio")
    @Pattern(regexp = "\\d{4}-\\d{4}", message = "El ciclo lectivo debe tener formato YYYY-YYYY")
    private String cicloLectivo;

    @NotBlank(message = "El tipo de nota es obligatorio")
    private String tipoNota; // "Tareas", "Examen", etc.

    @NotNull(message = "El valor es obligatorio")
    @DecimalMin(value = "0.00", message = "La nota no puede ser negativa")
    @DecimalMax(value = "100.00", message = "La nota no puede superar 100")
    private BigDecimal valor;

    @NotNull(message = "El docente es obligatorio")
    private Long docenteId;






}
