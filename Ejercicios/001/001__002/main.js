function calcularDNI(numeroDNI) {
    var dni = "";
    var tablaLetras = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E"];
    var indice;

    if (typeof numeroDNI != "number") {
        console.error("Debes introducir un valor numérico.");
    }
    else if (numeroDNI < 0) {
        console.error("Debes introducir un valor positivo.");
    }
    else if (numeroDNI.toString().length > 8) {
        console.error("Debes introducir un número de 8 cifras o menos.");
    }
    else {
        dni = numeroDNI.toString();
        while (dni.length != 8) {
            dni = "0" + dni;
        }
        indice = numeroDNI % 23;

        dni += tablaLetras[indice];
    }

    return dni;
}

console.log("La letra del DNI 12312312K es: ");
console.log(calcularDNI(12312312));

console.log("La letra del DNI 78163312C es: ");
console.log(calcularDNI(78163312));

console.log("La letra del DNI 12345678Z es: ");
console.log(calcularDNI(12345678));

console.log("La letra del DNI ABCDEFGH es: ");
console.log(calcularDNI("ABCDEFGH"));

console.log("La letra del DNI 123 es: ");
console.log(calcularDNI(123));

console.log("La letra del DNI 123456789 es: ");
console.log(calcularDNI(123456789));

console.log("La letra del DNI -12312312 es: ");
console.log(calcularDNI(-12312312));
