package backend_escuela.alumno.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlumnoResponseDto {


    private Long    id;
    private String  codigo;
    private String  nombre;
    private String  apellido;
    private Boolean activo;

    // Datos de la sección
    private Long   seccionId;
    private String seccionNombre;

    // Datos del grado
    private Long   gradoId;
    private String gradoNombre;

    // Datos del ciclo educativo
    private Long   cicloEducativoId;
    private String cicloEducativoNombre;

    // Ciclo lectivo ej: "2024-2025"
    private String cicloLectivo;










}
