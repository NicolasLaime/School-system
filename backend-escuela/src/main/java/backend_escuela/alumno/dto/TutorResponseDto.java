package backend_escuela.alumno.dto;


import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutorResponseDto {


    private Long id;
    private String nombre;
    private String apellido;
    private String telefono;
    private String email;
    private String parentesco;
    private List<AlumnoInfoDto> alumnos;

    @Getter
    @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AlumnoInfoDto {
        private String codigoAlumno;
        private String nombreAlumno;
    }


}


