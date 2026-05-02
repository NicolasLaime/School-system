package backend_escuela.alumno.repository;

import backend_escuela.alumno.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface AlumnoRepository extends JpaRepository<Alumno,Long> {

    Optional<Alumno> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    // Todos los alumnos de una sección
    List<Alumno> findBySeccionId(Long seccionId);

    // Todos los alumnos activos de una sección
    List<Alumno> findBySeccionIdAndActivoTrue(Long seccionId);

    // Todos los alumnos de un grado en un ciclo lectivo
    @Query("""
        SELECT a FROM Alumno a
        JOIN a.seccion s
        JOIN s.grado g
        WHERE g.id = :gradoId
          AND s.cicloLectivo = :cicloLectivo
          AND a.activo = true
    """)
    List<Alumno> findByGradoIdAndCicloLectivo(
            @Param("gradoId")      Long gradoId,
            @Param("cicloLectivo") String cicloLectivo
    );


}
