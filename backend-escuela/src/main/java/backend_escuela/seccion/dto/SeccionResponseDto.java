package backend_escuela.seccion.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeccionResponseDto {

    private Long   id;
    private String nombre;
    private String cicloLectivo;

    // Datos del grado
    private Long   gradoId;
    private String gradoNombre;

    // Datos del ciclo educativo
    private Long   cicloEducativoId;
    private String cicloEducativoNombre;


}
