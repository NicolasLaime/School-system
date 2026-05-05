package backend_escuela.auth.service;

import backend_escuela.auth.dto.LoginRequestDTO;
import backend_escuela.auth.dto.LoginResponseDTO;
import backend_escuela.usuario.entity.Usuario;
import backend_escuela.usuario.repository.UsuarioRepository;
import backend_escuela.usuario.service.UserDetailsServiceImpl;
import backend_escuela.usuario.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final JwtUtil jwtUtil;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    PasswordEncoder passwordEncoder;

    public AuthService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequestDTO.getEmail());

        if(!passwordEncoder.matches(loginRequestDTO.getPassword(), userDetails.getPassword())){
            throw new RuntimeException("Contraseña incorrecta");
        }

        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        String token = jwtUtil.generateToken(userDetails.getUsername(), role);

        return LoginResponseDTO.builder()
                .token(token)
                .build();
    }
}
