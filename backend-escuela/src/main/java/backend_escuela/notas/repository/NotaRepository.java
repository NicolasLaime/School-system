package backend_escuela.notas.repository;

import backend_escuela.notas.entity.Nota;
import backend_escuela.shared.enums.Bimestre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NotaRepository extends JpaRepository<Nota,Long> {

    // Una nota específica (para detectar duplicados)
    Optional<Nota> findByAlumnoIdAndAsignaturaIdAndBimestreAndCicloLectivoAndTipoNota(
            Long alumnoId, Long asignaturaId,
            Bimestre bimestre, String cicloLectivo, String tipoNota
    );

    // Todas las notas de un alumno en una asignatura y ciclo
    List<Nota> findByAlumnoIdAndAsignaturaIdAndCicloLectivo(
            Long alumnoId, Long asignaturaId, String cicloLectivo
    );

    // Todas las notas de un alumno en un bimestre
    List<Nota> findByAlumnoIdAndBimestreAndCicloLectivo(
            Long alumnoId, Bimestre bimestre, String cicloLectivo
    );

    // Todas las notas de una sección en una asignatura y bimestre
    @Query("""
        SELECT n FROM Nota n
        JOIN FETCH n.alumno
        WHERE n.seccion.id    = :seccionId
          AND n.asignatura.id = :asignaturaId
          AND n.bimestre      = :bimestre
          AND n.cicloLectivo  = :ciclo
    """)
    List<Nota> findBySeccionAsignaturaBimestre(
            @Param("seccionId")    Long seccionId,
            @Param("asignaturaId") Long asignaturaId,
            @Param("bimestre")     Bimestre bimestre,
            @Param("ciclo")        String ciclo
    );

    // Resumen completo de un alumno: todas las asignaturas, todos los bimestres
    @Query("""
        SELECT n FROM Nota n
        JOIN FETCH n.asignatura
        WHERE n.alumno.id    = :alumnoId
          AND n.cicloLectivo = :ciclo
        ORDER BY n.asignatura.nombre, n.bimestre
    """)
    List<Nota> findResumenAlumno(
            @Param("alumnoId") Long alumnoId,
            @Param("ciclo")    String ciclo
    );








}
