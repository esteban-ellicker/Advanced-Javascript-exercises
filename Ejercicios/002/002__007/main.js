/*
Ejercicio 002__007

Xanxo Whatsapp

Partiendo de los ficheros entregados...

Orquesta la comunicación entre los dos iPhones

Los mensajes que envíe el iphone1 llegarán al iphone2 y viceversa.

No olvides pintar también los mensajes enviados por el propio usuario.

Para pintar dispones de la función pintarMensaje(idIphone, mensaje, esPropio) 

Para obtener el mensaje que ha escrito un usuario dispones de la función getMensaje(idIphone) 

Haz uso al menos de dos clases: Usuario y mensaje por ejemplo



BONUS:

Haz uso de los ficheros del bonus para enviar mensajes seleccionando el destinatario
 */


/* ********** funciones utilitarias ********** */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var nombres = ["Victor", "Omar", "Karen", "Ariel", "Omar", "David", "Esteban", "Matías", "Vlairner", "Lucy", "Ignacio", "Humberto", "Néstor", "Daniel", "Daniela", "Raymundo", "Fran", "Pedro", "Juan", "Juana", "Diego", "Marcelo", "Marcela", "Alberto", "Roberto", "Carlos", "Carla", "Angel", "Angelica", "Angela", "Miguel", "Adriano", "Ramon", "Luis", "Luisa", "Agustín", "Leonardo", "Héctor", "Gabriel", "Gabriela", "Antonio", "Antonia", "Armando", "Patricio", "Patricia", "Homero", "Temístocles", "Aristóteles", "Jorge", "Marcos", "Santiago", "Avelino", "Gilberto", "Bernardo", "Bernardita", "Alejandro", "Alejandra"];

function getNombreAleatorio() {
    return nombres[getRandomInt(0, nombres.length - 1)];
}

//Para controlar dispositivos no respresentados en pantalla sin tocar js ni css del enunciado
var pintarMensajeEnPantalla = function(idIphone, mensaje, origen, nombreUsuario) {
    var dispositivoEnPantalla = document.getElementById(idIphone);
    if (dispositivoEnPantalla) {
        var esPropio = origen == idIphone;
        mensaje = mensaje.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\n/g, "<br>");

        //invocamos la función provista en el enunciado
        pintarMensaje(idIphone, mensaje, esPropio, nombreUsuario);

        //Moverse al final de la lista de mensajes para dejar visibles los más recientes
        var misMensajes = dispositivoEnPantalla.querySelector(".messages");
        if (misMensajes && misMensajes.scrollHeight > misMensajes.offsetHeight) {
            misMensajes.scrollTop = misMensajes.scrollHeight - misMensajes.offsetHeight;
        }

        if (!esPropio) {
            dispositivoEnPantalla.className = dispositivoEnPantalla.className + " vibrar";
            setTimeout(function() {
                dispositivoEnPantalla.className = dispositivoEnPantalla.className.replace(/ vibrar/, "");
            }, 1000);
        }
    } else {
        console.log(idIphone + " no esta representado en panlla");
        console.log(origen + ": " + mensaje);
    }
};

/* ********** Clase CanalComunicacion ********** */
function CanalComunicacion() {
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

/* ********** Clase Conversacion ********** */
function Conversacion() {
    this.dispositivos = [];
    this.canal = new CanalComunicacion();
}
Conversacion.prototype.agregarDispositivo = function(dispositivo) {
    dispositivo.enlazar(this.canal);
    return this.dispositivos.push(dispositivo);
};
Conversacion.prototype.getDispositivoPorId = function(id) {
    return this.dispositivos.find(function(dispositivo) {
        return dispositivo.id == id;
    });
};


/* ********** Clase Usuario ********** */
function Usuario(id, nombre) {
    this.id = id || getRandomInt(1, Number.MAX_SAFE_INTEGER);
    this.nombre = nombre || getNombreAleatorio();
}


/* ********** Clase Dispositivo ********** */
function Dispositivo(id, modelo, usuario) {
    this.id = id;
    this.modelo = modelo;
    this.usuario = usuario;

    var esteDispositivo = this;
    var canalEnlazado = null;
    this.enlazar = function(canal) {
        canalEnlazado = canal;
        canalEnlazado.sub("mensaje", function(data) {
            if (!data.destinatario || data.destinatario == "TODOS" || data.destinatario == esteDispositivo.id || data.origen == esteDispositivo.id) {
                pintarMensajeEnPantalla(esteDispositivo.id, data.texto, data.origen, data.nombreUsuario);
            }
        });
    };
    this.enviar = function(mensaje) {
        if (!canalEnlazado) {
            throw "Este dispositivo no está conectado a ningún canal";
        }
        canalEnlazado.pub("mensaje", new DataMensaje(esteDispositivo, mensaje));
    };
}

/* ********** Clase DataMensaje ********** */
function DataMensaje(dispositivo, data) {
    this.origen = dispositivo.id;
    this.nombreUsuario = dispositivo.usuario.nombre;
    this.texto = data.mensaje;
    this.destinatario = data.destinatario;
    this.date = new Date();
}

var conversacion = new Conversacion();
conversacion.agregarDispositivo(new Dispositivo("iphone1", "iphone", new Usuario()));
conversacion.agregarDispositivo(new Dispositivo("iphone2", "iphone", new Usuario()));
conversacion.agregarDispositivo(new Dispositivo("iphone3", "iphone", new Usuario()));
conversacion.agregarDispositivo(new Dispositivo("iphone4", "iphone", new Usuario()));

var enviarMensaje = function(idIphone) {

    //invocamos la función provista en el enunciado
    var data = getMensaje(idIphone);

    data.mensaje = data.mensaje.trim();

    if (data.mensaje !== "") {
        console.log("Mensaje enviado por: " + idIphone);
        console.log(data);

        conversacion.getDispositivoPorId(idIphone).enviar(data);
    }
};

//Agrego un dispositvo no representado en pantalla
var robot = new Dispositivo("robot", "android", new Usuario(null, "Robot"));
conversacion.agregarDispositivo(robot);

var timeoutID = setTimeout(function() {
    robot.enviar({ mensaje: "Hola desde dispositivo sin pantalla" });
}, 10000);

// var intervalID = setInterval(function() {
//     var fecha = new Date();
//     robot.enviar({ mensaje: fecha.toLocaleTimeString() });
// }, 60000);




//
// 
//