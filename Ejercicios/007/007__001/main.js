/*
Ejercicio 007__001

1) Modela la clase Vehículo, con las siguientes propiedades:

Marca (aleatorio)
Modelo (aleatorio)
VelocidadMaxima (aleatorio entre 100kmh y 200kmh)
Realiza la clase Motocicleta y Coche que hereden de vehículo

2) Realiza la clase carrera que recibirá dos vehículos en su consctrucción. La clase carrera tendrá el método iniciarCarrera() que hará que los dos vehículos compitan.

Una carrera consistirá en ver qué vehículo recorre primero 200 metros. Para ser realista deberás hacer que los vehículos avancen cada segundo los metros correspondientes.

Ganará el que recorra antes los 200 metros. En caso de llegar a la vez, quedarán empatados e irán a penales. 

Naaaaaaaaah, no hay penales. Pero sí que pueden empatar.

3) Pinta en tu html la carrera. Haz uso de funciones de manejo del DOM, y haz uso de CSS para modificar su posición. Los coches deberán desplazarse desde la izquierda de la pantalla hasta la derecha donde se encontrará la meta.



AYUDA:


function getMetrosQueAvanzaCadaSegundo(velocidadEnKmh){
    var metros = velocidadEnKmh*1000/3600;
    return metros;
}

 */


/* ********** Funciones Utilitarias ********** */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getImagenAleatorio() {
    return "vehiculo" + getRandomInt(1, 10) + ".png";
}

var marcas = ["Alfa Romeo", "Aston Martin", "Audi", "Bentley", "Bmwbyd", "Chevrolet", "Citroen", "Dacia", "Dfsk", "Ds", "Ferrari", "Fiat", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", "Kia", "Lamborghini", "Lancia", "Land Rover", "Lexus", "Mahindra", "Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi", "Morgan", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Rolls-Royce", "Seat", "Skoda", "Smart", "Ssangyong", "Subaru", "Suzuki", "Tata", "Tesla", "Toyota", "Volkswagen", "Volvo"];

function getMarcaAleatorio() {
    return marcas[getRandomInt(0, marcas.length - 1)];
}

