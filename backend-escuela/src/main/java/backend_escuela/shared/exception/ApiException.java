package backend_escuela.shared.exception;


import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiException extends RuntimeException{

    private final HttpStatus status;

    public ApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    // Atajos para los casos más comunes

    public static ApiException notFound(String mensaje) {
        return new ApiException(mensaje, HttpStatus.NOT_FOUND);
    }

    public static ApiException badRequest(String mensaje) {
        return new ApiException(mensaje, HttpStatus.BAD_REQUEST);
    }

    public static ApiException conflict(String mensaje) {
        return new ApiException(mensaje, HttpStatus.CONFLICT);
    }

    public static ApiException forbidden(String mensaje) {
        return new ApiException(mensaje, HttpStatus.FORBIDDEN);
    }


    public static RuntimeException unauthorized(String mensaje) {
        return new ApiException(mensaje, HttpStatus.UNAUTHORIZED);
    }
}
