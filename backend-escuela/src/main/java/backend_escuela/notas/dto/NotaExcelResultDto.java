package backend_escuela.notas.dto;


import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotaExcelResultDto {

    private int  totalProcesadas;
    private int  guardadas;
    private int  errores;

    // Cada error indica la fila y el motivo
    private List<FilaErrorDto> filasFallidas;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FilaErrorDto {
        private int    numeroFila;
        private String codigoAlumno;
        private String motivo;
    }








}
