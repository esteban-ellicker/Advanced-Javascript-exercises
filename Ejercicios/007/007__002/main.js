/*
Ejercicio 007__002

Partiendo del ejercicio anterior...

En primer lugar vamos a olvidar la parte de Motocicleta: usaremos directamente la clase Coche. Puedes eliminar las imágenes de las motocicletas.

Realiza un formulario para recoger los datos de un vehículo. Añade al formulario un botón añadir que creará un nuevo vehículo a partir de los datos del formulario y lo añadirá a nuestro objeto carrera.

El formulario tendrá:
3 selects: Marca, Modelo, Imagen. 
1 input: VelocidadMaxima
2 Botones: AñadirVehículo e IniciarCarrera

Haz que se puedan añadir tantos vehículos como se deseen (no solo dos).

Añade un botón IniciarCarrera que hará que la carrera comience y se muevan todos los vehículos que se hayan añadido previamente. 

 */


/* ********** Configuracion ********** */

var config = {
    distancia: 200,
    tiempoCiclo: 97, //en milisegundos
    minVelocidadMaxima: 100, //en Kmh
    maxVelocidadMaxima: 200,
    minAceleracion: 5, //en Kmh por segundo
    maxAceleracion: 20
};


/* ********** Funciones Utilitarias ********** */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var imagenesVehiculo = ["vehiculo1.png", "vehiculo2.png", "vehiculo3.png", "vehiculo4.png", "vehiculo5.png", "vehiculo6.png", "vehiculo7.png", "vehiculo8.png", "vehiculo9.png", "vehiculo10.png"];

function getImagenVehiculoAleatorio() {
    return imagenesVehiculo[getRandomInt(0, imagenesVehiculo.length)];
}

var imagenesCoche = imagenesVehiculo.slice(0, 6);

function getImagenCocheAleatorio() {
    return imagenesCoche[getRandomInt(0, imagenesCoche.length)];
}

var imagenesMotocicleta = imagenesVehiculo.slice(6, 9);

function getImagenMotocicletaAleatorio() {
    return imagenesMotocicleta[getRandomInt(0, imagenesMotocicleta.length)];
}

var marcas = ["Alfa Romeo", "Aston Martin", "Audi", "Bentley", "Bmwbyd", "Chevrolet", "Citroen", "Dacia", "Dfsk", "Ds", "Ferrari", "Fiat", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", "Kia", "Lamborghini", "Lancia", "Land Rover", "Lexus", "Mahindra", "Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi", "Morgan", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Rolls-Royce", "Seat", "Skoda", "Smart", "Ssangyong", "Subaru", "Suzuki", "Tata", "Tesla", "Toyota", "Volkswagen", "Volvo"];

function getMarcaAleatorio() {
    return marcas[getRandomInt(0, marcas.length - 1)];
}

