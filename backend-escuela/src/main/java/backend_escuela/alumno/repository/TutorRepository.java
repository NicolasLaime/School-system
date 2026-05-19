package backend_escuela.alumno.repository;

import backend_escuela.alumno.entity.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TutorRepository extends JpaRepository<Tutor,Long> {

    List<Tutor> findByAlumnosId(Long alumnoId);





}
