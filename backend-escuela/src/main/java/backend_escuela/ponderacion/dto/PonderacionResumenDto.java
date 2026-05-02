package backend_escuela.ponderacion.dto;


import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PonderacionResumenDto {


    private Long                      cicloEducativoId;
    private String                    cicloEducativoNombre;
    private List<PonderacionResponseDto> ponderaciones;

    // Suma total de todos los porcentajes
    private BigDecimal totalPorcentaje;

    // true si la suma da exactamente 100.00
    private boolean configuracionCompleta;






}
