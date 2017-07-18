/*

Ejercicio 010__003

Partiendo del ejercicio anterior... Pinta el restaurante!


1) Realiza una función dentro de Mesa que devuelva el HTML de una mesa. Una mesa puede estar representada por un div con sus datos.

2) Realiza una función dentro de Restaurante que se encargue de pedir a todas las mesas el HTML y pintarlo.

3) Realiza una función dentro de Carta que devuelva un HTML con la tabla de productos y sus existencias.

4) Asocia las funciones anteriores al pintado completo del restaurante.​



 */


/* ********** Configuracion ********** */

const config = {};


/* ********** Funciones Utilitarias ********** */

const Util = function() {
    let secuences = {};
    let nombres = ["Victor", "Omar", "Karen", "Ariel", "Omar", "David", "Esteban", "Matías", "Vlairner", "Lucy", "Ignacio", "Humberto", "Néstor", "Daniel", "Daniela", "Raymundo", "Fran", "Pedro", "Juan", "Juana", "Diego", "Marcelo", "Marcela", "Alberto", "Roberto", "Carlos", "Carla", "Angel", "Angelica", "Angela", "Miguel", "Adriano", "Ramon", "Luis", "Luisa", "Agustín", "Leonardo", "Héctor", "Gabriel", "Gabriela", "Antonio", "Antonia", "Armando", "Patricio", "Patricia", "Homero", "Temístocles", "Aristóteles", "Jorge", "Marcos", "Santiago", "Avelino", "Gilberto", "Bernardo", "Bernardita", "Alejandro", "Alejandra"];
    let entrantes = ["Empanada de Elote de queso", "Empanada de Chistorra con queso", "Empanada de Espinaca con salsa blanca", "Empanada de Jamón y queso", "Empanada de Caprese", "Empanada de Carne", "Sopa de lentejas", "Sopa de Jugo de carne", "Pimiento morrón asado con queso fundido", "Arrachera al carbón con queso, pan árabe", "Chicharrón de rib eye", "Provoleta"];
    let principales = ["Entraña (300grs.)", "Bife de chorizo (300grs.)", "Pechuga de pollo", "Arrachera (300grs.)", "Vacío (300grs.)", "Medallón de lomo (300grs.)", "Pechuga de pollo a la provenzal", "Churrasco (300grs.)", "Asado de tira (300grs.)", "Molleja", "Salmon rosado", "Medallón de atún", "Pulpo", "Milanesa napolitana", "Raviolones", "Spaghetti"];
    let postres = ["Mousse de chocolate", "Naranjas preparadas", "Pastel de manzana", "Pie fruta", "Plátanos asados", "Postre de albaricoques y nata", "Puding melocotón", "Flan con dulce de leche", "Helado de fresa", "Helado de vainilla", "Helado de chocolate", "Alfajor", "Fresas con crema", "Panqueques con dulce de leche", "Crepas Sussete", "Crepas de Cajeta", "Fresas Jubilee", "Plátanos", "Fresas Romanoff", "Mangos al Tequila"];
    let bebidasAlcoholicas = ["Cabarnet Sauvingnon", "Merlot", "Syrah", "Cerveza  Negra Modelo", "Cerveza oscura Negra Modelo", "Cerveza Modelo premium", "Cerveza oscura Victoria  ", "Cerveza oscura León negra ", "Cerveza oscura Negra Modelo", "Cerveza oscura Indio ", "Cerveza Modelo combo fiesta", "Cerveza oscura Victoria", "Cerveza oscura León", "Cerveza oscura Victoria", "Cerveza oscura Bohemia", "Cerveza oscura Victoria", "Cerveza ambar Dos Equis", "Cerveza obscura Rey de Diamantes", "Cerveza oscura Erdinger dunkel", "Cerveza oscura Schmucker", "Cerveza oscura Negra Modelo negra", "Cerveza oscura Indio", "Cerveza oscura Asahi súper seca", "Cerveza ambar Rey de Diamantes", "Cerveza ambar Bohemia clásica", "Cerveza ámbar Dos Equis", "Cerveza oscura Victoria", "Cerveza oscura León estilo Múnich", "Cerveza oscura Indio", "Cerveza oscura Victoria edición especial ", "Cerveza oscura Miller fortune", "Cerveza clara Modelo Especial especial", "Cerveza clara Corona extra ", "Cerveza clara Michelob ultra light ", "Cerveza clara Tecate light", "Cerveza clara Modelo Especial", "Cerveza clara Coronita Extra", "Cerveza clara Corona light", "Cerveza clara Modelo Especial  ", "Cerveza clara Miller high life", "Cerveza clara Barrilito", "Cerveza Modelo combo fiesta", "Cerveza clara Tecate", "Cerveza clara Pacífico  ", "Cerveza clara Sol clamato", "Cerveza clara Miller Lite", "Cerveza clara Corona light", "Cerveza clara Dos Equis lager special", "Cerveza clara Corona extra ", "Cerveza clara Dos Equis lager special ", "Cerveza clara Schmucker doppel bock dunkel", "Cerveza clara Carta Blanca ", "Cerveza clara Miller Lite", "Cerveza oscura Victoria", "Cerveza clara Erdinger weissbier", "Cerveza clara Schmucker rosé bock", "Cerveza clara Corona light", "Cerveza clara Miller lite", "Cerveza Victoria vickychelada", "Cerveza clara Sohnfeld deutsch hefeweizen"];
    let bebidas = ["Agua tónica Schweppes", "Jugo de tomate", "Coca-cola", "Fanta naranja", "Pepsi", "Mirinda", "Canada Dry Ginger Ale", "Sprite", "Agua con gas", "Agua sin gas", "Limonada", "Naranjada"];
    let tiposComida = ["entrante", "principal", "postre"];

    class Util {
        static getRandomInt(min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        static getSecuentialId(key) {
            if (!secuences[key]) {
                secuences[key] = 0;
            }
            return ++secuences[key];
        }
        static getNombreAleatorio() {
            return nombres[Math.floor(Math.random() * nombres.length)];
        }
        static getNombreComidaAleatorio(tipo) {
            let nombre = "";
            switch (tipo) {
                case "entrante":
                    nombre = entrantes[Math.floor(Math.random() * entrantes.length)];
                    break;
                case "principal":
                    nombre = principales[Math.floor(Math.random() * principales.length)];
                    break;
                case "postre":
                    nombre = postres[Math.floor(Math.random() * postres.length)];
                    break;
                default:
                    nombre = "Tipo de comida no válido";
            }
            return nombre;
        }
        static getNombreBebidaAleatorio(esAlcoholica) {
            return esAlcoholica ?
                bebidasAlcoholicas[Math.floor(Math.random() * bebidasAlcoholicas.length)] :
                bebidas[Math.floor(Math.random() * bebidas.length)];
        }
    }
    return Util;
}();


/* ********** Clase Persona ********** */

class Persona {
    constructor(
        id = Util.getSecuentialId('Persona'),
        nombre = Util.getNombreAleatorio(),
        edad = Util.getRandomInt(20, 60)
    ) {

        this.id = id;
        this.nombre = nombre;
        this.edad = edad;

    }
}

/* ********** Clase Camarero, extiende Persona ********** */

class Camarero extends Persona {
    constructor(
        id,
        nombre,
        edad,
        cargo = Util.getRandomInt(0, 1) ? "encargado" : "mozo"
    ) {

        super(id, nombre, edad);
        this.cargo = cargo;

    }
}

/* ********** Clase Cliente, extiende Persona ********** */

class Cliente extends Persona {
    constructor(
        id,
        nombre,
        edad,
        dinero = Util.getRandomInt(0, 1500)
    ) {

        super(id, nombre, edad);
        this.dinero = dinero;

    }
}

/* ********** Clase Mesa ********** */

class Mesa {
    constructor(
        id = Util.getSecuentialId('Mesa'),
        capacidad = Util.getRandomInt(2, 10),
        ocupada = false,
        personas = [],
        ordenes = []
    ) {

        this.id = id;
        this.capacidad = capacidad;
        this.ocupada = ocupada;
        this.personas = personas;
        this.ordenes = ordenes;

    }

    getCajaParaPintar(currencyFormatter) {
        return `<div class="mesa" capacidad="${this.capacidad}">
            <h3>${this.id}</h3>
            <div class="item">
                <div class="label">capacidad</div>
                <div class="data">${this.capacidad}</div>
            </div>
            <div class="item">
                <div class="label">ocupada</div>
                <div class="data">${this.ocupada}</div>
            </div>
            <div class="item">
                <div class="label">personas</div>
                <div class="data">${this.personas.length}</div>
            </div>
            <div class="item">
                <div class="label">ordenes</div>
                <div class="data">${this.ordenes.length}</div>
            </div>
        </div>`;
    }
}

/* ********** Clase Producto ********** */

class Producto {
    constructor(
        id = Util.getSecuentialId('Producto'),
        nombre,
        existencias = Util.getRandomInt(2, 10),
        calorias = Util.getRandomInt(0, 100),
        precio = Util.getRandomInt(80, 300)
    ) {

        this.id = id;
        this.nombre = nombre;
        this.existencias = existencias;
        this.calorias = calorias;
        this.precio = precio;

    }

    getFilaParaPintar(currencyFormatter) {
        var precio = currencyFormatter ? currencyFormatter.format(this.precio) : this.precio;
        return `<tr>
                <td>${this.nombre}</td>
                <td class="numero">${this.calorias}</td>
                <td class="numero">${precio}</td>
            </tr>`;
    }
}

/* ********** Clase Bebida, extiende Producto ********** */

class Bebida extends Producto {
    constructor(
        id,
        nombre,
        existencias,
        calorias,
        precio,
        grados = Util.getRandomInt(-11, 11),
    ) {

        super(id, nombre, nombre, existencias, calorias, precio);
        this.grados = grados > 0 ? grados : 0;
        this.esAlcoholica = grados > 0;
        if (!this.nombre) {
            this.nombre = Util.getNombreBebidaAleatorio(this.esAlcoholica);
        }

    }

    getFilaParaPintar(currencyFormatter) {
        var precio = currencyFormatter ? currencyFormatter.format(this.precio) : this.precio;
        var alcohol = this.esAlcoholica ? this.grados + "°" : "";
        return `<tr>
                <td>${this.nombre}</td>
                <td class="numero">${this.calorias}</td>
                <td class="numero">${precio}</td>
                <td class="numero">${alcohol}</td>
            </tr>`;
    }
}

/* ********** Clase Comida, extiende Producto ********** */

class Comida extends Producto {
    constructor(
        id,
        nombre,
        existencias,
        calorias,
        precio,
        tipo = Comida.TIPOS[Util.getRandomInt(0, Comida.TIPOS.length - 1)]
    ) {

        super(id, nombre, nombre, existencias, calorias, precio);
        this.tipo = tipo;
        if (!this.nombre) {
            this.nombre = Util.getNombreComidaAleatorio(this.tipo);
        }

    }

    getFilaParaPintar(currencyFormatter) {
        var precio = currencyFormatter ? currencyFormatter.format(this.precio) : this.precio;
        return `<tr>
                <td>${this.nombre}</td>
                <td class="numero">${this.calorias}</td>
                <td class="numero">${precio}</td>
                <td class="tipo">${this.tipo}</td>
            </tr>`;
    }
}
Comida.TIPOS = ["entrante", "principal", "postre"];

/* ********** Clase Carta ********** */

class Carta {
    constructor(
        id = Util.getSecuentialId('Carta'),
        bebidas = [],
        comidas = []
    ) {

        this.id = id;
        this.bebidas = bebidas;
        this.comidas = comidas;

    }

    addComida(comida = new Comida()) {
        this.comidas.push(comida);
    }

    addBebida(bebida = new Bebida()) {
        this.bebidas.push(bebida);
    }

    getCajaParaPintar(currencyFormatter) {
        var htmlBebidas = this.bebidas.reduce((html, bebida) => html + bebida.getFilaParaPintar(currencyFormatter), "");
        var htmlComidas = this.comidas.reduce((html, comida) => html + comida.getFilaParaPintar(currencyFormatter), "");
        return `<h2>Carta</h2>
                <h3>Bebidas</h3>
                <table class="bebidas">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Calorias</th>
                            <th>Precio</th>
                            <th>Alcohol</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${htmlBebidas}
                    </tbody>
                    </table>
                <h3>Comidas</h3>
                <table class="comidas">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Calorias</th>
                            <th>Precio</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${htmlComidas}
                    </tbody>
                </table>`;
    }

    static getInstanciaAleatoria(numComidas = 5, numBebidas = 5) {
        let carta = new Carta();
        for (let i = 0; i < numComidas; i++) {
            carta.addComida();
        };
        for (let i = 0; i < numBebidas; i++) {
            carta.addBebida();
        };
        return carta;
    }
}

/* ********** Clase Restaurante ********** */

class Restaurante {
    constructor(
        id = Util.getSecuentialId('Restaurante'),
        nombre = "El mesón de " + Util.getNombreAleatorio(),
        mesas = [],
        camareros = [],
        carta = new Carta(),
        currencyFormatter
    ) {

        this.id = id;
        this.nombre = nombre;
        this.mesas = mesas;
        this.camareros = camareros;
        this.carta = carta;
        this.currencyFormatter = currencyFormatter;

    }

    addMesa(mesa = new Mesa()) {
        this.mesas.push(mesa);
    }

    addCamarero(camarero = new Camarero()) {
        this.camareros.push(camarero);
    }

    setCurrencyFormatter(currencyFormatter) {
        this.currencyFormatter = currencyFormatter;
    }

    pintar(divs) {
        divs.nombre.innerHTML = this.nombre;

        divs.carta.innerHTML = this.carta.getCajaParaPintar(this.currencyFormatter);

        divs.mesas.innerHTML = this.mesas.reduce((html, mesa) => html + mesa.getCajaParaPintar(this.currencyFormatter), "");
    }

    static getInstanciaAleatoria(
        numMesas = 30,
        numCamareros = 5,
        numComidas = 5,
        numBebidas = 5
    ) {
        let restaurante = new Restaurante();
        for (let i = 0; i < numMesas; i++) {
            restaurante.addMesa();
        };
        for (let i = 0; i < numCamareros; i++) {
            restaurante.addCamarero();
        };
        restaurante.carta = Carta.getInstanciaAleatoria(numComidas, numBebidas);
        return restaurante;
    }
}


/* ********** Instancia de Restaurante ********** */

let restaurante;

window.onload = function() {

    let currencyFormatter = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

    let divsRestaurante = {
        nombre: document.getElementById("nombre-restaurante"),
        carta: document.getElementById("carta-restaurante"),
        mesas: document.getElementById("mesas-restaurante")
    }

    restaurante = Restaurante.getInstanciaAleatoria();
    restaurante.setCurrencyFormatter(currencyFormatter);

    restaurante.pintar(divsRestaurante);

}