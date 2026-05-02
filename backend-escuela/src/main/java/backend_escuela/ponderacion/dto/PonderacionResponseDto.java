package backend_escuela.ponderacion.dto;

import lombok.*;

import java.math.BigDecimal;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PonderacionResponseDto {


    private Long       id;
    private String     nombre;
    private BigDecimal porcentaje;

    // Datos del ciclo educativo
    private Long   cicloEducativoId;
    private String cicloEducativoNombre;


}
