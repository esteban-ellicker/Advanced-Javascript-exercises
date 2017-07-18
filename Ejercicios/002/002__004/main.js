/*

Ejercicio 002__004


1) Define una clase Persona que tenga los siguientes atributos:

Nombre: 
Edad:
Nacionalidad:
Altura: 
Peso:
Enfermo: true/false

2) Definir la clase Jugador que herede de persona y tenga los siguientes atributos:

Posición: (portero/defensa/mediocentro/delantero)
Numero: 
Calidad: (0-100)

3) Definir la clase Equipo que tenga:

- Array de jugadores
- Entrenador 


4) Definir la clase Entrenador que herede de Persona y tenga los siguientes métodos:

- elegirPlantillaParaPartido() que elegirá de sus jugadores a los mejores para un partido:
    1 portero
    4 defensas
    4 mediocentros
    2 delanteros


Un equipo tendrá 22 jugadores creados aleatoriamente

La posición en la que juegan es completamente aleatoria

​El estar enfermo o no, es aleatorio (10% de probabilidad)



Lógica del partido:

Cada equipo hará 10 ataques que funcionarán de la siguiente manera

Por ejemplo:

Si ataca el equipo 1 se calculará:

A = (Suma de calidad de medio centros equipo 1) - (Suma de calidad de medio centros equipo 2)
B = (Suma de calidad de delanteros 1) - (Suma de calidad de defensas equipo 2)
C = A + B - (Suma de calidad de portero equipo B)
Fortuna = numero aleatorio entre 0 y 100

Para cada jugador que no esté en su puesto del equipo 1: 
C = C - 10

Para cada jugador que no esté en su puesto del equipo 2: 
C = C + 10

TOTAL = C + Fortuna

Si total es mayor que cero -> GOOOOOOOL
Si total es igual a cero -> PALO !!!
Si total es menor que cero -> Ná de ná​ 



 */

/* ********** constantes ********** */

var fortunaMin = 0;
var fortunaMax = 100;
var resultadoGol = 50;
var resultadoPalo = 0;

/* ********** funciones utilitarias ********** */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var nombres = ["Victor", "Omar", "Karen", "Ariel", "Omar", "David", "Esteban", "Matías", "Vlairner", "Lucy", "Ignacio", "Humberto", "Néstor", "Daniel", "Raymundo", "Fran", "Pedro", "Juan", "Diego", "Marcelo", "Alberto", "Roberto", "Carlos", "Angel", "Miguel", "Adriano", "Ramon", "Luis", "Agustín", "Leonardo", "Héctor", "Gabriel", "Antonio", "Armando", "Patricio", "Homero", "Temístocles", "Aristóteles", "Jorge", "Marcos", "Santiago", "Avelino", "Gilberto", "Bernardo"];

function getNombreAleatorio() {
    return nombres[getRandomInt(0, nombres.length - 1)];
}

var nacionalidades = ["chileno", "argentino", "mexicano", "español", "venezolano", "colombiano"];

function getNacionalidadAleatorio() {
    return nacionalidades[getRandomInt(0, nacionalidades.length - 1)];
}

var posiciones = ["portero", "defensa", "mediocentro", "delantero"];

function getPosicionAleatorio() {
    return posiciones[getRandomInt(0, posiciones.length - 1)];
}

var numeroJugador = 1;

function getNumeroJugador() {
    return numeroJugador++;
}

function getJugadoresAleatorios(candidad) {
    var jugadores = [];
    for (var i = 0; i < candidad; i++) {
        var jugador = new Jugador();
        jugadores.push(jugador);
    }
    return jugadores;
}

/* ********** Clase Persona ********** */

function Persona(nombre, edad, nacionalidad, altura, peso, enfermo) {
    this.initPersona(nombre, edad, nacionalidad, altura, peso, enfermo);
}
Persona.prototype.initPersona = function(nombre, edad, nacionalidad, altura, peso, enfermo) {
    this.nombre = nombre || getNombreAleatorio();
    this.edad = edad || getRandomInt(0, 100);
    this.nacionalidad = nacionalidad || getNacionalidadAleatorio();
    this.altura = altura || getRandomInt(160, 200);
    this.peso = peso || getRandomInt(70, 100);
    this.enfermo = enfermo || (getRandomInt(1, 10) == 1);
};

/* ********** Clase Jugador ********** */

