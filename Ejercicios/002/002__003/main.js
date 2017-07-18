/*

002__003

1) realiza una clase ejército que tenga un array de vikingos 

2) realiza una clase soldadoVikingo que herede de vikingo y tenga los métodos necesarios para la lucha 

3) realiza una clase curanderoVikingo que herede de vikingo, añade a la clase ejército un array de curanderos y añade el método resucitar(vikingo), que permitirá recuperar la salud de los soldados muertos en combate. Los curanderos solo podrán resucitar 5 veces

4) añade un método enfrentarEjercitos en la clase batalla, que reciba dos ejércitos y los enfrente entre si.
Enfrentará el primer soldado de cada ejército contra el primer soldado del otro. Cuando mueran vikingos si él ejércitos tiene curanderos, podrán revivir al vikingo.
Si no pueden revivirlo, deberá abandonar el array y pasara a enfrentarse el siguiente 
La batalla acabará cuando uno de los dos ejércitos pierda todos sus soldados.


Parametros de los Vikingos:

Salud: 100
Potencia de ataque: aleatorio entre 1 y 20
Numero de armas: aleatorio entre 1 y 5


Parametros de armas:

NumeroDeAtaques: aleatorio entre 1 y 10
Potencia: aleatorio entre 20 y 50


Ejercito:

Numero de soldados: 25
Numero de curanderos: 5

Curanderos:

vecesQuePuedeCurar: 5 (restaura a un vikingo al 100% de salud)


Ejercicio 002__003 Bonus

1) Vamos a cambiar nuestra clase ejército.
La clase ejército deberá recibir un array de soldados (25) y un array de armas (50).

Durante su construcción el ejército deberá decidir cómo reparte las armas entre sus soldados.

También deberá ordenar el array de soldados decidiendo en que orden deben pelear.

2) crearemos dos ejércitos y después crearemos una batalla con esos dos ejércitos.

La clase batalla orquestará la batalla entre los dos ejércitos 

 */

/* ********* contantes para no repetir valores en el código ********* */
// saludMaxima se usa como constante donde queramos usar la salud máxima
var saludMaxima = 100;


/* ********** Clase Vikingo ********** */
function Vikingo(nombre, salud, dinero) {
    this.init(nombre, salud, dinero);
}
Vikingo.prototype.init = function(nombre, salud, dinero) {
    this.nombre = nombre || "";
    this.salud = salud || 100;
    this.dinero = dinero || 0;
};
Vikingo.prototype.modificarSalud = function(cantidad) {
    this.salud += cantidad;
    if (this.salud < 0) {
        this.salud = 0;
    } else {
        if (this.salud > saludMaxima) {
            this.salud = saludMaxima;
        }
    }
    console.log("    La salud de " + this.nombre + " ahora es " + this.salud);
};
Vikingo.prototype.getEstado = function() {
    var estado = this.nombre + " [salud:" + this.salud + ", dinero:" + this.dinero + "]";
    return estado;
};


