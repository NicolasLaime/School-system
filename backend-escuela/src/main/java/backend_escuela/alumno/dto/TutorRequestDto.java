package backend_escuela.alumno.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TutorRequestDto {

    @NotBlank
    private String nombre;
    @NotBlank private String apellido;
    private String telefono;
    private String email;
    @NotBlank private String parentesco;
    @NotNull
    private List<Long> alumnoIds;









}