var modelos = ["Spider", "Giulietta", "MiTo", "4C", "Giulia", "Stelvio", "DB9", "Vantage V8", "Vanquish", "Vantage V12", "Rapide", "A4", "A8", "A3", "TT", "A5", "A6", "A7", "Q3", "Q5", "S5", "A1", "S7", "S6", "S8", "RS4", "RS5", "R8", "SQ5", "Q7", "RS6", "RS7", "S3", "S1", "TTS", "S4", "RS3", "SQ7", "Q2", "TTS", "SQ7", "S4", "Continental GT", "Mulsanne", "Flying Spur", "Continental GTC", "Bentayga", "Cruze", "Aveo", "Trax", "Orlando", "Spark", "Camaro", "C4", "C3", "C5", "C3 Picasso", "C4 Picasso", "Grand C4 Picasso", "C4 Aircross", "Nemo", "Berlingo", "C-Elysée", "C4 Cactus", "C1", "C-Zero", "C-Elysée", "Spacetourer", "E-Mehari", "Logan", "Lodgy", "Sandero", "Duster", "Dokker", "488", "GTC4", "California", "F12", "458", "FF", "F12", "California", "488", "Freemont", "Doblò", "Punto", "Panda", "500", "500L", "500L", "500X", "Qubo", "Fiorino", "Bravo", "Doblò", "Doblò", "500C", "Tipo", "124 Spider", "C-Max", "Fiesta", "Focus", "Mondeo", "Ka", "S-MAX", "B-MAX", "Grand C-Max", "Tourneo Custom", "Kuga", "Galaxy", "Grand Tourneo Connect", "Tourneo Connect", "EcoSport", "Tourneo Courier", "Mustang", "Transit Connect", "Edge", "Ka+", "Accord", "Jazz", "Civic", "CR-V", "HR-V", "I20", "Ix35", "Ix20", "I10", "Santa Fe", "Veloster", "I40", "Elantra", "I30", "Grand Santa Fe", "Genesis", "H-1 Travel", "Tucson", "I20 Active", "XF", "Serie XK", "F-Type", "XJ", "XE", "F-Pace", "Grand Cherokee", "Wrangler Unlimited", "Cherokee", "Wrangler", "Renegade", "Compass", "Renegade", "Wrangler", "Cherokee", "Picanto", "Rio", "Sportage", "Venga", "Optima", "Cee'd", "Cee'd Sportswagon", "Carens", "Pro_cee'd", "Sorento", "Soul", "Niro", "Soul EV", "Pro_cee'd GT", "Aventador", "Huracán", "Ypsilon", "Voyager", "Delta", "Thema", "Defender", "Discovery 4", "Range Rover", "Range Rover Evoque", "Freelander", "Range Rover Sport", "Discovery Sport", "Discovery", "Range Rover Velar", "GS", "RX", "CT", "IS", "NX", "RC", "LS", "LC", "XUV500", "GranCabrio", "Quattroporte", "Ghibli", "GranTurismo", "Levante", "Mazda2", "CX-5", "Mazda6", "MX-5", "Mazda3", "Mazda5", "CX-9", "CX-3", "Clase SL", "Clase SLK", "Clase V", "Clase C", "Clase M", "Clase G", "Clase E", "Clase CL", "Clase S", "Clase GLK", "SLS AMG", "Clase B", "Clase A", "Clase GL", "Clase CLS", "Clase CLA", "Clase GLA", "Vito", "Clase GLE Coupé", "Clase GLE", "Clase GLE Coupé", "Clase GLK", "Clase GLC", "Citan", "Clase GLS", "Clase SLC", "GLC Coupé", "Mercedes-AMG GT", "Montero", "I-MiEV", "ASX", "Outlander", "Space Star", "L200", "Roadster", "Plus 8", "Plus 4", "4/4", "X-TRAIL", "QASHQAI", "NOTE", "LEAF", "Pathfinder", "EVALIA", "Navara", "Micra", "JUKE", "370Z", "NV200", "GT-R", "PULSAR", "Murano", "NV200 EVALIA", "E-NV200 EVALIA", "Corsa", "Astra", "Meriva", "Zafira Tourer", "Zafira", "Insignia", "Combo", "Ampera", "Mokka", "Adam", "Cabrio", "Antara", "Karl", "GTC", "GTC", "Mokka", "Zafira", "Crossland X", "Mokka X", "308", "807", "Bipper", "508", "Partner", "3008", "208", "2008", "RCZ", "5008", "4008", "108", "207", "Ion", "Traveller", "911", "Boxster", "Cayenne", "Panamera", "918", "Macan", "Cayman", "718", "Fluence", "Grand Scénic", "Latitude", "Clio", "Scénic", "Laguna", "Kangoo Combi", "Mégane", "Grand Kangoo Combi", "Captur", "ZOE", "Koleos", "Twingo", "Espace", "Kadjar", "Talisman", "Phantom", "Ibiza", "Nuevo León", "Alhambra", "Altea", "Mii", "Toledo", "Altea XL", "Ateca", "León", "Nuevo Ibiza", "Octavia", "Fabia", "Roomster", "Yeti", "Superb", "Citigo", "Rapid", "Spaceback", "Scout", "Kodiaq", "Fortwo", "Forfour", "Rexton", "Rodius", "Korando", "Actyon Sports Pick Up", "Tivoli", "XLV", "Forester", "XV", "Outback", "BRZ", "WRX STI", "LEVORG", "WRX STI", "Grand Vitara", "Swift", "SX4", "Jimny", "SX4 S-Cross", "Celerio", "Kizashi", "Vitara", "Baleno", "Ignis", "Aria", "Vista", "Model X", "Model S", "Avensis", "Land Cruiser", "Yaris", "Verso", "Auris", "Prius+", "GT86", "Prius", "Rav4", "Aygo", "Hilux", "Land Cruiser 200", "Proace Verso", "C-HR", "Polo", "Jetta", "Phaeton", "Golf", "Touran", "Touareg", "Beetle", "Sharan", "Tiguan", "Multivan", "California", "Caravelle", "Up!", "CC", "Golf Sportsvan", "Amarok", "Caddy", "Transporter", "Scirocco", "Passat", "Eos", "Arteon", "V70", "S80", "XC70", "V60", "S60", "XC90", "XC60", "V40", "V40 Cross Country", "V60 Cross Country", "S60 Cross Country", "S90", "V90", "V90 Cross Country"];

