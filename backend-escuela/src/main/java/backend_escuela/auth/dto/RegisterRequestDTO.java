package backend_escuela.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequestDTO {

    @NotBlank
    @NotNull(message = "email is required")
    private String email;

    @NotBlank
    @NotNull(message = "password is required")
    private String password;

    @NotBlank
    @NotNull(message = "role is required")
    private String role;
}
