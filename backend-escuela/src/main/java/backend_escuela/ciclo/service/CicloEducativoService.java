package backend_escuela.ciclo.service;

import backend_escuela.ciclo.dto.CicloEducativoRequestDto;
import backend_escuela.ciclo.dto.CicloEducativoResponseDto;
import backend_escuela.ciclo.entity.CicloEducativo;
import backend_escuela.ciclo.repository.CicloEducativoRepository;
import backend_escuela.shared.exception.ApiException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CicloEducativoService {

    private final CicloEducativoRepository cicloRepository;


    // ─── Crear ───────────────────────────────────────────────────────────
    @Transactional
    public CicloEducativoResponseDto crear(CicloEducativoRequestDto request) {

        if (cicloRepository.existsByNombre(request.getNombre())) {
            throw ApiException.conflict(
                    "Ya existe un ciclo educativo con el nombre: " + request.getNombre()
            );
        }

        CicloEducativo ciclo = CicloEducativo.builder()
                .nombre(request.getNombre())
                .build();

        return toResponse(cicloRepository.save(ciclo));
    }

    // ─── Listar todos ────────────────────────────────────────────────────
    @Transactional
    public List<CicloEducativoResponseDto> listarTodos() {
        return cicloRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Buscar por ID ───────────────────────────────────────────────────
    @Transactional
    public CicloEducativoResponseDto buscarPorId(Long id) {
        return toResponse(obtenerOFallar(id));
    }

    // ─── Actualizar ──────────────────────────────────────────────────────
    @Transactional
    public CicloEducativoResponseDto actualizar(Long id, CicloEducativoRequestDto request) {

        CicloEducativo ciclo = obtenerOFallar(id);

        if (!ciclo.getNombre().equals(request.getNombre())
                && cicloRepository.existsByNombre(request.getNombre())) {
            throw ApiException.conflict(
                    "Ya existe un ciclo educativo con el nombre: " + request.getNombre()
            );
        }

        ciclo.setNombre(request.getNombre());
        return toResponse(cicloRepository.save(ciclo));
    }

    // ─── Eliminar ────────────────────────────────────────────────────────
    @Transactional
    public void eliminar(Long id) {
        CicloEducativo ciclo = obtenerOFallar(id);
        cicloRepository.delete(ciclo);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────

    // Método público para que otros services puedan obtener la entidad
    public CicloEducativo obtenerOFallar(Long id) {
        return cicloRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound(
                        "Ciclo educativo con id " + id + " no encontrado"
                ));
    }

    private CicloEducativoResponseDto toResponse(CicloEducativo c) {
        return CicloEducativoResponseDto.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .build();
    }














}