function Jugador(nombre, edad, nacionalidad, altura, peso, enfermo, posicion, numero, calidad) {
    this.initPersona(nombre, getRandomInt(17, 35), nacionalidad, altura, peso, enfermo);
    this.posicion = posicion || getPosicionAleatorio();
    this.numero = numero || getNumeroJugador();
    this.calidad = calidad || getRandomInt(0, 100);
}
Jugador.prototype = new Persona();

/* ********** Clase Entrenador ********** */

function Entrenador(nombre, edad, nacionalidad, altura, peso, enfermo) {
    this.initEntrenador(nombre, edad, nacionalidad, altura, peso, enfermo);
}
Entrenador.prototype = new Persona();
Entrenador.prototype.initEntrenador = function(nombre, edad, nacionalidad, altura, peso, enfermo) {
    this.initPersona(nombre, edad || getRandomInt(30, 70), nacionalidad, altura, peso, enfermo);
    this.formacion = {
        porteros: 1,
        defensas: 4,
        mediocentros: 4,
        delanteros: 2,
        suplentes: 5
    };
};
Entrenador.prototype.elegirPlantillaParaPartido = function(equipo) {
    var plantilla = {
        nombre: equipo.nombre,
        porteros: [],
        defensas: [],
        mediocentros: [],
        delanteros: [],
        suplentes: []
    };
    var jugadores = equipo.jugadores;

    //Obtenemos la lista de jugadores disponibles
    var buscarSanos = function(jugador) {
        return !jugador.enfermo;
    };
    var jugadoresDisponibles = jugadores.filter(buscarSanos);

    //Ordenamos jugadores disponibles por calidad
    var comparadorCalidad = function(a, b) {
        return b.calidad - a.calidad;
    };
    jugadoresDisponibles.sort(comparadorCalidad);

    //Ponemos los jugadores que se pueda en su posición
    var buscarJugadoresIdoneos = function(lista, posicion, cantidad) {
        var buscarPosicion = function(jugador) {
            return jugador.posicion == posicion;
        };
        var jugadoresIdoneos = jugadoresDisponibles.filter(buscarPosicion);
        while (jugadoresIdoneos.length && lista.length < cantidad) {
            var jugador = jugadoresIdoneos.shift();
            if (jugador) {
                var indice = jugadoresDisponibles.indexOf(jugador);
                jugadoresDisponibles.splice(indice, 1);
                lista.push(jugador);
            }
        }
    };
    buscarJugadoresIdoneos(plantilla.porteros, "portero", this.formacion.porteros);
    buscarJugadoresIdoneos(plantilla.defensas, "defensa", this.formacion.defensas);
    buscarJugadoresIdoneos(plantilla.mediocentros, "mediocentro", this.formacion.mediocentros);
    buscarJugadoresIdoneos(plantilla.delanteros, "delantero", this.formacion.delanteros);

    buscarJugadoresIdoneos(plantilla.suplentes, "portero", 1);
    buscarJugadoresIdoneos(plantilla.suplentes, "defensa", 1);
    buscarJugadoresIdoneos(plantilla.suplentes, "mediocentro", 2);
    buscarJugadoresIdoneos(plantilla.suplentes, "delantero", 1);

    //Llenamos las posiciones con los jugadores que quedan
    var buscarJugadoresNoIdoneos = function(lista, cantidad) {
        while (jugadoresDisponibles.length && lista.length < cantidad) {
            var jugador = jugadoresDisponibles.shift();
            if (jugador) {
                lista.push(jugador);
            }
        }
    };
    buscarJugadoresNoIdoneos(plantilla.porteros, this.formacion.porteros);
    buscarJugadoresNoIdoneos(plantilla.defensas, this.formacion.defensas);
    buscarJugadoresNoIdoneos(plantilla.mediocentros, this.formacion.mediocentros);
    buscarJugadoresNoIdoneos(plantilla.delanteros, this.formacion.delanteros);
    buscarJugadoresNoIdoneos(plantilla.suplentes, this.formacion.suplentes);

    return plantilla;
};

/* ********** Clase EntrenadorOportunista ********** */

