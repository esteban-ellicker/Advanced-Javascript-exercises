/*
Ejercicio 002__006

(partir de lo desarrollado en el ejercicio anterior)

1) Añade un sensor de fuego a uno de cada 15 árboles de forma aleatoria.

En caso de quemarse un árbol con sensor, deberá emitir una notificación al pubsub (mediante evento) 

El parque de bomberos escuchará las notificación y mandará a todos los bomberos al área



2) Cada ciclo que pase un bombero en un área con árboles encendidos, podrá apagar el fuego de 2 árboles.

Cuando se apaguen todos los árboles de un área los bomberos regresarán al parque.



3) Cada ciclo que pase un árbol apagado, pero con quemaduras, este se deberá recuperar un 10% cada ciclo.



4) Añade cierta lógica en el parque de bomberos de manera que si hay más de un fuego, 

los bomberos se dividan entre las áreas afectadas. Para ello el parque tendrá que llevar control

del número de incendios que hay. Para registrarlos lo hará mediante la notificación emitida por los 

sensores. Para saber cuándo se han apagado, recibirán una señal del área indicando que ya está todo apagado.
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

function Persona(id, nombre, edad, nacionalidad, altura, peso, enfermo) {
    this.initPersona(id, nombre, edad, nacionalidad, altura, peso, enfermo);
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

function Visitante(id, nombre, edad, nacionalidad, altura, peso, enfermo, fumador) {
    this.initPersona(id, nombre, edad, nacionalidad, altura, peso, enfermo, fumador);
}
Visitante.prototype = new Persona();

/* ********** Clase Bombero, extiende Persona ********** */

function Bombero(id, nombre, edad, nacionalidad, altura, peso, enfermo) {
    this.initPersona(id, nombre, edad || getRandomInt(18, 40), nacionalidad, altura, peso, enfermo, false);
}
Bombero.prototype = new Persona();
//Cada ciclo que pase un bombero en un área con árboles encendidos, podrá apagar el fuego de 2 árboles.
Bombero.prototype.apagarArboles = function(arbolesArdiendo) {
    var arboles = arbolesArdiendo.splice(0, 2);
    for (var i = 0; i < arboles.length; i++) {
        console.log("Bombero " + this.nombre + " va a apagar el arbol " + arboles[i].id);
        arboles[i].apagar();
    }
    return arbolesArdiendo;
};

/* ********** Clase ParqueDeBomberos ********** */
function ParqueDeBomberos(centroControl, bomberosPorIncendio) {
    this.bomberos = [];
    this.bomberosPorIncendio = bomberosPorIncendio || 4;
    for (var i = 0; i < 10; i++) {
        this.addBombero(new Bombero(i));
    }

    var colaAlarmas = [];
    this.encolarAlarma = function(data) {
        var areaRepetida = colaAlarmas.find(function(dataEnCola) {
            return dataEnCola.area.id == data.area.id;
        });
        if (!areaRepetida) {
            console.log("Encolando notificación del sensor " + data.sensor.id + " fuego en el arbol " + data.arbol.id + " del area " + data.area.id);
            colaAlarmas.push(data);
        }
    };
    this.gestionarCola = function() {
        while (colaAlarmas.length && this.bomberos.length) {
            var alarma = null;
            do {
                alarma = colaAlarmas.shift();
            }
            while (alarma && alarma.area.getArbolesArdiendo().length === 0);

            if (alarma) {
                this.gestionarAlarma(alarma);
            }
        }
    };

    var esteParqueDeBomberos = this;
    //El parque de bomberos escucha la notificación y mandará bomberos al área
    centroControl.sub("fuego", function(data) {
        esteParqueDeBomberos.recibirAlarma(data);
    });
    //El parque de bomberos escucha la notificación y retorna bomberos del área
    centroControl.sub("apagado", function(data) {
        esteParqueDeBomberos.recibirApagado(data);
    });
}
ParqueDeBomberos.prototype.addBombero = function(bombero) {
    return this.bomberos.push(bombero);
};
ParqueDeBomberos.prototype.retornarBomberos = function(bomberos) {
    this.bomberos = this.bomberos.concat(bomberos);
};
ParqueDeBomberos.prototype.enviarBomberos = function(area) {
    if (area.bomberos.length) {
        console.log("Ya hay " + area.bomberos.length + " bomberos trabajndo en el area " + area.id);
    }
    if (area.bomberos.length < this.bomberosPorIncendio) {
        if (this.bomberos.length) {
            var bomberosSaliendo = this.bomberos.splice(0, this.bomberosPorIncendio - area.bomberos.length);
            console.log("Enviando " + bomberosSaliendo.length + " bomberos al area " + area.id);
            area.bomberos = area.bomberos.concat(bomberosSaliendo);
        } else {
            console.log("No hay bomberos disponibles para enviar al area " + area.id);
        }
    }
    return area.bomberos.length;
};
ParqueDeBomberos.prototype.recibirAlarma = function(data) {
    console.log("Se ha recibido notificación del sensor " + data.sensor.id + " fuego en el arbol " + data.arbol.id + " del area " + data.area.id);
    this.gestionarAlarma(data);
};
ParqueDeBomberos.prototype.gestionarAlarma = function(data) {
    console.log("Atendiendo notificación del sensor " + data.sensor.id + " fuego en el arbol " + data.arbol.id + " del area " + data.area.id);
    var bomberosEnviados = this.enviarBomberos(data.area);
    //Si no se han podido enviar bomberos o se han envido pocos, encolamos para mandar cuando haya disponibles
    if (bomberosEnviados < this.bomberosPorIncendio) {
        this.encolarAlarma(data);
    }
};
ParqueDeBomberos.prototype.recibirApagado = function(data) {
    console.log(data.area.bomberos.length + " bomberos se retiran del area " + data.area.id + " porque no hay más arboles ardiendo en el area");
    this.retornarBomberos(data.area.bomberos.splice(0));
};

