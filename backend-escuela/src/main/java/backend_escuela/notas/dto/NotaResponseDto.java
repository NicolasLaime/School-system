package backend_escuela.notas.dto;

import backend_escuela.shared.enums.Bimestre;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotaResponseDto {

    private Long          id;
    private BigDecimal valor;
    private String        tipoNota;
    private Bimestre bimestre;
    private String        cicloLectivo;
    private LocalDateTime fechaRegistro;

    // Alumno
    private Long   alumnoId;
    private String alumnoCodigo;
    private String alumnoNombre;
    private String alumnoApellido;

    // Asignatura
    private Long   asignaturaId;
    private String asignaturaNombre;

    // Sección
    private Long   seccionId;
    private String seccionNombre;

    // Docente
    private Long   docenteId;
    private String docenteNombre;


}
