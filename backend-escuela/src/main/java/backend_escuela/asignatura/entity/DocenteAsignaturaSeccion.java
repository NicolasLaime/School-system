package backend_escuela.asignatura.entity;


import backend_escuela.seccion.entity.Seccion;
import backend_escuela.usuario.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "docente_asignatura_seccion",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"docente_id", "asignatura_id", "seccion_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocenteAsignaturaSeccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    private Usuario docente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asignatura_id", nullable = false)
    private Asignatura asignatura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seccion_id", nullable = false)
    private Seccion seccion;





}