var modelos = ["Spider", "Giulietta", "MiTo", "4C", "Giulia", "Stelvio", "DB9", "Vantage V8", "Vanquish", "Vantage V12", "Rapide", "A4", "A8", "A3", "TT", "A5", "A6", "A7", "Q3", "Q5", "S5", "A1", "S7", "S6", "S8", "RS4", "RS5", "R8", "SQ5", "Q7", "RS6", "RS7", "S3", "S1", "TTS", "S4", "RS3", "SQ7", "Q2", "TTS", "SQ7", "S4", "Continental GT", "Mulsanne", "Flying Spur", "Continental GTC", "Bentayga", "Cruze", "Aveo", "Trax", "Orlando", "Spark", "Camaro", "C4", "C3", "C5", "C3 Picasso", "C4 Picasso", "Grand C4 Picasso", "C4 Aircross", "Nemo", "Berlingo", "C-Elysée", "C4 Cactus", "C1", "C-Zero", "C-Elysée", "Spacetourer", "E-Mehari", "Logan", "Lodgy", "Sandero", "Duster", "Dokker", "488", "GTC4", "California", "F12", "458", "FF", "F12", "California", "488", "Freemont", "Doblò", "Punto", "Panda", "500", "500L", "500L", "500X", "Qubo", "Fiorino", "Bravo", "Doblò", "Doblò", "500C", "Tipo", "124 Spider", "C-Max", "Fiesta", "Focus", "Mondeo", "Ka", "S-MAX", "B-MAX", "Grand C-Max", "Tourneo Custom", "Kuga", "Galaxy", "Grand Tourneo Connect", "Tourneo Connect", "EcoSport", "Tourneo Courier", "Mustang", "Transit Connect", "Edge", "Ka+", "Accord", "Jazz", "Civic", "CR-V", "HR-V", "I20", "Ix35", "Ix20", "I10", "Santa Fe", "Veloster", "I40", "Elantra", "I30", "Grand Santa Fe", "Genesis", "H-1 Travel", "Tucson", "I20 Active", "XF", "Serie XK", "F-Type", "XJ", "XE", "F-Pace", "Grand Cherokee", "Wrangler Unlimited", "Cherokee", "Wrangler", "Renegade", "Compass", "Renegade", "Wrangler", "Cherokee", "Picanto", "Rio", "Sportage", "Venga", "Optima", "Cee'd", "Cee'd Sportswagon", "Carens", "Pro_cee'd", "Sorento", "Soul", "Niro", "Soul EV", "Pro_cee'd GT", "Aventador", "Huracán", "Ypsilon", "Voyager", "Delta", "Thema", "Defender", "Discovery 4", "Range Rover", "Range Rover Evoque", "Freelander", "Range Rover Sport", "Discovery Sport", "Discovery", "Range Rover Velar", "GS", "RX", "CT", "IS", "NX", "RC", "LS", "LC", "XUV500", "GranCabrio", "Quattroporte", "Ghibli", "GranTurismo", "Levante", "Mazda2", "CX-5", "Mazda6", "MX-5", "Mazda3", "Mazda5", "CX-9", "CX-3", "Clase SL", "Clase SLK", "Clase V", "Clase C", "Clase M", "Clase G", "Clase E", "Clase CL", "Clase S", "Clase GLK", "SLS AMG", "Clase B", "Clase A", "Clase GL", "Clase CLS", "Clase CLA", "Clase GLA", "Vito", "Clase GLE Coupé", "Clase GLE", "Clase GLE Coupé", "Clase GLK", "Clase GLC", "Citan", "Clase GLS", "Clase SLC", "GLC Coupé", "Mercedes-AMG GT", "Montero", "I-MiEV", "ASX", "Outlander", "Space Star", "L200", "Roadster", "Plus 8", "Plus 4", "4/4", "X-TRAIL", "QASHQAI", "NOTE", "LEAF", "Pathfinder", "EVALIA", "Navara", "Micra", "JUKE", "370Z", "NV200", "GT-R", "PULSAR", "Murano", "NV200 EVALIA", "E-NV200 EVALIA", "Corsa", "Astra", "Meriva", "Zafira Tourer", "Zafira", "Insignia", "Combo", "Ampera", "Mokka", "Adam", "Cabrio", "Antara", "Karl", "GTC", "GTC", "Mokka", "Zafira", "Crossland X", "Mokka X", "308", "807", "Bipper", "508", "Partner", "3008", "208", "2008", "RCZ", "5008", "4008", "108", "207", "Ion", "Traveller", "911", "Boxster", "Cayenne", "Panamera", "918", "Macan", "Cayman", "718", "Fluence", "Grand Scénic", "Latitude", "Clio", "Scénic", "Laguna", "Kangoo Combi", "Mégane", "Grand Kangoo Combi", "Captur", "ZOE", "Koleos", "Twingo", "Espace", "Kadjar", "Talisman", "Phantom", "Ibiza", "Nuevo León", "Alhambra", "Altea", "Mii", "Toledo", "Altea XL", "Ateca", "León", "Nuevo Ibiza", "Octavia", "Fabia", "Roomster", "Yeti", "Superb", "Citigo", "Rapid", "Spaceback", "Scout", "Kodiaq", "Fortwo", "Forfour", "Rexton", "Rodius", "Korando", "Actyon Sports Pick Up", "Tivoli", "XLV", "Forester", "XV", "Outback", "BRZ", "WRX STI", "LEVORG", "WRX STI", "Grand Vitara", "Swift", "SX4", "Jimny", "SX4 S-Cross", "Celerio", "Kizashi", "Vitara", "Baleno", "Ignis", "Aria", "Vista", "Model X", "Model S", "Avensis", "Land Cruiser", "Yaris", "Verso", "Auris", "Prius+", "GT86", "Prius", "Rav4", "Aygo", "Hilux", "Land Cruiser 200", "Proace Verso", "C-HR", "Polo", "Jetta", "Phaeton", "Golf", "Touran", "Touareg", "Beetle", "Sharan", "Tiguan", "Multivan", "California", "Caravelle", "Up!", "CC", "Golf Sportsvan", "Amarok", "Caddy", "Transporter", "Scirocco", "Passat", "Eos", "Arteon", "V70", "S80", "XC70", "V60", "S60", "XC90", "XC60", "V40", "V40 Cross Country", "V60 Cross Country", "S60 Cross Country", "S90", "V90", "V90 Cross Country"];

function getModeloAleatorio() {
    return modelos[getRandomInt(0, modelos.length - 1)];
}


function getMetrosQueAvanzaCadaSegundo(velocidadEnKmh) {
    var metros = velocidadEnKmh * 1000 / 3600;
    return metros;
}


/* ********** Clase Vehiculo ********** */

function Vehiculo(id, marca, modelo, velocidadMaxima, imagen) {
    this.initVehiculo(id, marca, modelo, velocidadMaxima, imagen);
}
Vehiculo.prototype.initVehiculo = function(id, marca, modelo, velocidadMaxima, imagen) {
    this.id = id || getRandomInt(1, Number.MAX_SAFE_INTEGER);
    this.marca = marca || getMarcaAleatorio();
    this.modelo = modelo || getModeloAleatorio();
    this.velocidadMaxima = velocidadMaxima || getRandomInt(100, 200);
    this.imagen = imagen || getImagenAleatorio();
};


