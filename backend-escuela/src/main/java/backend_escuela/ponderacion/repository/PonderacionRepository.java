package backend_escuela.ponderacion.repository;

import backend_escuela.ponderacion.entity.Ponderacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;


public interface PonderacionRepository extends JpaRepository<Ponderacion,Long> {




    // Todas las ponderaciones de un ciclo educativo
    List<Ponderacion> findByCicloEducativoId(Long cicloEducativoId);

    // Verificar si ya existe un tipo de nota con ese nombre en el ciclo
    boolean existsByNombreAndCicloEducativoId(String nombre, Long cicloEducativoId);

    // Sumar todos los porcentajes de un ciclo educativo
    // Lo usamos para validar que no superen 100%
    @Query("""
        SELECT COALESCE(SUM(p.porcentaje), 0)
        FROM Ponderacion p
        WHERE p.cicloEducativo.id = :cicloId
    """)
    BigDecimal sumPorcentajeByCicloId(@Param("cicloId") Long cicloId);

    // Igual que el anterior pero excluyendo un ID (para el caso de actualizar)
    @Query("""
        SELECT COALESCE(SUM(p.porcentaje), 0)
        FROM Ponderacion p
        WHERE p.cicloEducativo.id = :cicloId
          AND p.id <> :excludeId
    """)
    BigDecimal sumPorcentajeByCicloIdExcluyendo(
            @Param("cicloId")    Long cicloId,
            @Param("excludeId")  Long excludeId
    );





}
