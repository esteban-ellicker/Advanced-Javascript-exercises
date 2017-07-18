
// Escribe una función que reciba un string de números separados por dos puntos, cree un array a partir del string y devuelva la media de todos los valores

function mediaDeArray (numeros) {
	return numeros.reduce((suma, valor) => suma + Number(valor), 0) / numeros.length;
}

function mediaDeNumerosSeparadosPorPuntos (stringDeNumeros) {
	var numeros = stringDeNumeros.split(":");
	return mediaDeArray(numeros);
}
function mediaDNSPPOmitiendoRepetidos(stringDeNumeros) {
	var numeros = stringDeNumeros.split(":");
	return mediaDeArray(numeros.filter((item, pos) => numeros.indexOf(item) == pos));
}

var stringDeNumeros = "80:70:90:100";
//La función debe devolver 85

console.log(mediaDeNumerosSeparadosPorPuntos(stringDeNumeros));

// Bonus quitar los repetidos al calcular la media
var stringDeNumerosConRepetidos = "80:70:90:100:100:100:100:100";

console.log(mediaDNSPPOmitiendoRepetidos(stringDeNumerosConRepetidos));
