package backend_escuela.asistencia.repository;

import backend_escuela.asistencia.entity.AsistenciaAlumno;
import backend_escuela.asistencia.entity.AsistenciaDocente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AsistenciaDocenteRepository extends JpaRepository<AsistenciaDocente,Long> {

    List<AsistenciaDocente> findByFecha(LocalDate fecha);




}