/* ********** Clase soldado SoldadoVikingo ********** */
function SoldadoVikingo(nombre, salud, dinero, potencia, velocidad) {
    this.init(nombre, salud, dinero);
    this.potenciaAtaque = potencia;
    this.velocidad = velocidad;
    this.armas = [];
    this.armaElegida = null;
}
SoldadoVikingo.prototype = new Vikingo();
SoldadoVikingo.prototype.ataca = function(vikingo) {
    var armaElegida = this.armaElegida || this.elegirArma();
    var potenciaAtaque = this.getPotenciaActual();
    var nombreArma = "sus puños";
    if (armaElegida) {
        armaElegida.usar();
        potenciaAtaque = armaElegida.potencia;
        nombreArma = armaElegida.tipo + "(" + armaElegida.ataquesRestantes + ")";
    }
    console.log(this.nombre + " atacará a " + vikingo.nombre + " con potencia " + potenciaAtaque + " usando " + nombreArma);
    vikingo.modificarSalud(-potenciaAtaque);
    if (armaElegida && armaElegida.ataquesRestantes === 0) {
        this.abandonarArma(armaElegida);
    }
};
SoldadoVikingo.prototype.getPotenciaActual = function() {
    var potenciaActual = Math.round(this.potenciaAtaque * 0.8 + this.potenciaAtaque * 0.2 * this.salud / saludMaxima);
    return potenciaActual;
};
// Sobreescribe getEstado de Vikingo
SoldadoVikingo.prototype.getEstado = function() {
    var estado = this.nombre + " [salud:" + this.salud + ", potencia:" + this.potenciaAtaque + "(" + this.getPotenciaActual() + "), velocidad:" + this.velocidad + ", dinero:" + this.dinero + ", armas:" + this.armas.length + "]";
    for (var i = 0; i < this.armas.length; i++) {
        var arma = this.armas[i];
        estado += "\n    " + arma.getEstado();
    }
    return estado;
};
SoldadoVikingo.prototype.addArma = function(arma) {
    this.armas.push(arma);
};
SoldadoVikingo.prototype.abandonarArma = function(arma) {
    var indice = this.armas.indexOf(arma);
    var abandonadas = this.armas.splice(indice, 1);
    if (abandonadas[0] == this.armaElegida) {
        this.armaElegida = null;
    }
    console.log("    " + this.nombre + " ha abandonado su " + abandonadas[0].tipo);
};
SoldadoVikingo.prototype.elegirArma = function() {
    var armaElegida = null;
    for (var i = 0; i < this.armas.length; i++) {
        var arma = this.armas[i];
        if (!armaElegida || arma.potencia > armaElegida.potencia) {
            armaElegida = arma;
        }
    }
    if (armaElegida) {
        console.log("    " + this.nombre + " ha elegido su " + armaElegida.tipo);
        this.armaElegida = armaElegida;
    }
    return armaElegida;
};
SoldadoVikingo.prototype.robarDinero = function(vikingo) {
    this.dinero += vikingo.dinero;
    console.log(this.nombre + " ha robado " + vikingo.dinero + " monedas a " + vikingo.nombre);
    vikingo.dinero = 0;
};
SoldadoVikingo.prototype.robarArmas = function(vikingo) {
    if (vikingo.armas.length) {
        this.armas = this.armas.concat(vikingo.armas);
        console.log(this.nombre + " ha robado " + vikingo.armas.length + " armas a " + vikingo.nombre);
        vikingo.armas = [];
        vikingo.armaElegida = null;
    }
};


/* ********** Clase soldado CuranderoVikingo ********** */
function CuranderoVikingo(nombre, salud, dinero) {
    this.init(nombre, salud, dinero);
    this.vecesQuePuedeCurar = 5; //(restaura a un vikingo al 100% de salud)
}
CuranderoVikingo.prototype = new Vikingo();
CuranderoVikingo.prototype.puedeCurar = function(vikingo) {
    return this.vecesQuePuedeCurar > 0;
};
CuranderoVikingo.prototype.curar = function(vikingo) {
    if (this.puedeCurar()) {
        vikingo.salud = 100;
        this.vecesQuePuedeCurar--;
        console.log(this.nombre + " ha curado a " + vikingo.nombre);
    } else {
        console.log(this.nombre + " ya no puede curar");
    }
};
// Sobreescribe getEstado de Vikingo
CuranderoVikingo.prototype.getEstado = function() {
    var estado = this.nombre + " [salud:" + this.salud + ", vecesQuePuedeCurar:" + this.vecesQuePuedeCurar + "]";
    return estado;
};


