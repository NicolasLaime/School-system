package backend_escuela.seccion.entity;


import backend_escuela.grado.entity.Grado;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "secciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Seccion {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String nombre; // "A", "B", "C"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grado_id", nullable = false)
    private Grado grado;

    // Año lectivo: "2024-2025"
    @Column(name = "ciclo_lectivo", nullable = false, length = 9)
    private String cicloLectivo;







}
