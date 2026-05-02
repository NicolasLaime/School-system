package backend_escuela.usuario.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    // La contraseña siempre se guarda hasheada, nunca en texto plano
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    // Guardamos el enum como texto en la BD ("ADMIN", "DOCENTE", "DIRECTIVO")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private RolNombre rol;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Se ejecuta automáticamente antes de insertar
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }



}
