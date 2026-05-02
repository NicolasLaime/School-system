package backend_escuela.grado.entity;


import backend_escuela.ciclo.entity.CicloEducativo;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "grados")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nombre; // "1°", "2°", "3°"

    // Muchos grados pertenecen a un ciclo educativo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ciclo_educativo_id", nullable = false)
    private CicloEducativo cicloEducativo;







}
