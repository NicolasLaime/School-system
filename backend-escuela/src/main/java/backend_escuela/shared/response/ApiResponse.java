package backend_escuela.shared.response;

import lombok.Getter;

@Getter
public class ApiResponse<T> {


    private final boolean success;
    private final String message;
    private final T data;


    // Constructor privado — usás los métodos estáticos de abajo
    private ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data    = data;



    }


    // ✅ Respuesta exitosa con datos
    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }


    // ✅ Respuesta exitosa sin datos (ej: eliminar)
    public static <T> ApiResponse<T> ok(String message) {
        return new ApiResponse<>(true, message, null);
    }

    // ❌ Respuesta de error
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }


}
