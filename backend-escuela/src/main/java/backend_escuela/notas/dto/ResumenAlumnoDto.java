package backend_escuela.notas.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumenAlumnoDto {

    private Long   alumnoId;
    private String alumnoCodigo;
    private String alumnoNombre;
    private String alumnoApellido;
    private String seccionNombre;
    private String gradoNombre;
    private String cicloLectivo;


    // Una fila por asignatura
    private List<FilaAsignaturaDto> asignaturas;

    // Promedio general del alumno en el ciclo
    private BigDecimal promedioGeneral;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FilaAsignaturaDto {

        private Long   asignaturaId;
        private String asignaturaNombre;
        private Long   docenteId;
        private String docenteNombre;

        // Promedio ponderado de cada bimestre: { PRIMERO: 85.5, SEGUNDO: 90.0, ... }
        private Map<String, BigDecimal> promediosPorBimestre;

        // Promedio final = promedio de los 4 bimestres
        private BigDecimal promedioFinal;
    }











}
