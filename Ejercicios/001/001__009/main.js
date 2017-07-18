function ponerTodasLasLetrasMayusculas(string) {
    return string.toUpperCase();
}

function stringInverso(string) {
    return string.split("").reverse().join("");
}

function eliminarEspacios(string) {
    return string.replace(/\s+/g, "");

}

function esPalindromo(string) {
    var test = ponerTodasLasLetrasMayusculas(eliminarEspacios(string));
    return test == stringInverso(test);
}

//Arde ya la yedra
//Ana lava lana
//Anita lava la tina

var stringDePrueba = ["Arde ya la yedra", "Ana lava lana", "Anita lava la tina", "Esto no es palindromo"];

stringDePrueba.forEach(function(string) {
    var resultado = esPalindromo(string);
    console.log("«" + string + "» " + (resultado ? "es" : "no es") + " palindromo");
});