/* ********** Clase Batalla ********** */
function Batalla() {}
Batalla.prototype.enfrentarVikingos = function(vikingo1, vikingo2) {
    var vikingos = [vikingo1, vikingo2];
    console.log("***** " + vikingos[0].nombre + " y " + vikingos[1].nombre + " entraran en batalla *****");
    console.log(vikingos[0].getEstado());
    console.log(vikingos[1].getEstado());

    var v1 = vikingos[0].velocidad;
    var v2 = vikingos[1].velocidad;
    var turno = v1 > v2 ? 0 : v1 < v2 ? 1 : Math.round(Math.random());

    var atacante;
    var atacado;

    while (vikingos[0].salud > 0 && vikingos[1].salud > 0) {
        atacante = vikingos[turno];
        atacado = vikingos[turno ? 0 : 1];
        atacante.ataca(atacado);
        turno = turno ? 0 : 1;
    }

    console.log("***** " + atacante.nombre + " ha ganado la batalla contra " + atacado.nombre + " *****");
    atacante.robarDinero(atacado);
    atacante.robarArmas(atacado);
    console.log(vikingos[0].getEstado());
    console.log(vikingos[1].getEstado());
};
Batalla.prototype.enfrentarEjercitos = function(ejercito1, ejercito2) {
    console.log("***** " + ejercito1.nombre + " y " + ejercito2.nombre + " entraran en batalla *****");
    console.log(ejercito1.getEstado());
    console.log(ejercito2.getEstado());
    var ejercitoGanador = null;
    var ejercitoPerdedor = null;
    var soldadoGanador = null;
    var soldadoPerdedor = null;

    while (ejercito1.soldados.length && ejercito2.soldados.length) {
        var soldado1 = ejercito1.soldados[0];
        var soldado2 = ejercito2.soldados[0];
        this.enfrentarVikingos(soldado1, soldado2);

        if (soldado1.salud === 0) {
            soldadoPerdedor = soldado1;
            ejercitoPerdedor = ejercito1;
        } else {
            soldadoPerdedor = soldado2;
            ejercitoPerdedor = ejercito2;
        }
        if (ejercitoPerdedor) {
            var curandero = ejercitoPerdedor.getCuranderoQuePuedeCurar();
            if (curandero) {
                curandero.curar(soldadoPerdedor);
            } else {
                ejercitoPerdedor.soldados.shift();
            }
        }
    }

    if (ejercito1.soldados.length) {
        ejercitoGanador = ejercito1;
        ejercitoPerdedor = ejercito2;
    } else {
        ejercitoGanador = ejercito2;
        ejercitoPerdedor = ejercito1;
    }
    console.log("***** " + ejercitoGanador.nombre + " ha ganado la batalla contra " + ejercitoPerdedor.nombre + " *****");
    console.log(ejercito1.getEstado());
    console.log(ejercito2.getEstado());
};


/* ********** Clase Arma ********** */
function Arma(tipo, potencia, ataquesRestantes) {
    this.tipo = tipo;
    this.potencia = potencia;
    this.ataquesRestantes = ataquesRestantes;
}
Arma.prototype.usar = function() {
    this.ataquesRestantes--;
};
Arma.prototype.getEstado = function() {
    var estado = this.tipo + " [potencia:" + this.potencia + ", ataquesRestantes:" + this.ataquesRestantes + "]";
    return estado;
};