function getModeloAleatorio() {
    return modelos[getRandomInt(0, modelos.length - 1)];
}

function getVelocidadMaximaAleatoria() {
    return getRandomInt(config.minVelocidadMaxima, config.maxVelocidadMaxima);
}

function getAceleracionAleatoria() {
    return getRandomInt(config.minAceleracion, config.maxAceleracion);
}

function getMetrosQueAvanzaCadaSegundo(velocidadEnKmh) {
    var metros = velocidadEnKmh * 1000 / 3600;
    return metros;
}


function agregarOpcionesDesdeLista(select, lista) {
    for (var i = 0; i < lista.length; i++) {
        var option = document.createElement("option");
        option.value = lista[i];
        option.text = lista[i];
        select.add(option);
    }
}


/* ********** Clase Vehiculo ********** */

function Vehiculo(id, marca, modelo, velocidadMaxima, aceleracion, imagen) {
    this.initVehiculo(id, marca, modelo, velocidadMaxima, aceleracion, imagen);
}
Vehiculo.prototype.initVehiculo = function(id, marca, modelo, velocidadMaxima, aceleracion, imagen) {
    this.id = id || getRandomInt(1, Number.MAX_SAFE_INTEGER);
    this.marca = marca || getMarcaAleatorio();
    this.modelo = modelo || getModeloAleatorio();
    this.velocidadMaxima = velocidadMaxima || getVelocidadMaximaAleatoria();
    this.aceleracion = aceleracion || getAceleracionAleatoria();
    this.imagen = imagen || getImagenVehiculoAleatorio();
    this.velocidadActual = 0;
    this.recorrido = 0;
};


/* ********** Clase Motocicleta, extiende Vehiculo ********** */

function Motocicleta(id, marca, modelo, velocidadMaxima, aceleracion, imagen) {
    this.initVehiculo(id, marca, modelo, velocidadMaxima, aceleracion, imagen || getImagenMotocicletaAleatorio());
}
Motocicleta.prototype = new Vehiculo();


/* ********** Clase Coche, extiende Vehiculo ********** */

function Coche(id, marca, modelo, velocidadMaxima, aceleracion, imagen) {
    this.initVehiculo(id, marca, modelo, velocidadMaxima, aceleracion, imagen || getImagenCocheAleatorio());
}
Coche.prototype = new Vehiculo();


