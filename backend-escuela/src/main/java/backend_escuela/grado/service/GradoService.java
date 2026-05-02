package backend_escuela.grado.service;

import backend_escuela.ciclo.entity.CicloEducativo;
import backend_escuela.ciclo.service.CicloEducativoService;
import backend_escuela.grado.dto.GradoRequestDto;
import backend_escuela.grado.dto.GradoResponseDto;
import backend_escuela.grado.entity.Grado;
import backend_escuela.grado.repository.GradoRepository;
import backend_escuela.shared.exception.ApiException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradoService {


    private final GradoRepository gradoRepository;
    private final CicloEducativoService cicloService; // reutilizamos el service de ciclo

    // ─── Crear ───────────────────────────────────────────────────────────
    @Transactional
    public GradoResponseDto crear(GradoRequestDto request) {

        // Verificar que el ciclo existe
        CicloEducativo ciclo = cicloService.obtenerOFallar(request.getCicloEducativoId());

        // No puede haber dos grados con el mismo nombre en el mismo ciclo
        if (gradoRepository.existsByNombreAndCicloEducativoId(
                request.getNombre(), request.getCicloEducativoId())) {
            throw ApiException.conflict(
                    "Ya existe el grado '" + request.getNombre() + "' en ese ciclo educativo"
            );
        }

        Grado grado = Grado.builder()
                .nombre(request.getNombre())
                .cicloEducativo(ciclo)
                .build();

        return toResponse(gradoRepository.save(grado));
    }

    // ─── Listar todos ────────────────────────────────────────────────────
    @Transactional
    public List<GradoResponseDto> listarTodos() {
        return gradoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Listar por ciclo ─────────────────────────────────────────────────
    @Transactional
    public List<GradoResponseDto> listarPorCiclo(Long cicloId) {
        cicloService.obtenerOFallar(cicloId); // valida que el ciclo existe
        return gradoRepository.findByCicloEducativoId(cicloId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Buscar por ID ───────────────────────────────────────────────────
    @Transactional
    public GradoResponseDto buscarPorId(Long id) {
        return toResponse(obtenerOFallar(id));
    }

    // ─── Actualizar ──────────────────────────────────────────────────────
    @Transactional
    public GradoResponseDto actualizar(Long id, GradoRequestDto request) {

        Grado grado = obtenerOFallar(id);
        CicloEducativo ciclo = cicloService.obtenerOFallar(request.getCicloEducativoId());

        // Verificar duplicado solo si cambió el nombre o el ciclo
        boolean nombreCambio = !grado.getNombre().equals(request.getNombre());
        boolean cicloCambio  = !grado.getCicloEducativo().getId().equals(request.getCicloEducativoId());

        if ((nombreCambio || cicloCambio) &&
                gradoRepository.existsByNombreAndCicloEducativoId(
                        request.getNombre(), request.getCicloEducativoId())) {
            throw ApiException.conflict(
                    "Ya existe el grado '" + request.getNombre() + "' en ese ciclo educativo"
            );
        }

        grado.setNombre(request.getNombre());
        grado.setCicloEducativo(ciclo);

        return toResponse(gradoRepository.save(grado));
    }

    // ─── Eliminar ────────────────────────────────────────────────────────
    @Transactional
    public void eliminar(Long id) {
        gradoRepository.delete(obtenerOFallar(id));
    }

    // ─── Helpers ─────────────────────────────────────────────────────────

    public Grado obtenerOFallar(Long id) {
        return gradoRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound(
                        "Grado con id " + id + " no encontrado"
                ));
    }

    private GradoResponseDto toResponse(Grado g) {
        return GradoResponseDto.builder()
                .id(g.getId())
                .nombre(g.getNombre())
                .cicloEducativoId(g.getCicloEducativo().getId())
                .cicloEducativoNombre(g.getCicloEducativo().getNombre())
                .build();
    }







}
