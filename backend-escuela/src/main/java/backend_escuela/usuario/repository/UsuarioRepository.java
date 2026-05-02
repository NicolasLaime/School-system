package backend_escuela.usuario.repository;

import backend_escuela.usuario.entity.RolNombre;
import backend_escuela.usuario.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar por email (para login más adelante)
    Optional<Usuario> findByEmail(String email);

    // Todos los usuarios de un rol específico
    List<Usuario> findByRol(RolNombre rol);

    // Solo los activos
    List<Usuario> findByActivoTrue();

    // Verificar si ya existe un email (para no duplicar)
    boolean existsByEmail(String email);



}
