/*

1) Haciendo uso de funciones y new, realiza una "clase" Vikingo que almacene la información de un vikingo:

nombre
salud (0 - 1000)
potenciaAtaque (1 - 20)
valocidad (0 - 100)

2) Haz uso de prototype y añade un método .ataca(vikingo) a un vikingo para que ataque a su oponente.
el ataque quitara salud al vikingo atacado (la potencia de ataque del atacante)

3) Realiza una clase Batalla() cuyas instancias enfrenten a dos vikingos.

Batalla tendrá un método iniciarPelea que hará de comienzo.

Una batalla tendrá una serie de asaltos en los que:

atacará primero el que más valocidad tenga,
y queitará de saludo su potencia de ataque al rival,
hasta que uno muera.

4) Crear la clase Arma() tenga un tipo: (espada/cuchillo...etc), una potencia (20 - 50) y un ataquesRestantes (0 -10).

5) Añade una propiedad armas a Vikingo para que pueda poseer varias armaspara su batalla.
Añade el método addArma() para añadir armas a los vikingos,

6) Modifica la función ataca del vikingo, para que si tiene armas disponibles ataque con el arma más potente.
Cada vez que se use un arma, debera restar uno a ataquesRestantes de ese arma.
Cuando el arma tenga 0 ataquesRestantes, el vikingo deberá abandonar el arma (añade la función abandonarArma al vikingo).

 */


// saludMaxima se usa como constante donde queramos usar la salud máxima (la bajé a 500 para que la batalla dure menos)
var saludMaxima = 500;


/* ********** Clase Vikingo ********** */
function Vikingo(nombre, salud, potencia, velocidad) {
    this.nombre = nombre;
    this.salud = salud;
    this.potenciaAtaque = potencia;
    this.velocidad = velocidad;
    this.armas = [];
    this.dinero = Math.floor(Math.random() * 1000) + 200;
    this.armaElegida = null;
}
Vikingo.prototype.ataca = function(vikingo) {
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
Vikingo.prototype.getPotenciaActual = function() {
    var potenciaActual = Math.round(this.potenciaAtaque * 0.8 + this.potenciaAtaque * 0.2 * this.salud / saludMaxima);
    return potenciaActual;
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
    var estado = this.nombre + " [salud:" + this.salud + ", potencia:" + this.potenciaAtaque + "(" + this.getPotenciaActual() + "), velocidad:" + this.velocidad + ", dinero:" + this.dinero + "]";
    for (var i = 0; i < this.armas.length; i++) {
        var arma = this.armas[i];
        estado += "\n    " + arma.tipo + " [potencia:" + arma.potencia + ", ataquesRestantes:" + arma.ataquesRestantes + "]";
    }
    return estado;
};
Vikingo.prototype.addArma = function(arma) {
    this.armas.push(arma);
};
Vikingo.prototype.abandonarArma = function(arma) {
    var indice = this.armas.indexOf(arma);
    var abandonadas = this.armas.splice(indice, 1);
    if (abandonadas[0] == this.armaElegida) {
        this.armaElegida = null;
    }
    console.log("    " + this.nombre + " ha abandonado su " + abandonadas[0].tipo);
};
Vikingo.prototype.elegirArma = function() {
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
Vikingo.prototype.robarDinero = function(vikingo) {
    this.dinero += vikingo.dinero;
    console.log(this.nombre + " ha robado " + vikingo.dinero + " monedas a " + vikingo.nombre);
    vikingo.dinero = 0;
};
Vikingo.prototype.robarArmas = function(vikingo) {
    if (vikingo.armas.length) {
        this.armas = this.armas.concat(vikingo.armas);
        console.log(this.nombre + " ha robado " + vikingo.armas.length + " armas a " + vikingo.nombre);
        vikingo.armas = [];
    }
};


/* ********** Clase Batalla ********** */
function Batalla(vikingo1, vikingo2) {
    this.vikingos = [vikingo1, vikingo2];
}
Batalla.prototype.iniciarPelea = function() {
    console.log("***** " + this.vikingos[0].nombre + " y " + this.vikingos[1].nombre + " entraran en batalla *****");
    console.log(this.vikingos[0].getEstado());
    console.log(this.vikingos[1].getEstado());

    var v1 = this.vikingos[0].velocidad;
    var v2 = this.vikingos[1].velocidad;
    var turno = v1 > v2 ? 0 : v1 < v2 ? 1 : Math.round(Math.random());

    var atacante;
    var atacado;

    while (this.vikingos[0].salud > 0 && this.vikingos[1].salud > 0) {
        atacante = this.vikingos[turno];
        atacado = this.vikingos[turno ? 0 : 1];
        atacante.ataca(atacado);
        turno = turno ? 0 : 1;
    }

    console.log("***** " + atacante.nombre + " ha ganado la batalla contra " + atacado.nombre + " *****");
    atacante.robarDinero(atacado);
    atacante.robarArmas(atacado);
    console.log(this.vikingos[0].getEstado());
    console.log(this.vikingos[1].getEstado());
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



/* ********** Declaramos los vikingos y sus armas ********** */

var erik = new Vikingo("Erik", saludMaxima, 18, 50);
erik.addArma(new Arma("maza", 40, 5));
erik.addArma(new Arma("hacha", 45, 5));
erik.addArma(new Arma("espada", 33, 10));

var olaf = new Vikingo("Olaf", saludMaxima, 20, 50);
olaf.addArma(new Arma("espada", 35, 8));
olaf.addArma(new Arma("hacha", 42, 8));
olaf.addArma(new Arma("cuchillo", 24, 10));


/* ********** Inicia la batalla ********** */

var batalla = new Batalla(erik, olaf);

batalla.iniciarPelea();



