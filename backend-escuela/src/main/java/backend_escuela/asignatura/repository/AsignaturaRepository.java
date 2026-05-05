package backend_escuela.asignatura.repository;

import backend_escuela.asignatura.entity.Asignatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;


public interface AsignaturaRepository extends JpaRepository<Asignatura,Long> {

    Optional<Asignatura> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    // Todas las asignaturas de un grado
    List<Asignatura> findByGradoId(Long gradoId);

    @Query("SELECT DISTINCT a FROM Asignatura a INNER JOIN DocenteAsignaturaSeccion das ON a.id = das.asignatura.id WHERE das.docente IS NOT NULL")
    List<Asignatura> findConDocenteAsociado();





}
