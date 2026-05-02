package backend_escuela.shared.enums;

public enum Bimestre {


    PRIMERO(1),
    SEGUNDO(2),
    TERCERO(3),
    CUARTO(4);

    private final int numero;

    Bimestre(int numero) {
        this.numero = numero;
    }

    public int getNumero() {
        return numero;
    }

    // Convierte el número 1,2,3,4 al enum correspondiente
    public static Bimestre fromNumero(int numero) {
        for (Bimestre b : values()) {
            if (b.numero == numero) return b;
        }
        throw new IllegalArgumentException("Bimestre inválido: " + numero + ". Debe ser 1, 2, 3 o 4");
    }

}
