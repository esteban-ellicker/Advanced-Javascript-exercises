/*
1) Realiza la modelización de un parque natural. Empieza con el siguiente código.

var parqueNatural = {
areas = [],
parqueDeBomberos = {}
}

En cada una de las áreas (añade 10 áreas) encontraremos un array de árboles (100 por área) y un array de visitantes (100 en todo el parque).
En el parque de bomberos encontraremos un array de bomberos (10) y posiblemente más propiedades que se te puedan ocurrir.
Los bomberos y los visitantes deberán heredar de la clase Persona.

2) Añade un método ejecutar ciclo que represente el paso de 1h en el parque.
Cada ciclo que pase debemos llamar a ejecutar ciclo de los visitantes que se irán cambiando de recinto de forma aleatorio.
Haz que el método se ejecute cada segundo.

3) En cada paso de un ciclo se puede originar un fuego (probabilidad del 5%) que empezaría quemando un arbol aleatorio dentro del parque.
Cada ciclo que pase el fuego se extenderá al arbol al arbol siguiente, si no hay arbol siguiente, deberá saltar al primer arbol del área siguiente.
Asi sucesivamente hasta expandirse por todo el parque. Cada ciclo que pase el fuego en los arboles, estos estarán un 10% más quemados.
Cuando lleguen al 100% de quemados, se habrá perdido el arbol. (Quitarlo del área).​



BONUS para el ejercicio 002__005


1) Añade un objeto viento​ (de clase viento), con el siguiente atributo:

Velocidad: Nula/Media/Alta

En cada ejecución el viento tendrá una velocidad aleatoria

Si la velocidad es nula el incendio se expandirá 1 arbol, si la velocidad es media: dos árboles, si la dirección es alta: 3 árboles.

2) Los incendios ya no se originan de forma aleatoria en cualquier parte del bosque.

Los incendios los pueden originar los visitantes que sean fumadores (2 de cada 10). En cada ciclo hay una probabilidad del 10% de que un
visitante fumador tire una colilla en el área en el que está y provoque un incendio.
 */


/* ********** funciones utilitarias ********** */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var nombres = ["Victor", "Omar", "Karen", "Ariel", "Omar", "David", "Esteban", "Matías", "Vlairner", "Lucy", "Ignacio", "Humberto", "Néstor", "Daniel", "Daniela", "Raymundo", "Fran", "Pedro", "Juan", "Juana", "Diego", "Marcelo", "Marcela", "Alberto", "Roberto", "Carlos", "Carla", "Angel", "Angelica", "Angela", "Miguel", "Adriano", "Ramon", "Luis", "Luisa", "Agustín", "Leonardo", "Héctor", "Gabriel", "Gabriela", "Antonio", "Antonia", "Armando", "Patricio", "Patricia", "Homero", "Temístocles", "Aristóteles", "Jorge", "Marcos", "Santiago", "Avelino", "Gilberto", "Bernardo", "Bernardita", "Alejandro", "Alejandra"];

function getNombreAleatorio() {
    return nombres[getRandomInt(0, nombres.length - 1)];
}

var nacionalidades = ["chileno", "argentino", "mexicano", "español", "venezolano", "colombiano"];

function getNacionalidadAleatorio() {
    return nacionalidades[getRandomInt(0, nacionalidades.length - 1)];
}

var especiesArbol = ["abedul", "acacia", "castaño", "roble", "sauce", "pino", "abeto", "álamo", "almendro", "araucaria", "arce", "avellano", "boldo", "canelo", "cedro", "ciprés", "encina", "espino", "eucalipto", "fresno", "haya", "higuera", "jacarandá", "laurel", "nogal", "olivo", "palma", "palmera", "quillay", "tamarindo", "tejo", "tilo"];

function getEspecieArbolAleatorio() {
    return especiesArbol[getRandomInt(0, especiesArbol.length - 1)];
}

/* ********** Clase Persona ********** */

