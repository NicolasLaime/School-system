package backend_escuela.alumno.service;

import backend_escuela.alumno.dto.TutorRequestDto;
import backend_escuela.alumno.dto.TutorResponseDto;
import backend_escuela.alumno.entity.Alumno;
import backend_escuela.alumno.entity.Tutor;
import backend_escuela.alumno.repository.AlumnoRepository;
import backend_escuela.alumno.repository.TutorRepository;
import backend_escuela.shared.exception.ApiException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TutorService {

    private final TutorRepository tutorRepository;
    private final AlumnoRepository alumnoRepository;


    @Transactional
    public TutorResponseDto crear(TutorRequestDto request) {
        List<Alumno> alumnos = alumnoRepository.findAllById(request.getAlumnoIds());

        Tutor tutor = Tutor.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .telefono(request.getTelefono())
                .email(request.getEmail())
                .parentesco(request.getParentesco())
                .alumnos(alumnos)
                .build();

        return toResponse(tutorRepository.save(tutor));
    }

    public List<TutorResponseDto> listarPorCodigoAlumno(String codigo) {
        Alumno alumno = alumnoRepository.findByCodigo(codigo)
                .orElseThrow(() -> ApiException.notFound("Alumno no encontrado con código: " + codigo));
        return tutorRepository.findByAlumnosId(alumno.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }


    @Transactional
    public TutorResponseDto actualizar(Long id, TutorRequestDto request) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Tutor no encontrado con id: " + id));

        List<Alumno> alumnos = alumnoRepository.findAllById(request.getAlumnoIds());

        tutor.setNombre(request.getNombre());
        tutor.setApellido(request.getApellido());
        tutor.setTelefono(request.getTelefono());
        tutor.setEmail(request.getEmail());
        tutor.setParentesco(request.getParentesco());
        tutor.setAlumnos(alumnos);

        return toResponse(tutorRepository.save(tutor));
    }

    @Transactional
    public void eliminar(Long id) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Tutor no encontrado con id: " + id));
        tutorRepository.delete(tutor);
    }



    private TutorResponseDto toResponse(Tutor t) {
        return TutorResponseDto.builder()
                .id(t.getId())
                .nombre(t.getNombre())
                .apellido(t.getApellido())
                .telefono(t.getTelefono())
                .email(t.getEmail())
                .parentesco(t.getParentesco())
                .alumnos(t.getAlumnos().stream()
                        .map(a -> TutorResponseDto.AlumnoInfoDto.builder()
                                .codigoAlumno(a.getCodigo())
                                .nombreAlumno(a.getNombre() + " " + a.getApellido())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }






}
