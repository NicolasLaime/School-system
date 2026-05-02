package backend_escuela.seccion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeccionRequestDto {

    @NotBlank(message = "El nombre de la sección es obligatorio")
    @Size(max = 10, message = "El nombre no puede superar 10 caracteres")
    private String nombre;

    @NotNull(message = "El grado es obligatorio")
    private Long gradoId;

    @NotBlank(message = "El ciclo lectivo es obligatorio")
    @Pattern(regexp = "\\d{4}-\\d{4}", message = "El ciclo lectivo debe tener formato YYYY-YYYY")
    private String cicloLectivo;





}

