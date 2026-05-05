package backend_escuela.auth.controller;

import backend_escuela.auth.dto.LoginRequestDTO;
import backend_escuela.auth.dto.LoginResponseDTO;
import backend_escuela.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody @Valid LoginRequestDTO loginRequestDTO){
        return authService.login(loginRequestDTO);
    }
}