/* ********** Clase Ejercito ********** */
function Ejercito(nombre, soldados, curanderos, armas) {
    this.init(nombre, soldados, curanderos, armas);
}
Ejercito.prototype.init = function(nombre, soldados, curanderos, armas) {
    this.nombre = nombre || "";
    this.soldados = soldados || [];
    this.curanderos = curanderos || [];
    this.armas = armas || [];
};
Ejercito.prototype.addSoldado = function(soldado) {
    this.soldados.push(soldado);
};
Ejercito.prototype.addCurandero = function(curandero) {
    this.curanderos.push(curandero);
};
Ejercito.prototype.addArma = function(arma) {
    this.armas.push(arma);
};
Ejercito.prototype.getCuranderoQuePuedeCurar = function() {
    return this.curanderos.find(function(curandero) {
        return curandero.puedeCurar();
    });
};
Ejercito.prototype.getEstado = function() {
    var estado = this.nombre + " [soldados:" + this.soldados.length + ", curanderos:" + this.curanderos.length + ", armas:" + this.armas.length + "]";
    for (var s = 0; s < this.soldados.length; s++) {
        var soldado = this.soldados[s];
        estado += "\n  " + soldado.getEstado() + "]";
    }
    for (var c = 0; c < this.curanderos.length; c++) {
        var curandero = this.curanderos[c];
        estado += "\n  " + curandero.getEstado() + "]";
    }
    for (var a = 0; a < this.armas.length; a++) {
        var arma = this.armas[a];
        estado += "\n  " + arma.getEstado();
    }
    return estado;
};
Ejercito.prototype.entregarArma = function(soldado) {
    //Sacamos la primer arma que queda en la armería
    var arma = this.armas.shift();
    if (arma) {
        console.log("  " + this.nombre + " entrega " + arma.getEstado() + " a " + soldado.nombre + " [potencia:" + soldado.potenciaAtaque +  ", velocidad:" + soldado.velocidad + "]");
        soldado.addArma(arma);
    }
};
Ejercito.prototype.repartirArmasEntreSoldados = function() {
    while (this.armas.length) {
        for (var s = 0; s < this.soldados.length; s++) {
            var soldado = this.soldados[s];
            this.entregarArma(soldado);
        }
    }
};
Ejercito.prototype.prepararBatalla = function() {
    console.log("***** " + this.nombre + " se prepara para la batalla *****");
    this.repartirArmasEntreSoldados();
};


/* ********** Clase EjercitoVeloz ********** */
function EjercitoFuerte(nombre, soldados, curanderos, armas) {
    this.init(nombre, soldados, curanderos, armas);
}
EjercitoFuerte.prototype = new Ejercito();
//Sobreeescribe prepararBatalla de Ejercito
EjercitoFuerte.prototype.prepararBatalla = function() {
    console.log("***** " + this.nombre + " se prepara para la batalla poniendo los más fuertes al frente *****");

    //Ordenamos los soldados para dejar los más fuertes primero
    var comparaSoldados = function(a, b) {
        return b.potenciaAtaque - a.potenciaAtaque || b.velocidad - a.velocidad;
    };
    this.soldados.sort(comparaSoldados);

    //Ordenamos las armas para dejar las más potentes primero
    var comparaArmas = function(a, b) {
        return b.potencia - a.potencia || b.ataquesRestantes - a.ataquesRestantes;
    };
    this.armas.sort(comparaArmas);

    while (this.armas.length) {
        for (var s = 0; s < this.soldados.length; s++) {
            var soldado = this.soldados[s];
            //Entregamos 5 armas a cada soldado
            for (var i = 0; i < 5; i++) {
                this.entregarArma(soldado);
            }
        }
    }
};


/* ********** Clase EjercitoVeloz ********** */
function EjercitoVeloz(nombre, soldados, curanderos, armas) {
    this.init(nombre, soldados, curanderos, armas);
}
EjercitoVeloz.prototype = new Ejercito();
//Sobreeescribe prepararBatalla de Ejercito
EjercitoVeloz.prototype.prepararBatalla = function() {
    console.log("***** " + this.nombre + " se prepara para la batalla poniendo los más veloces al frente *****");

    //Ordenamos los soldados para dejar los más rápidos primero
    var comparaSoldados = function(a, b) {
        return b.velocidad - a.velocidad || b.potenciaAtaque - a.potenciaAtaque;
    };
    this.soldados.sort(comparaSoldados);

    //Ordenamos las armas para dejar las más durables primero
    var comparaArmas = function(a, b) {
        return b.ataquesRestantes - a.ataquesRestantes || b.potencia - a.potencia;
    };
    this.armas.sort(comparaArmas);

    while (this.armas.length) {
        for (var s = 0; s < this.soldados.length; s++) {
            var soldado = this.soldados[s];
            //Entregamos 2 armas a cada soldado
            for (var i = 0; i < 2; i++) {
                this.entregarArma(soldado);
            }
        }
    }
};

