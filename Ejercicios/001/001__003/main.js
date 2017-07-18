function stringMasLargo(array) {
    var masLargo = {
        longitud: 0,
        string: ""
    };

    for (var i = 0; i < array.length; i++) {
        if (typeof array[i] != "string") {
            console.error("El valor en el índice " + i + " no es un string.");
            console.error(array[i]);
        }
        else if (masLargo.longitud < array[i].length) {
            masLargo.string = array[i];
            masLargo.longitud = masLargo.string.length;
        }
    }

    return masLargo;
}

var array = ["Hola", "Frase corta", "Frase normalita", "Frase muy muy larga"];

console.log("Buscando frase más larga y su longitud");
console.log(array);
console.log("Frase y longitud encontrada:");
console.log(stringMasLargo(array));

var arrayDos = ["Hola", true, "Frase corta", 7, "Frase normalita", null, "Frase muy muy larga"];

console.log("Buscando frase más larga y su longitud");
console.log(arrayDos);
console.log("Frase y longitud encontrada:");
console.log(stringMasLargo(arrayDos));
