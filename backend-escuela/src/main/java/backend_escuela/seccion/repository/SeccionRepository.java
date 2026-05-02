package backend_escuela.seccion.repository;

import backend_escuela.seccion.entity.Seccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeccionRepository extends JpaRepository<Seccion,Long> {


    // Todas las secciones de un grado
    List<Seccion> findByGradoId(Long gradoId);

    // Todas las secciones de un ciclo lectivo
    List<Seccion> findByCicloLectivo(String cicloLectivo);

    // Secciones de un grado en un ciclo lectivo específico
    List<Seccion> findByGradoIdAndCicloLectivo(Long gradoId, String cicloLectivo);

    boolean existsByNombreAndGradoIdAndCicloLectivo(
            String nombre, Long gradoId, String cicloLectivo
    );






}