/* ********** funciones utilitarias ********** */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var nombres = ["Victor", "Omar", "Karen", "Ariel", "Omar", "David", "Esteban", "Matías", "Vlairner", "Lucy", "Ignacio", "Humberto", "Néstor", "Daniel", "Raymundo", "Fran"];

function getNombreAleatorio() {
    return nombres[getRandomInt(0, nombres.length - 1)];
}

var nombresArmas = ["hacha", "espada", "cuchillo", "maza", "lanza"];

function getNombreArmaAleatorio() {
    return nombresArmas[getRandomInt(0, nombresArmas.length - 1)];
}

function addArmasAleatorias(soldadoVikingo) {
    var numeroArmas = getRandomInt(1, 5);
    for (var i = 0; i < numeroArmas; i++) {
        var nombreArma = getNombreArmaAleatorio();
        var potencia = getRandomInt(20, 50);
        var ataques = getRandomInt(1, 10);
        soldadoVikingo.addArma(new Arma(nombreArma, potencia, ataques));
    }
}

function addVikingosYArmasAleatoriosAEjercito(ejercito, numeroSoldados, numeroCuranderos, numeroArmas) {
    numeroSoldados = numeroSoldados || 25;
    numeroCuranderos = numeroCuranderos || 5;
    for (var s = 0; s < numeroSoldados; s++) {
        var nombreSoldado = getNombreAleatorio();
        var dineroSoldado = getRandomInt(200, 1000);
        var potenciaSoldado = getRandomInt(1, 20);
        var velocidadSoldado = getRandomInt(1, 100);
        var soldadoVikingo = new SoldadoVikingo(nombreSoldado, saludMaxima, dineroSoldado, potenciaSoldado, velocidadSoldado);
        //addArmasAleatorias(soldadoVikingo);
        ejercito.addSoldado(soldadoVikingo);
    }
    for (var c = 0; c < numeroCuranderos; c++) {
        var nombreCurandero = getNombreAleatorio();
        var dineroCurandero = getRandomInt(200, 1000);
        var curanderoVikingo = new CuranderoVikingo(nombreCurandero, saludMaxima, dineroCurandero);
        ejercito.addCurandero(curanderoVikingo);
    }
    for (var a = 0; a < numeroArmas; a++) {
        var nombreArma = getNombreArmaAleatorio();
        var potenciaArma = getRandomInt(20, 50);
        var ataquesArma = getRandomInt(1, 10);
        var arma = new Arma(nombreArma, potenciaArma, ataquesArma);
        ejercito.addArma(arma);
    }
}



// /* ********** Declaramos los vikingos y sus armas ********** */

// var erik = new SoldadoVikingo("Erik", saludMaxima, getRandomInt(200, 1000), getRandomInt(1, 20), getRandomInt(1, 100));
// addArmasAleatorias(erik);

// var olaf = new SoldadoVikingo("Olaf", saludMaxima, getRandomInt(200, 1000), getRandomInt(1, 20), getRandomInt(1, 100));
// addArmasAleatorias(olaf);


// /* ********** Inicia la batalla entre dos vikingos ********** */

// var batallaPreliminar = new Batalla();

// batallaPreliminar.enfrentarVikingos(erik, olaf);



/* ********** Declaramos los ejercitos ********** */

var ejercitoDelNorte = new EjercitoFuerte("Ejercito del Norte");
addVikingosYArmasAleatoriosAEjercito(ejercitoDelNorte, 25, 5, 50);
ejercitoDelNorte.prepararBatalla();

var ejercitoDelSur = new EjercitoVeloz("Ejercito del Sur");
addVikingosYArmasAleatoriosAEjercito(ejercitoDelSur, 25, 5, 50);
ejercitoDelSur.prepararBatalla();


/* ********** Inicia la batalla entre dos ejercitos ********** */

var batalla = new Batalla();

batalla.enfrentarEjercitos(ejercitoDelNorte, ejercitoDelSur);