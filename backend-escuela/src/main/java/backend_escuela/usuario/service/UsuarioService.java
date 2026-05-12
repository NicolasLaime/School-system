package backend_escuela.usuario.service;

import backend_escuela.auth.dto.LoginRequestDTO;
import backend_escuela.shared.exception.ApiException;
import backend_escuela.usuario.dto.UsuarioRequestDTO;
import backend_escuela.usuario.dto.UsuarioResponseDTO;
import backend_escuela.usuario.entity.RolNombre;
import backend_escuela.usuario.entity.Usuario;
import backend_escuela.usuario.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // ─── Crear ───────────────────────────────────────────────────────────
    @Transactional
    public UsuarioResponseDTO crear(UsuarioRequestDTO request) {

        if (request.getRol() == RolNombre.DOCENTE) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
                throw ApiException.forbidden("Se requiere estar autenticado para crear un DOCENTE");
            }
            String currentUserEmail = authentication.getName();
            Usuario creador = usuarioRepository.findByEmail(currentUserEmail)
                    .orElseThrow(() -> ApiException.unauthorized("Usuario autenticado no encontrado"));
            
            if (creador.getRol() != RolNombre.DIRECTIVO) {
                throw ApiException.forbidden("Solo un DIRECTIVO puede crear DOCENTES");
            }
        }


        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw ApiException.conflict(
                    "Ya existe un usuario con el email: " + request.getEmail()
            );
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(request.getRol())
                .activo(true)
                .build();

        return toResponse(usuarioRepository.save(usuario));
    }

    // ─── Listar todos ────────────────────────────────────────────────────
    @Transactional
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Listar por rol ──────────────────────────────────────────────────
    @Transactional
    public List<UsuarioResponseDTO> listarPorRol(RolNombre rol) {
        return usuarioRepository.findByRol(rol)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Buscar por ID ───────────────────────────────────────────────────
    @Transactional
    public UsuarioResponseDTO buscarPorId(Long id) {
        return toResponse(obtenerOFallar(id));
    }

    // ─── Actualizar ──────────────────────────────────────────────────────
    @Transactional
    public UsuarioResponseDTO actualizar(Long id, UsuarioRequestDTO request) {

        Usuario usuario = obtenerOFallar(id);

        if (!usuario.getEmail().equals(request.getEmail())
                && usuarioRepository.existsByEmail(request.getEmail())) {
            throw ApiException.conflict(
                    "Ya existe un usuario con el email: " + request.getEmail()
            );
        }

        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setRol(request.getRol());

        return toResponse(usuarioRepository.save(usuario));
    }

    // ─── Desactivar (baja lógica) ─────────────────────────────────────────
    @Transactional
    public void desactivar(Long id) {
        Usuario usuario = obtenerOFallar(id);
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    // ─── Helpers privados ────────────────────────────────────────────────

    private Usuario obtenerOFallar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound(
                        "Usuario con id " + id + " no encontrado"
                ));
    }

    private UsuarioResponseDTO toResponse(Usuario u) {
        return UsuarioResponseDTO.builder()
                .id(u.getId())
                .nombre(u.getNombre())
                .apellido(u.getApellido())
                .email(u.getEmail())
                .rol(u.getRol())
                .activo(u.getActivo())
                .createdAt(u.getCreatedAt())
                .build();
    }














}
