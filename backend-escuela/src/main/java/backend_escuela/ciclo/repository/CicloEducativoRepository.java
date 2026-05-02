package backend_escuela.ciclo.repository;

import backend_escuela.ciclo.entity.CicloEducativo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CicloEducativoRepository extends JpaRepository<CicloEducativo,Long> {


    Optional<CicloEducativo> findByNombre(String nombre);

    boolean existsByNombre(String nombre);





}