function Persona(nombre, edad, nacionalidad, altura, peso, enfermo) {
    this.initPersona(nombre, edad, nacionalidad, altura, peso, enfermo);
}
Persona.prototype.initPersona = function(id, nombre, edad, nacionalidad, altura, peso, enfermo, fumador) {
    this.id = id || getRandomInt(1, Number.MAX_SAFE_INTEGER);
    this.nombre = nombre || getNombreAleatorio();
    this.edad = edad || getRandomInt(0, 100);
    this.nacionalidad = nacionalidad || getNacionalidadAleatorio();
    this.altura = altura || getRandomInt(160, 200);
    this.peso = peso || getRandomInt(70, 100);
    this.enfermo = enfermo || (getRandomInt(1, 10) == 1);
    this.fumador = fumador || (getRandomInt(1, 10) <= 2);
    this.emojis = this.fumador ? emojis.fumador : getEmojisPersonaAleatorio();
};
Persona.prototype.tirarColilla = function() {
    return this.fumador && getRandomInt(1, 10) == 1;
};

/* ********** Clase Visitante, extiende Persona ********** */

function Visitante(id, nombre, edad, nacionalidad, altura, peso, enfermo, numero) {
    this.initPersona(id, nombre, edad, nacionalidad, altura, peso, enfermo);
}
Visitante.prototype = new Persona();

/* ********** Clase Bombero, extiende Persona ********** */

function Bombero(id, nombre, edad, nacionalidad, altura, peso, enfermo) {
    this.initPersona(id, edad || getRandomInt(18, 35), nacionalidad, altura, peso, enfermo);
}
Bombero.prototype = new Persona();

/* ********** Clase ParqueDeBomberos ********** */
function ParqueDeBomberos() {
    this.bomberos = [];
    for (var i = 0; i < 10; i++) {
        this.bomberos.push(new Bombero(i));
    }
}

