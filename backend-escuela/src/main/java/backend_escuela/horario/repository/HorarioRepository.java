package backend_escuela.horario.repository;

import backend_escuela.horario.entity.Horario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario,Long> {

    List<Horario> findBySeccionId(Long seccionId);


}
