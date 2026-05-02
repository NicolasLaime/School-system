package backend_escuela.asignatura.repository;

import backend_escuela.asignatura.entity.DocenteAsignaturaSeccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocenteAsignaturaRepository extends JpaRepository<DocenteAsignaturaSeccion,Long> {


    // Todas las asignaciones de un docente
    List<DocenteAsignaturaSeccion> findByDocenteId(Long docenteId);

    // Todas las asignaciones de una sección
    List<DocenteAsignaturaSeccion> findBySeccionId(Long seccionId);

    // Verificar si un docente ya tiene asignada esa asignatura en esa sección
    boolean existsByDocenteIdAndAsignaturaIdAndSeccionId(
            Long docenteId, Long asignaturaId, Long seccionId
    );

    // Eliminar una asignación específica
    void deleteByDocenteIdAndAsignaturaIdAndSeccionId(
            Long docenteId, Long asignaturaId, Long seccionId
    );

    // Todas las asignaturas que dicta un docente (con JOIN para traer datos)
    @Query("""
        SELECT das FROM DocenteAsignaturaSeccion das
        JOIN FETCH das.asignatura
        JOIN FETCH das.seccion
        WHERE das.docente.id = :docenteId
    """)
    List<DocenteAsignaturaSeccion> findAsignacionesConDetalleByDocente(
            @Param("docenteId") Long docenteId
    );











}
