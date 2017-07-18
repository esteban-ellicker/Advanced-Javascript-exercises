function contarCaracteres(myString) {
    var resultado = {
        data : {},
        error : null
    };

    if (typeof myString != "string") {
        resultado.error = "No has enviado una cadena";
    } else {
        resultado.data = myString.split("").sort().reduce(function(cuenta, chr){
            return cuenta[chr] ? cuenta[chr]++ : cuenta[chr] = 1, cuenta;
        },{});
    }

    return resultado;
}

function contarCaracteresYMostrar(cadena) {

    console.log("Contando caracteres en:");
    console.log(cadena);

    var resultado = contarCaracteres(cadena);

    console.log(resultado);

    if (resultado.error) {
        console.error(resultado.error);
    }

    for (var chr in resultado.data) {
        console.log("Hay " + resultado.data[chr] + " ocurrencias del caracter «" + chr + "»");
    }
}


contarCaracteresYMostrar("Esteban Gabriel Ellicker Iglesias");

contarCaracteresYMostrar("Esta es una oracion bastante larga para que la funcion tenga bastantes caracteres que contar");

contarCaracteresYMostrar(10);