function EntrenadorOportunista(nombre, edad, nacionalidad, altura, peso, enfermo) {
    this.initEntrenador(nombre, edad, nacionalidad, altura, peso, enfermo);
}
EntrenadorOportunista.prototype = new Entrenador();
//Sobreescribe elegirPlantillaParaPartido de Entrenador
EntrenadorOportunista.prototype.elegirPlantillaParaPartido = function(equipo) {
    var plantilla = {
        nombre: equipo.nombre,
        porteros: [],
        defensas: [],
        mediocentros: [],
        delanteros: [],
        suplentes: []
    };
    var jugadores = equipo.jugadores;

    //Obtenemos la lista de jugadores disponibles
    var buscarSanos = function(jugador) {
        return !jugador.enfermo;
    };
    var jugadoresDisponibles = jugadores.filter(buscarSanos);

    //Ordenamos jugadores disponibles por calidad
    var comparadorCalidad = function(a, b) {
        return b.calidad - a.calidad;
    };
    jugadoresDisponibles.sort(comparadorCalidad);

    //Ponemos los 11 mejores jugadores disponibles en la posiciós que saben jugar
    for (var i = 0; i < 11; i++) {
        var jugador = jugadoresDisponibles.shift();
        switch (jugador.posicion) {
            case "portero":
                plantilla.porteros.push(jugador);
                break;
            case "defensa":
                plantilla.defensas.push(jugador);
                break;
            case "mediocentro":
                plantilla.mediocentros.push(jugador);
                break;
            case "delantero":
                plantilla.delanteros.push(jugador);
                break;
        }
    }
    //Llenamos la banca con los 5 mejores que queden
    for (var j = 0; j < 5; j++) {
        var suplente = jugadoresDisponibles.shift();
        plantilla.suplentes.push(suplente);
    }

    if (plantilla.porteros.length === 0) {
        //Si no hay portero buscamos al de menor calidad en las posiciones que tengan más de 3 jugadores
        if (plantilla.defensas.length > 3) {
            plantilla.porteros.push(plantilla.defensas.pop());
        } else {
            if (plantilla.mediocentros.length > 3) {
                plantilla.porteros.push(plantilla.mediocentros.pop());
            } else {
                plantilla.porteros.push(plantilla.delanteros.pop());
            }
        }
    } else {
        //Si hay más de un portero ponemos al de menor calidad en las posiciones que tengan menos de 3 jugadores
        while (plantilla.porteros.length > 1) {
            if (plantilla.defensas.length < 3) {
                plantilla.defensas.push(plantilla.porteros.pop());
            } else {
                if (plantilla.mediocentros.length < 3) {
                    plantilla.mediocentros.push(plantilla.porteros.pop());
                } else {
                    plantilla.delanteros.push(plantilla.porteros.pop());
                }
            }
        }
    }

    return plantilla;
};

/* ********** Clase EntrenadorFuerzaOfensiva ********** */

function EntrenadorFuerzaOfensiva(nombre, edad, nacionalidad, altura, peso, enfermo) {
    this.initEntrenador(nombre, edad, nacionalidad, altura, peso, enfermo);
    this.formacion = {
        porteros: 1,
        defensas: 2,
        mediocentros: 4,
        delanteros: 4,
        suplentes: 5
    };
}
EntrenadorFuerzaOfensiva.prototype = new Entrenador();
//Sobreescribe elegirPlantillaParaPartido de Entrenador
EntrenadorFuerzaOfensiva.prototype.elegirPlantillaParaPartido = function(equipo) {
    var plantilla = {
        nombre: equipo.nombre,
        porteros: [],
        defensas: [],
        mediocentros: [],
        delanteros: [],
        suplentes: []
    };
    var jugadores = equipo.jugadores;

    //Obtenemos la lista de jugadores disponibles
    var buscarSanos = function(jugador) {
        return !jugador.enfermo;
    };
    var jugadoresDisponibles = jugadores.filter(buscarSanos);

    //Ordenamos jugadores disponibles por calidad
    var comparadorCalidad = function(a, b) {
        return b.calidad - a.calidad;
    };
    jugadoresDisponibles.sort(comparadorCalidad);

    //Ponemos los 11 mejores jugadores disponibles llenando primero las posiciones ofensivas
    for (var i = 0; i < 11; i++) {
        var jugador = jugadoresDisponibles.shift();
        if (plantilla.delanteros.length < this.formacion.delanteros) {
            plantilla.delanteros.push(jugador);
        } else {
            if (plantilla.mediocentros.length < this.formacion.mediocentros) {
                plantilla.mediocentros.push(jugador);
            } else {
                if (plantilla.defensas.length < this.formacion.defensas) {
                    plantilla.defensas.push(jugador);
                } else {
                    plantilla.porteros.push(jugador);
                }
            }
        }
    }

    //Llenamos la banca con los 5 mejores que queden
    for (var j = 0; j < 5; j++) {
        plantilla.suplentes.push(jugadoresDisponibles.shift());
    }

    return plantilla;
};

