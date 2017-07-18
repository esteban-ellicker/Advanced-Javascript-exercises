
// La funcion buscarParejas recibe un array de números y debe devolver las parejas de posiciones que suman cero

function buscarParejas(array) {
    var parejas = [];
    array.forEach(function(item, index) {
        for (var i = index + 1; i <= array.length; i++) {
            if (item + array[i] === 0) {
                parejas.push(index + "," + i);
            }
        }
    });
    return parejas;
}

var myArray = [2, -5, 10, 5, 4, -10, 0, -5];
console.log(buscarParejas(myArray));

// Debe imprimir [ "1,3", "2,5", "3,7"]