/* ********** Clase Carrera ********** */
function Carrera(vehiculos, distancia, tiempoCiclo) {
    this.vehiculos = vehiculos || [];
    this.distancia = distancia || config.distancia;
    this.tiempoCiclo = tiempoCiclo || config.tiempoCiclo;
    this.ciclo = 0;
    this.meta = [];
    this.intervalID = null;
    this.divCircuito = null;
    this.divPodio = null;
}
Carrera.prototype.setDivs = function(idCircuito, idPodio) {
    this.divCircuito = document.getElementById(idCircuito);
    this.divPodio = document.getElementById(idPodio);
};
Carrera.prototype.addVehiculo = function(vehiculo) {
    return this.vehiculos.push(vehiculo || new Vehiculo());
};
Carrera.prototype.pintarLargada = function() {
    if (!this.divCircuito) {
        throw "El div contenedor del circuito no se encuentra";
    }
    var html = "";
    for (var i = 0; i < this.vehiculos.length; i++) {
        var vehiculo = this.vehiculos[i];
        html += '<div class="pista"><img class="vehiculo" id="vehiculo' + i + '" src="' + vehiculo.imagen + '" title="' + vehiculo.marca + ' ' + vehiculo.modelo + '"/></div>';
    }
    this.divCircuito.innerHTML = html;
};
Carrera.prototype.pintarAvance = function() {
    var lengthCircuito = this.divCircuito.offsetWidth - 174;
    for (var i = 0; i < this.vehiculos.length; i++) {
        var avanceVehiculo = Math.round(this.vehiculos[i].recorrido * lengthCircuito / this.distancia);
        var imgVehiculo = document.getElementById("vehiculo" + i);
        imgVehiculo.style = "margin-left:" + avanceVehiculo + "px;";
    }
};
Carrera.prototype.pintarPodio = function() {
    if (!this.divPodio) {
        throw "El div contenedor del podio no se encuentra";
    }
    var html = "<table>";
    html += '<tr class="vehiculo-podio"><th>Posicion</th><th>tiempo (s)</th><th>Imagen</th><th>Marca</th><th>Modelo</th><th>Velocidad (Km/h)</th><th>Aceleración (Km/h/s)</th></tr>';
    var cicloAnt = 0;
    var posicion = 0;
    for (var m = 0; m < this.meta.length; m++) {
        if (cicloAnt != this.meta[m].ciclo) {
            posicion++;
        }
        var vehiculo = this.vehiculos[this.meta[m].indice];
        html += '<tr class="vehiculo-podio"><td class="posicion">' + posicion + '</td><td class="ciclo">' + (this.meta[m].ciclo * this.tiempoCiclo / 1000).toFixed(2) + '</td><td><img class="vehiculo" src="' + vehiculo.imagen + '"/></td><td>' + vehiculo.marca + '</td><td>' + vehiculo.modelo + '</td><td class="velocidad">' + vehiculo.velocidadMaxima + '</td><td class="aceleracion">' + vehiculo.aceleracion + '</td></tr>';
        cicloAnt = this.meta[m].ciclo;
    }
    html += "</table>";
    this.divPodio.innerHTML = html;
    document.body.scrollTop = this.divCircuito.scrollHeight;
};
Carrera.prototype.ejecutarCiclo = function() {
    var factorCiclo = this.tiempoCiclo / 1000;
    this.ciclo++;
    for (var i = 0; i < this.vehiculos.length; i++) {
        if (this.vehiculos[i].recorrido < this.distancia) {
            var vehiculo = this.vehiculos[i];
            vehiculo.velocidadActual += vehiculo.velocidadActual + vehiculo.aceleracion * factorCiclo;
            if (vehiculo.velocidadActual > vehiculo.velocidadMaxima) {
                vehiculo.velocidadActual = vehiculo.velocidadMaxima;
            }
            vehiculo.recorrido += getMetrosQueAvanzaCadaSegundo(vehiculo.velocidadActual) * factorCiclo;
            if (vehiculo.recorrido >= this.distancia) {
                vehiculo.recorrido = this.distancia;
                this.meta.push({ indice: i, ciclo: this.ciclo });
            }
            console.log("c: " + this.ciclo + ", v: " + i + ", r: " + vehiculo.recorrido.toFixed(3) + ", m: " + vehiculo.marca);
        }
    }
    if (this.meta.length == this.vehiculos.length) {
        clearInterval(this.intervalID);
        console.log("t: " + this.ciclo);
        var primerciclo = this.meta[0].ciclo;
        for (var m = 0; m < this.meta.length; m++) {
            var vehiculom = this.vehiculos[this.meta[m].indice];
            console.log("d: " + (primerciclo - this.meta[m].ciclo) + ", c: " + this.meta[m].ciclo + ", v: " + this.meta[m].indice + ", m: " + vehiculom.marca);
        }
        this.pintarPodio();
    }
    this.pintarAvance();
};
Carrera.prototype.iniciarCarrera = function() {
    this.ciclo = 0;
    this.meta = [];
    for (var i = 0; i < this.vehiculos.length; i++) {
        this.vehiculos[i].velocidadActual = 0;
        this.vehiculos[i].recorrido = 0;
    }

    this.pintarLargada();

    var carrera = this;
    this.intervalID = setInterval(function() {
        carrera.ejecutarCiclo();
    }, this.tiempoCiclo);
};



