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

function buscarStringMasLargos(arrayDeArrays) {

    var resultados = [];

    for (var array of arrayDeArrays) {
        var resultado = stringMasLargo(array);
        console.log("Buscando frase más larga y su longitud");
        console.log(array);
        console.log("Frase y longitud encontrada:");
        console.log(resultado);
        resultados.push(resultado.longitud);
    }

    return resultados;
}

function calcularMedia(resultados) {
    var suma = 0;
    for (var resultado of resultados) {
        suma += resultado;
    }
    return suma / resultados.length;
}

var arrayDeTest1 = ["Richie", "Joanie", "Greg", "Marcia", "Bobby"];
var arrayDeTest2 = ["Blanka", "Zangief", "Chun Lis", "Guile"];
var arrayDeTest3 = ["Red", "Blue", "Green"];
var arrayDeTest4 = ["Hola", "Frase corta", "Frase normalita", "Frase muy muy larga"];

var resultados = buscarStringMasLargos([arrayDeTest1, arrayDeTest2, arrayDeTest3, arrayDeTest4]);
console.log("Resultados:");
console.log(resultados);

var media = calcularMedia(resultados);
console.log("La media es:");
console.log(media);

