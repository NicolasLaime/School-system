package backend_escuela.ciclo.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ciclos_educativos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CicloEducativo {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre; // "Primaria", "Secundaria"





}