/* ********** Clase ParqueNatural ********** */
function ParqueNatural() {
    this.areas = [];
    this.idIncendio = 0;
    this.incendios = [];
    this.viento = new Viento();
    this.centroControl = new CentroControl();
    this.parqueDeBomberos = new ParqueDeBomberos(this.centroControl);
    for (var idArea = 1; idArea <= 8; idArea++) {
        this.areas.push(new Area(idArea, this.centroControl));
    }
    for (var idVisita = 1; idVisita <= 100; idVisita++) {
        this.addVisitante(new Visitante(idVisita));
    }
}
ParqueNatural.prototype.addVisitante = function(visitante) {
    return this.getAreaAleatorio().addVisitante(visitante);
};
ParqueNatural.prototype.addIncendio = function(incendio, area, porColilla) {
    incendio = incendio || new Incendio(++this.idIncendio, this, area, porColilla);
    return this.incendios.push(incendio);
};
ParqueNatural.prototype.getAreaPorId = function(id) {
    return this.areas.find(function(area) {
        return area.id == id;
    });
};
ParqueNatural.prototype.getIncendioPorId = function(id) {
    return this.incendios.find(function(incendio) {
        return incendio.id == id;
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
ParqueNatural.prototype.getAreasConArbolesNoArdiendo = function() { /**/
    return this.areas.filter(function(area) {
        return area.arboles.find(function(arbol) {
            return !arbol.ardiendo;
        });
    });
};
ParqueNatural.prototype.getArealeatorioConArbolesNoArdiendo = function() { /**/
    var areaAleatorio = null;
    var areasCANA = this.getAreasConArbolesNoArdiendo();
    if (areasCANA.length) {
        areaAleatorio = areasCANA[getRandomInt(0, areasCANA.length - 1)];
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
ParqueNatural.prototype.getArbolAleatorioNoArdiendo = function() {
    var arbolAleatorio = null;
    var areaAleatorio = this.getArealeatorioConArbolesNoArdiendo();
    if (areaAleatorio) {
        arbolAleatorio = areaAleatorio.getArbolAleatorioNoArdiendo();
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
ParqueNatural.prototype.procesarIncendios = function() {
    //Agregar nuevos incedios
    if (this.getAreaConArboles()) {
        // if (getRandomInt(1, 100) <= 5) {
        //     this.addIncendio();
        // }
        var filtroFumadores = function(visitante) {
            return visitante.fumador;
        };
        for (var r = 0; r < this.areas.length; r++) {
            var fumadores = this.areas[r].visitantes.filter(filtroFumadores);
            for (var f = 0; f < fumadores.length; f++) {
                if (fumadores[f].tirarColilla()) {
                    this.addIncendio(null, this.areas[r], true);
                }
            }
        }
    }

    //Ejecutar ciclo de incendios activos
    this.incendios = this.incendios.filter(function(incendio) {
        return incendio.arboles.length;
    });
    for (var i = 0; i < this.incendios.length; i++) {
        this.incendios[i].ejecutarCiclo(this);
    }
};
ParqueNatural.prototype.ejecutarCiclo = function() {
    console.log("----------------------------------------------------------------------");
    console.log((new Date()).toISOString());
    this.viento.setVelocidadAleatoria();

    this.procesarIncendios();

    this.parqueDeBomberos.gestionarCola();

    //Ejecutar ciclo de areas
    for (var a = 0; a < this.areas.length; a++) {
        this.areas[a].ejecutarCiclo(this);
    }

    this.moverVisitantes();

    //this.logEstado();
    this.pintarEstadoParque();
};
ParqueNatural.prototype.logEstado = function() {
    for (var a = 0; a < this.areas.length; a++) {
        this.areas[a].logEstadoArea();
    }
};
ParqueNatural.prototype.pintarEstadoParque = function() {
    var contenidoParque = "";

    for (var i = 0; i < this.areas.length; i++) {
        var area = this.areas[i];
        contenidoParque = contenidoParque + area.getHTML();
    }

    var miparquehtml = document.getElementById("parque");
    miparquehtml.innerHTML = contenidoParque;
};

/* ********** Clase Area ********** */
function Area(id, centroControl) {
    this.id = id;
    this.arboles = [];
    this.visitantes = [];
    this.bomberos = [];
    for (var i = 1; i <= 100; i++) {
        this.arboles.push(new Arbol(this.id * 1000 + i, this, centroControl));
    }
    this.notificarApagado = function() {
        var data = {
            area: this
        };
        centroControl.pub("apagado", data);
    };
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
Area.prototype.getArbolAleatorioNoArdiendo = function() {
    var arbolAleatorio = null;
    var arboles = this.arboles.filter(function(arbol) {
        return !arbol.ardiendo;
    });
    if (arboles.length) {
        arbolAleatorio = arboles[getRandomInt(0, arboles.length - 1)];
    }
    return arbolAleatorio;
};
Area.prototype.getArbolesArdiendo = function() {
    return this.arboles.filter(function(arbol) {
        return arbol.ardiendo;
    });
};
Area.prototype.ejecutarCiclo = function(parque) {
    if (this.bomberos.length) {
        var arbolesArdiendo = this.getArbolesArdiendo();
        for (var b = 0; b < this.bomberos.length && arbolesArdiendo.length; b++) {
            arbolesArdiendo = this.bomberos[b].apagarArboles(arbolesArdiendo);
        }
        if (!arbolesArdiendo.length) {
            this.notificarApagado();
        }
    }
    for (var a = 0; a < this.arboles.length; a++) {
        var arbol = this.arboles[a];
        if (!arbol.ardiendo) {
            if (arbol.idIncendio) {
                var incendio = parque.getIncendioPorId(arbol.idIncendio);
                incendio.quitarArbol(arbol);
            } else {
                if (arbol.quemado > 0) {
                    arbol.recuperar();
                }
            }
        }
    }
};
Area.prototype.getEstadoArea = function() {
    var fuego = false;
    var estadoArea = "";
    for (var a = 0; a < this.arboles.length; a++) {
        var arbol = this.arboles[a];
        estadoArea += arbol.getEstado();
        fuego = arbol.ardiendo || fuego;
    }
    if (this.bomberos.length) {
        estadoArea += "\n        ";
        for (var b = 0; b < this.bomberos.length; b++) {
            estadoArea += " " + emojis.bombero;
        }
    }
    if (this.visitantes.length) {
        estadoArea += "\n        ";
        var idEmoji = fuego ? "asustado" : this.arboles.length ? "feliz" : "molesto";
        for (var v = 0; v < this.visitantes.length; v++) {
            estadoArea += " " + this.visitantes[v].emojis[idEmoji];
        }
    }
    return estadoArea;
};
Area.prototype.logEstadoArea = function() {
    console.log("Área " + (this.id < 10 ? " " : "") + this.id + ": " + this.getEstadoArea());
};
Area.prototype.getHTML = function() {
    var html = '<div class="area">';
    html = html + '<span class="areaInner">';
    html = html + this.getEstadoArea().replace(/\n/g, "<br>");
    html = html + '</span>';
    html = html + '</div>';

    return html;
};

/* ********** Clase Arbol ********** */
function Arbol(id, area, centroControl, especie) {
    this.id = id;
    this.idArea = area.id;
    this.idIncendio = null;
    this.especie = especie || getEspecieArbolAleatorio();
    this.quemado = 0;
    this.ardiendo = false;
    this.sensor = getRandomInt(1, 100) <= 15 ? new Sensor(area, this, centroControl) : null;
}
Arbol.prototype.encender = function() {
    this.ardiendo = true;
    if (this.sensor) {
        this.sensor.notificarFuego();
    }
};
Arbol.prototype.apagar = function() {
    this.ardiendo = false;
    this.porColilla = false;
};
Arbol.prototype.quemar = function(porcentaje) {
    this.quemado += porcentaje || getRandomInt(5, 10);
    if (this.quemado > 100) {
        this.quemado = 100;
    } else {
        if (this.quemado < 0) {
            this.quemado = 0;
        }
    }
};
Arbol.prototype.recuperar = function(porcentaje) {
    this.quemar(-(porcentaje || getRandomInt(5, 10)));
};
Arbol.prototype.getEstado = function() {
    var estado = "";
    if (this.ardiendo) {
        estado = this.quemado ? emojis.fuego : emojis.encendido;
        if (this.porColilla) {
            estado = emojis.colilla + estado;
        }
    } else {
        estado = this.sensor ? emojis.sensor : emojis.arbol;
        if (this.quemado) {
            estado = '<span style="filter: sepia(' + Math.round(this.quemado / 2 + 50) + '%);">' + estado + '</span><wbr>';
        }
    }
    return estado;
};

/* ********** Clase Incendio ********** */
function Incendio(id, parque, area, porColilla) {
    this.id = id;
    this.arboles = [];
    this.arbolesQuemados = 0;
    var arbol = area ? area.getArbolAleatorioNoArdiendo() : parque.getArbolAleatorioNoArdiendo();
    if (arbol) {
        console.log("Nuevo incendio en arbol " + arbol.id);
        arbol.porColilla = porColilla;
        this.addArbol(arbol);
    }
}
Incendio.prototype.velocidades = { "nula": 1, "media": 2, "alta": 3 };
Incendio.prototype.addArbol = function(arbol) {
    arbol.idIncendio = this.id;
    arbol.encender();
    return this.arboles.push(arbol);
};
Incendio.prototype.quitarArbol = function(arbol) {
    var index = this.arboles.indexOf(arbol);
    this.arboles.splice(index, 1);
    arbol.idIncendio = null;
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
    for (var i = 0; i < cantidad; i++) {
        var ultimoArbol = this.getUltimoArbol();
        if (ultimoArbol) {
            var siguienteArbol = parque.getSiguienteArbol(ultimoArbol);
            if (siguienteArbol && !siguienteArbol.ardiendo) {
                console.log("Propagando al siguiente arbol " + siguienteArbol.id);
                this.addArbol(siguienteArbol);
            }
        }
    }
};
Incendio.prototype.ejecutarCiclo = function(parque) {
    if (this.arboles.length) {
        for (var i = 0; i < this.arboles.length; i++) {
            var arbol = this.arboles[i];
            arbol.quemar();
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
    console.log("Velocidad viento: " + this.velocidad);
};

/* ********** Clase Sensor ********** */
function Sensor(area, arbol, centroControl) {
    this.id = arbol.id * 10 + 1;
    this.idArea = area.id;
    this.idArbol = arbol.id;
    //Emitir una notificación al pubsub (mediante evento) 
    this.notificarFuego = function() {
        var data = {
            sensor: this,
            area: area,
            arbol: arbol,
            time: Date.now()
        };
        centroControl.pub("fuego", data);
    };
}

/* ********** Clase CentroControl ********** */
function CentroControl() {
    var suscriptores = {};

    function subscribe(event, callback) {
        if (!suscriptores[event]) {
            var suscriptorArray = [callback];
            suscriptores[event] = suscriptorArray;
        } else {
            suscriptores[event].push(callback);
        }
    }

    function publish(event, data) {
        if (suscriptores[event]) {
            suscriptores[event].forEach(function(callback) {
                callback(data);
            });
        }
    }

    return {
        pub: publish,
        sub: subscribe
    };
}

var parqueNatural = new ParqueNatural();
window.onload = function() {
    parqueNatural.pintarEstadoParque();
};
var intervalID = null;

function abrirParque() {
    clearInterval(intervalID);
    intervalID = setInterval(function() {
        if (parqueNatural.getAreaConArboles()) {
            parqueNatural.ejecutarCiclo();
        } else {
            clearInterval(intervalID);
        }
    }, 1000);
}

function cerrarParque() {
    clearInterval(intervalID);
}

//abrirParque();

// var timeoutId = setTimeout(function() {
//     clearInterval(intervalID);
// }, 30000);

//