/* ********** Funciones para Controles ********** */


function initControles(carrera) {

    var mostrarMensajes = function(mensajes) {
        divMensajes.innerHTML = mensajes.join("<br>");
        divMensajes.style = "display: block;";
    };

    var ocultarMensajes = function() {
        divMensajes.style = "";
    };

    var selectMarca = document.getElementById("marca");
    var selectModelo = document.getElementById("modelo");
    var selectImagen = document.getElementById("imagen");
    var imagen = document.getElementById("src-imagen");
    var inputVelMax = document.getElementById("velmax");
    var inputVelMaxAleatoria = document.getElementById("velmax-aleatoria");
    var inputAceleracion = document.getElementById("aceleracion");
    var inputAceleracionAleatoria = document.getElementById("aceleracion-aleatoria");
    var addButton = document.getElementById("add-button");
    var randomButton = document.getElementById("random-button");
    var startButton = document.getElementById("start-button");
    var divMensajes = document.getElementById("mensajes");

    agregarOpcionesDesdeLista(selectMarca, marcas);
    agregarOpcionesDesdeLista(selectModelo, modelos);
    agregarOpcionesDesdeLista(selectImagen, imagenesCoche);

    imagen.src = imagenesCoche[0];
    selectImagen.onchange = function() {
        imagen.src = this.value;
    };

    inputVelMax.min = config.minVelocidadMaxima;
    inputVelMax.max = config.maxVelocidadMaxima;
    inputAceleracion.min = config.minAceleracion;
    inputAceleracion.max = config.maxAceleracion;

    addButton.onclick = function() {
        ocultarMensajes();
        var mensajes = [];

        var id = null; //lo dejanos en null para que lo calcule aleatoriamente
        var marca = selectMarca.value;
        var modelo = selectModelo.value;
        var velMax = inputVelMaxAleatoria.checked ? getVelocidadMaximaAleatoria() : parseInt(inputVelMax.value, 10);
        var aceleracion = inputAceleracionAleatoria.checked ? getAceleracionAleatoria() : parseInt(inputAceleracion.value, 10);
        var imagen = selectImagen.value;

        if (Number.isNaN(velMax) || velMax < config.minVelocidadMaxima || velMax > config.maxVelocidadMaxima) {
            mensajes.push("Velocidad Máxima debe ser un número entre " + config.minVelocidadMaxima + " y " + config.maxVelocidadMaxima);
        }

        if (Number.isNaN(aceleracion) || aceleracion < config.minAceleracion || aceleracion > config.maxAceleracion) {
            mensajes.push("Aceleración debe ser un número entre " + config.minAceleracion + " y " + config.maxAceleracion);
        }

        if (mensajes.length) {
            mostrarMensajes(mensajes);
        } else {
            var coche = new Coche(id, marca, modelo, velMax, aceleracion, imagen);
            carrera.addVehiculo(coche);
            carrera.pintarLargada();
        }
    };

    randomButton.onclick = function() {
        selectMarca.selectedIndex = getRandomInt(0, selectMarca.options.length - 1);
        selectModelo.selectedIndex = getRandomInt(0, selectModelo.options.length - 1);
        selectImagen.selectedIndex = getRandomInt(0, selectImagen.options.length - 1);
        imagen.src = selectImagen.value;
        inputVelMax.value = getVelocidadMaximaAleatoria();
        inputVelMaxAleatoria.checked = false;
        inputAceleracion.value = getAceleracionAleatoria();
        inputAceleracionAleatoria.checked = false;
    };

    startButton.onclick = function() {
        ocultarMensajes();
        var mensajes = [];

        if (!carrera.vehiculos.length) {
            mensajes.push("No se puede iniciar la carrera porque no se ha añadido coches!!!");
        }

        if (mensajes.length) {
            mostrarMensajes(mensajes);
        } else {
            carrera.iniciarCarrera();
        }
    };

}

var carrera = null;

window.onload = function() {

    carrera = new Carrera();

    carrera.setDivs("circuito", "podio");

    initControles(carrera);

};