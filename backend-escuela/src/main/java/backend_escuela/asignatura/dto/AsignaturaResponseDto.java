package backend_escuela.asignatura.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsignaturaResponseDto {


    private Long   id;
    private String nombre;
    private String codigo;


    private Long   gradoId;
    private String gradoNombre;


    private Long   cicloEducativoId;
    private String cicloEducativoNombre;






}
