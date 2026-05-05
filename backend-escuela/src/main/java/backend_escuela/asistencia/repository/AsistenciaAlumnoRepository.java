package backend_escuela.asistencia.repository;

import backend_escuela.asistencia.entity.AsistenciaAlumno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AsistenciaAlumnoRepository extends JpaRepository<AsistenciaAlumno,Long> {


    List<AsistenciaAlumno> findBySeccionIdAndFecha(Long seccionId, LocalDate fecha);




}
