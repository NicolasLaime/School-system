package backend_escuela.usuario.controller;


import backend_escuela.shared.response.ApiResponse;
import backend_escuela.usuario.dto.UsuarioRequestDTO;
import backend_escuela.usuario.dto.UsuarioResponseDTO;
import backend_escuela.usuario.entity.RolNombre;
import backend_escuela.usuario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class Controller {


    private final UsuarioService usuarioService;

    // POST /api/usuarios
    @PostMapping
    public ResponseEntity<ApiResponse<UsuarioResponseDTO>> crear(
            @Valid @RequestBody UsuarioRequestDTO request) {

        UsuarioResponseDTO creado = usuarioService.crear(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Usuario creado correctamente", creado));
    }

    // GET /api/usuarios
    @GetMapping
    public ResponseEntity<ApiResponse<List<UsuarioResponseDTO>>> listarTodos() {
        return ResponseEntity.ok(
                ApiResponse.ok("Usuarios obtenidos", usuarioService.listarTodos())
        );
    }

    // GET /api/usuarios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioResponseDTO>> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.ok("Usuario encontrado", usuarioService.buscarPorId(id))
        );
    }

    // GET /api/usuarios/rol/DOCENTE
    @GetMapping("/rol/{rol}")
    public ResponseEntity<ApiResponse<List<UsuarioResponseDTO>>> listarPorRol(
            @PathVariable RolNombre rol) {

        return ResponseEntity.ok(
                ApiResponse.ok("Usuarios obtenidos", usuarioService.listarPorRol(rol))
        );
    }

    // PUT /api/usuarios/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioResponseDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRequestDTO request) {

        return ResponseEntity.ok(
                ApiResponse.ok("Usuario actualizado correctamente", usuarioService.actualizar(id, request))
        );
    }

    // DELETE /api/usuarios/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> desactivar(@PathVariable Long id) {
        usuarioService.desactivar(id);
        return ResponseEntity.ok(ApiResponse.ok("Usuario desactivado correctamente"));
    }






}
