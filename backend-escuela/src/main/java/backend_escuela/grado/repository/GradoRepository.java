package backend_escuela.grado.repository;

import backend_escuela.grado.entity.Grado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradoRepository extends JpaRepository<Grado, Long> {

    // Todos los grados de un ciclo (ej: todos los grados de Primaria)
    List<Grado> findByCicloEducativoId(Long cicloId);

    boolean existsByNombreAndCicloEducativoId(String nombre, Long cicloId);
}