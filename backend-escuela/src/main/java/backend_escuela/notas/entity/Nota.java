package backend_escuela.notas.entity;

import backend_escuela.alumno.entity.Alumno;
import backend_escuela.asignatura.entity.Asignatura;
import backend_escuela.seccion.entity.Seccion;
import backend_escuela.shared.enums.Bimestre;
import backend_escuela.usuario.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "calificaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alumno_id", nullable = false)
    private Alumno alumno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asignatura_id", nullable = false)
    private Asignatura asignatura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seccion_id", nullable = false)
    private Seccion seccion;

    // 1, 2, 3 o 4 — guardado como número en la BD
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private Bimestre bimestre;

    // "2024-2025"
    @Column(name = "ciclo_lectivo", nullable = false, length = 9)
    private String cicloLectivo;

    // "Tareas", "Examen" — debe coincidir con Ponderacion.nombre
    @Column(name = "tipo_nota", nullable = false, length = 80)
    private String tipoNota;

    // La nota en sí: 0.00 a 100.00
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal valor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    private Usuario docente;

    @Column(name = "fecha_registro")
    @Builder.Default
    private LocalDateTime fechaRegistro = LocalDateTime.now();












}
