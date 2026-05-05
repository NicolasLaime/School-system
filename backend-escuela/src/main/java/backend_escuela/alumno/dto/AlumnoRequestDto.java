package backend_escuela.alumno.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlumnoRequestDto {

    @NotBlank(message = "El código del alumno es obligatorio")
    @Size(max = 20, message = "El código no puede superar 20 caracteres")
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no puede superar 100 caracteres")
    private String apellido;

    @NotBlank(message = "El telefono es obligatorio")
    @Size(max = 20, message = "El teléfono no puede superar 20 caracteres")
    private String telefono;

    @NotBlank(message = "La direccion es obligatoria")
    @Size(max = 255, message = "La dirección no puede superar 255 caracteres")
    private String direccion;

    @NotBlank(message = "El documento es obligatorio")
    @Size(max = 50, message = "El documento no puede superar 50 caracteres")
    private String documento;

    @NotNull(message = "La sección es obligatoria")
    private Long seccionId;




}