/* ********** Clase ParqueNatural ********** */
function ParqueNatural() {
    this.areas = [];
    this.incendios = [];
    this.viento = new Viento();
    this.parqueDeBomberos = new ParqueDeBomberos();
    for (var a = 1; a <= 10; a++) {
        this.areas.push(new Area(a));
    }
    for (var v = 1; v <= 100; v++) {
        this.addVisitante(new Visitante(v));
    }
}
ParqueNatural.prototype.addVisitante = function(visitante) {
    return this.getAreaAleatorio().addVisitante(visitante);
};
ParqueNatural.prototype.addIncendio = function(incendio, area, porColilla) {
    incendio = incendio || new Incendio(this, area, porColilla);
    return this.incendios.push(incendio);
};
ParqueNatural.prototype.getAreaPorId = function(id) {
    return this.areas.find(function(area) {
        return area.id == id;
    });
};
ParqueNatural.prototype.getSiguienteAreaPorId = function(id) {
    var area = this.areas.find(function(area) {
        return area.id > id;
    });
    if (!area) {
        area = this.areas[0];
    }
    return area;
};
ParqueNatural.prototype.getAreasConArboles = function(id) {
    return this.areas.filter(function(area) {
        return area.arboles.length !== 0;
    });
};
ParqueNatural.prototype.getAreaConArboles = function(id) {
    return this.areas.find(function(area) {
        return area.arboles.length !== 0;
    });
};
ParqueNatural.prototype.getAreasSinIncendio = function() { /**/
    return this.areas.filter(function(area) {
        return area.arboles.find(function(arbol) {
            return arbol.quemado === 0;
        });
    });
};
ParqueNatural.prototype.getAreaAleatorioSinIncendio = function() { /**/
    var areaAleatorio = null;
    var areasSinIncendio = this.getAreasSinIncendio();
    if (areasSinIncendio.length) {
        areaAleatorio = areasSinIncendio[getRandomInt(0, areasSinIncendio.length - 1)];
    }
    return areaAleatorio;
};
ParqueNatural.prototype.getAreaAleatorio = function() {
    var areaAleatorio = null;
    if (this.areas.length) {
        areaAleatorio = this.areas[getRandomInt(0, this.areas.length - 1)];
    }
    return areaAleatorio;
};
ParqueNatural.prototype.getAreaAleatorioConArboles = function() {
    var areaAleatorio = null;
    var areasConArboles = this.getAreasConArboles();
    if (areasConArboles.length) {
        areaAleatorio = areasConArboles[getRandomInt(0, areasConArboles.length - 1)];
    }
    return areaAleatorio;
};
ParqueNatural.prototype.getArbolAleatorio = function() {
    var arbolAleatorio = null;
    var areaAleatorio = this.getAreaAleatorioConArboles();
    if (areaAleatorio) {
        arbolAleatorio = areaAleatorio.getArbolAleatorio();
    }
    return arbolAleatorio;
};
ParqueNatural.prototype.getSiguienteArbol = function(arbol) {
    var area = this.getAreaPorId(arbol.idArea);
    var siguienteArbol = area.getSiguienteArbolPorId(arbol.id);
    if (!siguienteArbol) {
        area = this.getSiguienteAreaPorId(area.id);
        if (area) {
            siguienteArbol = area.getSiguienteArbolPorId(0);
        }
    }
    return siguienteArbol;
};
ParqueNatural.prototype.moverVisitantes = function() {
    var visitantes = [];
    for (var a = 0; a < this.areas.length; a++) {
        visitantes = visitantes.concat(this.areas[a].visitantes);
        this.areas[a].visitantes = [];
    }
    for (var v = 0; v < visitantes.length; v++) {
        this.addVisitante(visitantes[v]);
    }
};
ParqueNatural.prototype.addNuevosIncendios = function() {
    if (this.getAreaConArboles()) {
        // if (getRandomInt(1, 100) <= 5) {
        //     this.addIncendio();
        // }
        var filtroFumadores = function(visitante) {
            return visitante.fumador;
        };
        for (var a = 0; a < this.areas.length; a++) {
            var fumadores = this.areas[a].visitantes.filter(filtroFumadores);
            for (var i = 0; i < fumadores.length; i++) {
                if (fumadores[i].tirarColilla()) {
                    this.addIncendio(null, this.areas[a], true);
                }
            }
        }
    }
};
ParqueNatural.prototype.ejecutarCiclo = function() {
    this.viento.setVelocidadAleatoria();

    this.addNuevosIncendios();

    for (var i = 0; i < this.incendios.length; i++) {
        this.incendios[i].ejecutarCiclo(this);
    }

    this.moverVisitantes();

    this.imprimirEstado();
};
ParqueNatural.prototype.imprimirEstado = function() {
    console.log("----------------------------------------------------------------------");
    console.log((new Date()).toISOString());
    console.log("Velocidad viento: " + this.viento.velocidad);
    for (var a = 0; a < this.areas.length; a++) {
        this.areas[a].imprimirEstadoArea();
    }
};

/* ********** Clase Area ********** */
function Area(id) {
    this.id = id;
    this.arboles = [];
    this.visitantes = [];
    for (var i = 1; i <= 100; i++) {
        this.arboles.push(new Arbol(this.id * 1000 + i, this.id));
    }
}
Area.prototype.addVisitante = function(visitante) {
    return this.visitantes.push(visitante);
};
Area.prototype.quitarArbol = function(arbol) {
    var index = this.arboles.indexOf(arbol);
    this.arboles.splice(index, 1);
};
Area.prototype.getArbolPorId = function(id) {
    return this.arboles.find(function(arbol) {
        return arbol.id == id;
    });
};
Area.prototype.getSiguienteArbolPorId = function(id) {
    return this.arboles.find(function(arbol) {
        return arbol.id > id;
    });
};
Area.prototype.getArbolAleatorio = function() {
    var arbolAleatorio = null;
    if (this.arboles.length) {
        arbolAleatorio = this.arboles[getRandomInt(0, this.arboles.length - 1)];
    }
    return arbolAleatorio;
};
Area.prototype.imprimirEstadoArea = function() {
    var fuego = false;
    var estadoArea = "Área " + (this.id < 10 ? " " : "") + this.id + ": ";
    for (var i = 0; i < this.arboles.length; i++) {
        var arbol = this.arboles[i];
        estadoArea += arbol.ardiendo ? arbol.porColilla ? emojis.colilla + emojis.fuego : emojis.fuego : emojis.arbol;
        fuego = this.arboles[i].ardiendo || fuego;
    }
    estadoArea += "\n        ";
    var idEmoji = fuego ? "asustado" : this.arboles.length ? "feliz" : "molesto";
    for (var v = 0; v < this.visitantes.length; v++) {
        estadoArea += " " + this.visitantes[v].emojis[idEmoji];
    }
    console.log(estadoArea);
};

