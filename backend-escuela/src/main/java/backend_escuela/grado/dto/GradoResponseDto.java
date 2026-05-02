package backend_escuela.grado.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradoResponseDto {


    private Long   id;
    private String nombre;

    // Datos del ciclo educativo al que pertenece
    private Long   cicloEducativoId;
    private String cicloEducativoNombre;




}
