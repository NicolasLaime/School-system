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
    private String telefono;
    private String direccion;
    private String documento;
    private Boolean activo;

    private Long   seccionId;
    private String seccionNombre;

    private Long   gradoId;
    private String gradoNombre;



    private Long   cicloEducativoId;
    private String cicloEducativoNombre;

    private String cicloLectivo;










}
