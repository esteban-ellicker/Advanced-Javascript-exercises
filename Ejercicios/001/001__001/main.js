function calcularDNI(numeroDNI) {
    var letra = "";

    var tablaLetras = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E"];

    var indice = numeroDNI % 23;

    letra = tablaLetras[indice];

    return letra;
}

console.log("La letra del DNI 12312312K es: ");
console.log(calcularDNI(12312312));

console.log("La letra del DNI 78163312C es: ");
console.log(calcularDNI(78163312));

console.log("La letra del DNI 12345678Z es: ");
console.log(calcularDNI(12345678));