/* ********** Clase Arbol ********** */
function Arbol(id, idArea, especie) {
    this.id = id;
    this.idArea = idArea;
    this.especie = especie || getEspecieArbolAleatorio();
    this.quemado = 0;
    this.ardiendo = false;
}
Arbol.prototype.quemar = function(procentaje) {
    this.quemado += procentaje || 10;
    this.ardiendo = this.quemado > 0;
};

/* ********** Clase Incendio ********** */
function Incendio(parque, area, porColilla) {
    this.arboles = [];
    this.arbolesQuemados = 0;
    var arbol = area ? area.getArbolAleatorio() : parque.getArbolAleatorio();
    if (arbol) {
        arbol.porColilla = porColilla;
        this.addArbol(arbol);
        //console.log("Nuevo incendio " + arbol.id);
    }
}
Incendio.prototype.velocidades = { "nula": 1, "media": 2, "alta": 3 };
Incendio.prototype.addArbol = function(arbol) {
    arbol.ardiendo = true;
    return this.arboles.push(arbol);
};
Incendio.prototype.getUltimoArbol = function() {
    var ultimoArbol = null;
    if (this.arboles.length) {
        ultimoArbol = this.arboles[this.arboles.length - 1];
    }
    return ultimoArbol;
};
Incendio.prototype.propagar = function(parque) {
    var cantidad = this.velocidades[parque.viento.velocidad] || 1;
    for (var i = 0; i <= cantidad; i++) {
        var ultimoArbol = this.getUltimoArbol();
        if (ultimoArbol) {
            var siguienteArbol = parque.getSiguienteArbol(ultimoArbol);
            if (siguienteArbol && !siguienteArbol.ardiendo) {
                this.addArbol(siguienteArbol);
                console.log("Propagando al siguiente arbol " + siguienteArbol.id);
            }
        }
    }
};
Incendio.prototype.ejecutarCiclo = function(parque) {
    if (this.arboles.length) {
        for (var i = 0; i < this.arboles.length; i++) {
            var arbol = this.arboles[i];
            arbol.quemar(getRandomInt(5, 10));
            //console.log("Arbol quemandose " + arbol.id + ":" + arbol.quemado);
        }
        while (this.arboles.length && this.arboles[0].quemado >= 100) {
            var arbolQuemado = this.arboles.shift();
            parque.getAreaPorId(arbolQuemado.idArea).quitarArbol(arbolQuemado);
            //console.log("Arbol quemado " + arbolQuemado.id);
            this.arbolesQuemados++;
        }
        this.propagar(parque);
    }
};

/* ********** Clase Viento ********** */
function Viento(id, idArea, especie) {
    this.setVelocidadAleatoria();
    this.idArea = idArea;
    this.especie = especie || getEspecieArbolAleatorio();
    this.quemado = 0;
    this.ardiendo = false;
}
Viento.prototype.velocidades = ["nula", "media", "alta"];
Viento.prototype.setVelocidadAleatoria = function() {
    this.velocidad = this.velocidades[getRandomInt(0, this.velocidades.length - 1)];
};



var parqueNatural = new ParqueNatural();

var intervalID = setInterval(function() {
    if (parqueNatural.getAreaConArboles()) {
        parqueNatural.ejecutarCiclo();
    } else {
        clearInterval(intervalID);
    }
}, 1000);

// var timeoutId = setTimeout(function() {
//     clearInterval(intervalID);
// }, 30000);

//