/* ********** Clase Equipo ********** */

function Equipo(nombre, jugadores, entrenador) {
    this.initEquipo(nombre, jugadores, entrenador);
}
Equipo.prototype.initEquipo = function(nombre, jugadores, entrenador) {
    this.nombre = nombre || "";
    this.jugadores = jugadores || getJugadoresAleatorios(22);
    this.entrenador = entrenador || new Entrenador();
};

/* ********** Clase Partido ********** */

function Partido(equipo1, equipo2) {
    this.initPartido(equipo1, equipo2);
}
Partido.prototype.initPartido = function(equipo1, equipo2) {
    this.equipo1 = equipo1 || new Equipo("Equipo 1");
    this.equipo2 = equipo2 || new Equipo("Equipo 2");
    this.plantilla1 = null;
    this.plantilla2 = null;
};
Partido.prototype.pedirPlantillas = function() {
    this.plantilla1 = this.equipo1.entrenador.elegirPlantillaParaPartido(this.equipo1);
    this.plantilla2 = this.equipo2.entrenador.elegirPlantillaParaPartido(this.equipo2);
    this.plantilla1.goles = 0;
    this.plantilla2.goles = 0;
    this.plantilla1.expulsados = [];
    this.plantilla2.expulsados = [];
    //console.log("Plantilla 1 " + JSON.stringify(this.plantilla1));
    //console.log("Plantilla 2 " + JSON.stringify(this.plantilla2));
};
Partido.prototype.sumarCalidad = function(jugadores) {
    var suma = 0;
    for (var m = 0; m < jugadores.length; m++) {
        suma += jugadores[m].calidad;
    }
    return suma;
};
Partido.prototype.contarFueraDePosicion = function(plantilla, posicion) {
    var cuenta = 0;

    var contar = function(lista, posicion) {
        var buscarFueraDePosicion = function(jugador) {
            return jugador.posicion != posicion;
        };
        var jugadoresFueraDePosicion = lista.filter(buscarFueraDePosicion);
        return jugadoresFueraDePosicion.length;
    };
    cuenta += contar(plantilla.porteros, "portero");
    cuenta += contar(plantilla.defensas, "defensa");
    cuenta += contar(plantilla.mediocentros, "mediocentro");
    cuenta += contar(plantilla.delanteros, "delantero");

    return cuenta;
};
Partido.prototype.getAtacanteAleatorio = function(plantilla) {
    var jugadores = plantilla.delanteros.length ? plantilla.delanteros : plantilla.mediocentros.length ? plantilla.mediocentros : plantilla.defensas.length ? plantilla.defensas : plantilla.porteros;
    var jugador = jugadores[getRandomInt(0, jugadores.length - 1)];
    return jugador;
};
Partido.prototype.getDefiendeAleatorio = function(plantilla) {
    var jugadores = plantilla.defensas.length ? plantilla.defensas : plantilla.mediocentros.length ? plantilla.mediocentros : plantilla.porteros.length ? plantilla.porteros : plantilla.delanteros;
    var jugador = jugadores[getRandomInt(0, jugadores.length - 1)];
    return jugador;
};
Partido.prototype.faltas = function(plantillaAtaca, plantillaDefiende) {
    var resultado = {
        sancion: "",
        tarjeta: "",
        plantilla: null,
        jugador: null
    };
    var probabilidad = getRandomInt(-50, 50);
    if (probabilidad <= -40 || probabilidad >= 40) {
        resultado.sancion = getRandomInt(1, 100) == 1 ? "penal" : "tiro libre";
        var tarjeta = Math.abs(probabilidad);
        var roja = tarjeta >= 47;
        var amarilla = !roja && tarjeta >= 43;
        if (probabilidad <= -40) {
            //Falta del equipo que defiende
            resultado.plantilla = plantillaDefiende;
            resultado.jugador = this.getDefiendeAleatorio(plantillaDefiende);
        } else {
            if (probabilidad >= 40) {
                //Falta del equipo que ataca
                resultado.plantilla = plantillaAtaca;
                resultado.jugador = this.getAtacanteAleatorio(plantillaAtaca);
            }
        }
        console.log(resultado.jugador.nombre + " de " + resultado.plantilla.nombre + " ha comentido falta");
        if (amarilla) {
            resultado.tarjeta = "amarilla";
            resultado.jugador.amarillas = resultado.jugador.amarillas ? resultado.jugador.amarillas++ : 1;
            console.log("El arbitro le ha mostrado tarjeta amarilla a " + resultado.jugador.nombre);
            if (resultado.jugador.amarillas > 1) {
                roja = true;
                console.log(resultado.jugador.nombre + " ya tenía otra amarilla");
            }
        }
        if (roja) {
            resultado.tarjeta = "roja";
            resultado.jugador.roja = 1;
            if (resultado.plantilla == plantillaDefiende) {
                resultado.sancion = getRandomInt(1, 10) == 1 ? "penal" : resultado.sancion;
            }
            console.log("El arbitro le ha mostrado tarjeta roja a " + resultado.jugador.nombre);
            var indiceAmonestado = resultado.plantilla.delanteros.indexOf(resultado.jugador);
            if (indiceAmonestado != -1) {
                resultado.plantilla.delanteros.splice(indiceAmonestado, 1);
                console.log("La delantera de " + resultado.plantilla.nombre + " quedará con uno menos");
            } else {
                indiceAmonestado = resultado.plantilla.mediocentros.indexOf(resultado.jugador);
                if (indiceAmonestado != -1) {
                    resultado.plantilla.mediocentros.splice(indiceAmonestado, 1);
                    console.log("El medio campo de " + resultado.plantilla.nombre + " quedará con uno menos");
                } else {
                    indiceAmonestado = resultado.plantilla.defensas.indexOf(resultado.jugador);
                    if (indiceAmonestado != -1) {
                        resultado.plantilla.defensas.splice(indiceAmonestado, 1);
                        console.log("La defensa de " + resultado.plantilla.nombre + " quedará con uno menos");
                    } else {
                        //Es el portero!!!
                        resultado.plantilla.porteros.shit();
                        if (resultado.plantilla == plantillaDefiende) {
                            resultado.sancion = "penal";
                        }
                        var jugadoresAux = plantilla.defensas.length ? plantilla.defensas : plantilla.mediocentros.length ? plantilla.mediocentros : plantilla.delanteros;
                        var porteroAux = jugadoresAux.pop();
                        resultado.plantilla.porteros.push(porteroAux);
                        console.log("El portero de " + resultado.plantilla.nombre + " tendrá que salir");
                        console.log(porteroAux.nombre + " se quedará en la portería de " + resultado.plantilla.nombre);
                    }
                }
            }
            resultado.plantilla.expulsados.push(resultado.jugador);
            console.log(resultado.jugador.nombre + " se ha ido a las duchas");
        }
        console.log("El arbitro ha sancionado " + resultado.sancion + " para " + (resultado.plantilla == plantillaAtaca ? plantillaDefiende.nombre : plantillaAtaca.nombre));
    }
    return resultado;
};
Partido.prototype.ataque = function(plantillaAtaca, plantillaDefiende) {
    var resultado = 0;

    console.log("¡Atacando " + plantillaAtaca.nombre + "!");

    // Fortuna = numero aleatorio entre 0 y 100
    var fortuna = getRandomInt(fortunaMin, fortunaMax);

    var falta = this.faltas(plantillaAtaca, plantillaDefiende);
    //console.log(JSON.stringify(falta));
    if (falta.sancion) {
        if (falta.plantilla == plantillaDefiende) {
            fortuna = falta.sancion == "penal" ? fortunaMax : falta.tarjeta == "roja" ? (fortuna + fortunaMax) / 2 : (fortuna + fortunaMax * 3) / 4;
        } else {
            if (falta.plantilla == plantillaAtaca) {
                fortuna = falta.tarjeta == "roja" ? fortunaMin : (fortuna + fortunaMin) / 2;
            }
        }
    }

    // A = (Suma de calidad de medio centros equipo 1) - (Suma de calidad de medio centros equipo 2)
    var a = this.sumarCalidad(plantillaAtaca.mediocentros) - this.sumarCalidad(plantillaDefiende.mediocentros);
    // B = (Suma de calidad de delanteros 1) - (Suma de calidad de defensas equipo 2)
    var b = this.sumarCalidad(plantillaAtaca.delanteros) - this.sumarCalidad(plantillaDefiende.defensas);
    // C = A + B - (Suma de calidad de portero equipo B)
    var c = a + b - this.sumarCalidad(plantillaDefiende.porteros);

    // Para cada jugador que no esté en su puesto del equipo 1: 
    // C = C - 10
    c = c - this.contarFueraDePosicion(plantillaAtaca) * 10;

    // Para cada jugador que no esté en su puesto del equipo 2: 
    // C = C + 10
    c = c - this.contarFueraDePosicion(plantillaDefiende) * 10;

    // TOTAL = C + Fortuna
    var total = c + fortuna;

    if (total >= resultadoGol) {
        if (falta.plantilla == plantillaAtaca) {
            console.log("¡" + plantillaAtaca.nombre + " ha recuperado el balon y ataca nuevamente!");
        }
        // Si total es mayor que cero -> GOOOOOOOL
        console.log("    ¡¡¡ GOOOOOOOL !!!    (" + total + ")");
        resultado = 1;

        //Calculamos el goleador aleatoriamente
        var goleador = this.getAtacanteAleatorio(plantillaAtaca);
        goleador.goles = goleador.goles ? goleador.goles + 1 : 1;
        plantillaAtaca.goles = plantillaAtaca.goles ? plantillaAtaca.goles + 1 : 1;
        console.log(goleador.nombre + " ha marcado para " + plantillaAtaca.nombre + "!!!");
    } else {
        if (total >= resultadoPalo) {
            // Si total es igual a cero -> PALO !!!
            console.log("    ¡¡¡ PALO !!!    (" + total + ")");
        } else {
            // Si total es menor que cero -> Ná de ná​ 
            console.log("    Ná de ná​    (" + total + ")");
        }
    }
    console.log("Marcador: " + this.getMarcador());
    return resultado;
};
Partido.prototype.getMarcador = function() {
    return this.plantilla1.nombre + ": " + this.plantilla1.goles + ", " + this.plantilla2.nombre + ": " + this.plantilla2.goles;
};
Partido.prototype.jugar = function() {
    console.log("****** Incia el partido ente " + this.plantilla1.nombre + " y " + this.plantilla2.nombre + " ******");
    for (var turno = 0; turno < 10; turno++) {
        this.ataque(this.plantilla1, this.plantilla2);
        this.ataque(this.plantilla2, this.plantilla1);
    }

    if (this.plantilla1.goles > this.plantilla2.goles) {
        console.log("****** Equipo1 ha ganado!!! ******");
    } else {
        if (this.plantilla1.goles < this.plantilla2.goles) {
            console.log("****** Equipo2 ha ganado!!! ******");
        } else {
            console.log("****** Ha sido empate!!! ******");
        }
    }

    var reportarGoleadores = function(equipo, nombre) {
        var buscarGoleadores = function(jugador) {
            return jugador.goles;
        };
        var ordenarPorGoles = function(a, b) {
            return b.goles - a.goles;
        };
        var goleadores = equipo.jugadores.filter(buscarGoleadores);
        if (goleadores.length) {
            goleadores.sort(ordenarPorGoles);
            console.log("  Goleadores " + equipo.nombre + ":");
            for (var i = 0; i < goleadores.length; i++) {
                var jugador = goleadores[i];
                console.log("    " + jugador.nombre + " (" + jugador.posicion + "): " + jugador.goles);
            }
        }
    };
    reportarGoleadores(equipo1);
    reportarGoleadores(equipo2);
};

/*

Lógica del partido:

Cada equipo hará 10 ataques que funcionarán de la siguiente manera

Por ejemplo:

Si ataca el equipo 1 se calculará:

A = (Suma de calidad de medio centros equipo 1) - (Suma de calidad de medio centros equipo 2)
B = (Suma de calidad de delanteros 1) - (Suma de calidad de defensas equipo 2)
C = A + B - (Suma de calidad de portero equipo B)
Fortuna = numero aleatorio entre 0 y 100

Para cada jugador que no esté en su puesto del equipo 1: 
C = C - 10

Para cada jugador que no esté en su puesto del equipo 2: 
C = C + 10

TOTAL = C + Fortuna

Si total es mayor que cero -> GOOOOOOOL
Si total es igual a cero -> PALO !!!
Si total es menor que cero -> Ná de ná​ 
 */


/* ********** creamos un Equipo ********** */

var equipo1 = new Equipo("Equipo 1");
equipo1.entrenador = new EntrenadorFuerzaOfensiva();

var equipo2 = new Equipo("Equipo 2");
equipo2.entrenador = new EntrenadorOportunista();


var partido = new Partido(equipo1, equipo2);
partido.pedirPlantillas();
partido.jugar();

console.log(partido);




//