package backend_escuela.auth.controller;

import backend_escuela.auth.dto.LoginRequestDto;
import backend_escuela.shared.response.ApiResponse;
import backend_escuela.usuario.dto.UsuarioResponseDTO;
import backend_escuela.usuario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UsuarioResponseDTO>> login(
            @Valid @RequestBody LoginRequestDto request) {

        UsuarioResponseDTO logueado = usuarioService.login(request);

        return ResponseEntity.ok(
                ApiResponse.ok("Login exitoso", logueado)
        );
    }




}
