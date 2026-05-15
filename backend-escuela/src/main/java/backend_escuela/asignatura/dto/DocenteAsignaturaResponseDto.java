package backend_escuela.asignatura.dto;


import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocenteAsignaturaResponseDto {


    private Long   id;

    // Datos del docente
    private Long   docenteId;
    private String docenteNombre;
    private String docenteApellido;

    // Datos de la asignatura
    private Long   asignaturaId;
    private String asignaturaNombre;

    // Datos de la sección
    private Long   seccionId;
    private String seccionNombre;
    private String gradoNombre;

    private List<DocenteAsignaturaResponseDto> docentes;


}
