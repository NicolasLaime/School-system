package backend_escuela.asignatura.entity;


import backend_escuela.grado.entity.Grado;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "asignaturas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asignatura {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre; // "Matemática", "Lengua"

    @Column(nullable = false, unique = true, length = 20)
    private String codigo; // "MAT-001"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grado_id", nullable = false)
    private Grado grado;




}
