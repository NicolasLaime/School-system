package backend_escuela.usuario.dto;

import backend_escuela.usuario.entity.RolNombre;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponseDTO {

    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private RolNombre rol;
    private Boolean activo;
    private LocalDateTime createdAt;
}