package backend_escuela.ponderacion.service;


import backend_escuela.ciclo.entity.CicloEducativo;
import backend_escuela.ciclo.service.CicloEducativoService;
import backend_escuela.ponderacion.dto.PonderacionRequestDto;
import backend_escuela.ponderacion.dto.PonderacionResponseDto;
import backend_escuela.ponderacion.dto.PonderacionResumenDto;
import backend_escuela.ponderacion.entity.Ponderacion;
import backend_escuela.ponderacion.repository.PonderacionRepository;
import backend_escuela.shared.exception.ApiException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PonderacionService {

    private final PonderacionRepository ponderacionRepository;
    private final CicloEducativoService cicloService;

    // ─── Crear ────────────────────────────────────────────────────────────
    @Transactional
    public PonderacionResponseDto crear(PonderacionRequestDto request) {

        CicloEducativo ciclo = cicloService.obtenerOFallar(request.getCicloEducativoId());

        // No puede haber dos ponderaciones con el mismo nombre en el mismo ciclo
        if (ponderacionRepository.existsByNombreAndCicloEducativoId(
                request.getNombre(), request.getCicloEducativoId())) {
            throw ApiException.conflict(
                    "Ya existe una ponderación llamada '" + request.getNombre() +
                            "' en ese ciclo educativo"
            );
        }

        // Validar que al agregar este porcentaje no se supere 100%
        BigDecimal acumulado = ponderacionRepository
                .sumPorcentajeByCicloId(request.getCicloEducativoId());

        BigDecimal nuevo = acumulado.add(request.getPorcentaje());

        if (nuevo.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw ApiException.badRequest(
                    "Los porcentajes superan el 100%. " +
                            "Acumulado actual: " + acumulado + "%. " +
                            "Intentás agregar: " + request.getPorcentaje() + "%"
            );
        }

        Ponderacion ponderacion = Ponderacion.builder()
                .cicloEducativo(ciclo)
                .nombre(request.getNombre())
                .porcentaje(request.getPorcentaje())
                .build();

        return toResponse(ponderacionRepository.save(ponderacion));
    }

    // ─── Listar todas ─────────────────────────────────────────────────────
    @Transactional
    public List<PonderacionResponseDto> listarTodas() {
        return ponderacionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Listar por ciclo educativo ───────────────────────────────────────
    @Transactional
    public List<PonderacionResponseDto> listarPorCiclo(Long cicloId) {
        cicloService.obtenerOFallar(cicloId);
        return ponderacionRepository.findByCicloEducativoId(cicloId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Resumen completo de un ciclo ─────────────────────────────────────
    // Devuelve todas las ponderaciones + el total acumulado
    @Transactional
    public PonderacionResumenDto obtenerResumen(Long cicloId) {

        CicloEducativo ciclo = cicloService.obtenerOFallar(cicloId);

        List<PonderacionResponseDto> ponderaciones =
                ponderacionRepository.findByCicloEducativoId(cicloId)
                        .stream()
                        .map(this::toResponse)
                        .collect(Collectors.toList());

        BigDecimal total = ponderacionRepository.sumPorcentajeByCicloId(cicloId);

        return PonderacionResumenDto.builder()
                .cicloEducativoId(ciclo.getId())
                .cicloEducativoNombre(ciclo.getNombre())
                .ponderaciones(ponderaciones)
                .totalPorcentaje(total)
                .configuracionCompleta(
                        total.compareTo(BigDecimal.valueOf(100)) == 0
                )
                .build();
    }

    // ─── Buscar por ID ────────────────────────────────────────────────────
    @Transactional
    public PonderacionResponseDto buscarPorId(Long id) {
        return toResponse(obtenerOFallar(id));
    }

    // ─── Actualizar ───────────────────────────────────────────────────────
    @Transactional
    public PonderacionResponseDto actualizar(Long id, PonderacionRequestDto request) {

        Ponderacion    ponderacion = obtenerOFallar(id);
        CicloEducativo ciclo       = cicloService.obtenerOFallar(request.getCicloEducativoId());

        // Verificar nombre duplicado (ignorando el registro actual)
        if (!ponderacion.getNombre().equals(request.getNombre())
                && ponderacionRepository.existsByNombreAndCicloEducativoId(
                request.getNombre(), request.getCicloEducativoId())) {
            throw ApiException.conflict(
                    "Ya existe una ponderación llamada '" + request.getNombre() +
                            "' en ese ciclo educativo"
            );
        }

        // Validar que el nuevo porcentaje no supere 100%
        // Sumamos todo EXCEPTO el registro que estamos editando
        BigDecimal acumuladoSinEste = ponderacionRepository
                .sumPorcentajeByCicloIdExcluyendo(request.getCicloEducativoId(), id);

        BigDecimal nuevo = acumuladoSinEste.add(request.getPorcentaje());

        if (nuevo.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw ApiException.badRequest(
                    "Los porcentajes superan el 100%. " +
                            "Acumulado sin este registro: " + acumuladoSinEste + "%. " +
                            "Intentás poner: " + request.getPorcentaje() + "%"
            );
        }

        ponderacion.setNombre(request.getNombre());
        ponderacion.setPorcentaje(request.getPorcentaje());
        ponderacion.setCicloEducativo(ciclo);

        return toResponse(ponderacionRepository.save(ponderacion));
    }

    // ─── Eliminar ─────────────────────────────────────────────────────────
    @Transactional
    public void eliminar(Long id) {
        ponderacionRepository.delete(obtenerOFallar(id));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────

    // Público porque lo usa NotaService para calcular promedios
    public List<Ponderacion> obtenerEntidadesPorCiclo(Long cicloId) {
        return ponderacionRepository.findByCicloEducativoId(cicloId);
    }

    public Ponderacion obtenerOFallar(Long id) {
        return ponderacionRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound(
                        "Ponderación con id " + id + " no encontrada"
                ));
    }

    private PonderacionResponseDto toResponse(Ponderacion p) {
        return PonderacionResponseDto.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .porcentaje(p.getPorcentaje())
                .cicloEducativoId(p.getCicloEducativo().getId())
                .cicloEducativoNombre(p.getCicloEducativo().getNombre())
                .build();
    }




}