/* ********** Clase Motocicleta, extiende Vehiculo ********** */

function Motocicleta(id, marca, modelo, velocidadMaxima, imagen) {
    this.initVehiculo(id, marca, modelo, velocidadMaxima, imagen);
}
Motocicleta.prototype = new Vehiculo();


/* ********** Clase Coche, extiende Vehiculo ********** */

function Coche(id, marca, modelo, velocidadMaxima, imagen) {
    this.initVehiculo(id, marca, modelo, velocidadMaxima, imagen);
}
Coche.prototype = new Vehiculo();


/* ********** Clase Carrera ********** */
function Carrera(vehiculos, distancia, tiempoCiclo) {
    this.vehiculos = vehiculos || [];
    this.distancia = distancia || 200;
    this.tiempoCiclo = tiempoCiclo || 200;
    this.tiempo = 0;
    this.meta = [];
    this.recorrido = [];
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
        var avanceVehiculo = Math.round(this.recorrido[i] * lengthCircuito / this.distancia);
        console.log(i + ":" + avanceVehiculo);
        var imgVehiculo = document.getElementById("vehiculo" + i);
        imgVehiculo.style = "margin-left:" + avanceVehiculo + "px;";
    }
};
Carrera.prototype.pintarPodio = function() {
    if (!this.divPodio) {
        throw "El div contenedor del podio no se encuentra";
    }
    var html = "<table>";
    html += '<tr class="vehiculo-podio"><th>Posicion</th><th>Tiempo (s)</th><th>Imagen</th><th>Marca</th><th>Modelo</th><th>Velocidad</th></tr>';
    var timepoAnt = 0;
    var posicion = 0;
    for (var m = 0; m < this.meta.length; m++) {
        if (timepoAnt != this.meta[m].tiempo) {
            posicion++;
        }
        var vehiculo = this.vehiculos[this.meta[m].indice];
        html += '<tr class="vehiculo-podio"><td class="posicion">' + posicion + '</td><td class="tiempo">' + (this.meta[m].tiempo * this.tiempoCiclo / 1000).toFixed(1) + '</td><td><img class="vehiculo" src="' + vehiculo.imagen + '"/></td><td>' + vehiculo.marca + '</td><td>' + vehiculo.modelo + '</td><td class="velocidad">' + vehiculo.velocidadMaxima + '</td></tr>';
        timepoAnt = this.meta[m].tiempo;
    }
    html += "</table>";
    this.divPodio.innerHTML = html;
};
Carrera.prototype.ejecutarCiclo = function() {
    this.tiempo++;
    for (var i = 0; i < this.vehiculos.length; i++) {
        if (this.recorrido[i] < this.distancia) {
            var vehiculo = this.vehiculos[i];
            this.recorrido[i] += getMetrosQueAvanzaCadaSegundo(vehiculo.velocidadMaxima) * this.tiempoCiclo / 1000;
            if (this.recorrido[i] >= this.distancia) {
                this.recorrido[i] = this.distancia;
                this.meta.push({ indice: i, tiempo: this.tiempo });
            }
            console.log("t: " + this.tiempo + ", v: " + i + ", r: " + this.recorrido[i].toFixed(3) + ", m: " + vehiculo.marca);
        }
    }
    if (this.meta.length == this.vehiculos.length) {
        clearInterval(this.intervalID);
        for (var m = 0; m < this.meta.length; m++) {
            var vehiculom = this.vehiculos[this.meta[m].indice];
            console.log("p: " + (2 - this.tiempo + this.meta[m].tiempo) + ", t: " + this.meta[m].tiempo + ", v: " + this.meta[m].indice + ", m: " + vehiculom.marca);
        }
        this.pintarPodio();
    }
    this.pintarAvance();
};
Carrera.prototype.iniciarCarrera = function() {
    this.tiempo = 0;
    this.meta = [];
    this.recorrido = [];
    for (var i = 0; i < this.vehiculos.length; i++) {
        this.recorrido[i] = 0;
    }

    this.pintarLargada();

    var carrera = this;
    this.intervalID = setInterval(function() {
        carrera.ejecutarCiclo();
    }, this.tiempoCiclo);
};

var x = new Vehiculo();
var y = new Motocicleta();
var z = new Coche();
var c = new Carrera([x, y, z]);
for (var i = 0; i < 3; i++) {
    c.addVehiculo();
}
window.onload = function() {
    c.setDivs("circuito", "podio");
    c.iniciarCarrera();
};