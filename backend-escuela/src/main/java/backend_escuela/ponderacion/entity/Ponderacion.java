package backend_escuela.ponderacion.entity;

import backend_escuela.ciclo.entity.CicloEducativo;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ponderaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ponderacion {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A qué ciclo pertenece (Primaria o Secundaria)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ciclo_educativo_id", nullable = false)
    private CicloEducativo cicloEducativo;

    // Nombre del tipo de nota: "Tareas", "Examen", "Proyecto", etc.
    @Column(nullable = false, length = 100)
    private String nombre;

    // Porcentaje que representa: 30.00, 40.00, etc.
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentaje;
























}
