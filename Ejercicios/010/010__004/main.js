/*

Ejercicio 010__004


Vamos a completar el ejercicio anterior (010__003):


1) Genera la función ejecutarCiclo() sobre restaurante que se encargue de pintar todo el restaurante. Genera la función iniciarCiclo sobre restaurante que se encargue de llamar a la función anterior cada 2 segundos.

2) Crea la clase Recepción que tenga la propiedad gruposEsperando (será un array de objetos de tipo GrupoPersonas). 
    Crea la clase GrupoPersona que tenga la propiedad integrantes (será un array de objetos de tipo Persona)

3) Crea la función pintar en el objeto Recepción que se encargue de realizar el pintado de la recepción en el HTML. El pintado de la recepción será el pintado de un bloque por cada grupo de personas que esté esperando. El bloque deberá indicar el número de personas que tiene. 

Para el pintado de cada grupo haz uso de una función "pintar" que se encuentre definida en la clase GrupoPersonas.

4) Haz que el restaurante cree y pinte un botón "Traer clientes". El botón deberá llamar a una función traerClientes que esté definida sobre la recepción, esta función deberá generar un nuevo grupo de personas y añadirlo a la propiedad gruposEsperando de la recepción.

5) Haz que el restaurante cree un botón "recibir" que cuando sea pulsado se encargue de pedir a la recepción el primer grupo de personas que esté esperando. Si el restaurante tiene una mesa libre con capacidad suficiente, deberá colocar a los integrantes del grupo en esa mesa.​ Si no tiene ninguna mesa disponible para ese grupo, el grupo se marchará.

6) Cada ciclo los clientes que están sentados en mesas deberán generar órdenes nuevas. Crea un botón TomarNota que al ser pulsado hará que restaurante dé la carta a cada uno de los clientes. Estos escogerán 2 productos y generarán una nueva Orden. Dicha orden será asociada a la mesa en la que se encuentren. 



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
        static getAleatorio(array) {
            return array.length ? array[Math.floor(Math.random() * array.length)] : null;
        }
        static getNombreAleatorio() {
            return Util.getAleatorio(nombres);
        }
        static getNombreComidaAleatorio(tipo) {
            let nombre = "";
            switch (tipo) {
                case "entrante":
                    nombre = Util.getAleatorio(entrantes);
                    break;
                case "principal":
                    nombre = Util.getAleatorio(principales);
                    break;
                case "postre":
                    nombre = Util.getAleatorio(postres);
                    break;
                default:
                    nombre = "Tipo de comida no válido";
            }
            return nombre;
        }
        static getNombreBebidaAleatorio(esAlcoholica) {
            return esAlcoholica ? Util.getAleatorio(bebidasAlcoholicas) : Util.getAleatorio(bebidas);
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
        this.emojis = getEmojisPersonaAleatorio();

    }

    ejecutarCiclo() {

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

    ejecutarCiclo() {

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

    generarOrden(carta) {
        var orden = new Orden();
        var bebida = Util.getAleatorio(carta.bebidas);
        var comida = Util.getAleatorio(carta.comidas);
        if (bebida) {
            orden.addBebida(bebida);
        } else {
            console.log("No quedan bebidas en la carta");
        }
        if (comida) {
            orden.addComida(comida);
        } else {
            console.log("No quedan comidas en la carta");
        }
        return orden;
    }

    ejecutarCiclo() {

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
        this.currencyFormatter = null;
        this.view = null;

    }

    setCurrencyFormatter(currencyFormatter) {
        this.currencyFormatter = currencyFormatter;
    }

    addPersona(persona = new Cliente()) {
        this.personas.push(persona);
    }

    tomarNota(carta) {
        if (this.ordenes.length == 0) {
            this.personas.forEach(persona => {
                var orden = persona.generarOrden(carta);
                if (orden.bebidas.length && orden.comidas.length) {
                    this.ordenes.push(orden);
                }
            });
        }
    }

    ejecutarCiclo() {
        this.personas.forEach(persona => persona.ejecutarCiclo());
    }

    _pintarSillas(contenedor) {

        var sillas = contenedor.getElementsByClassName("silla");
        while (sillas[0]) {
            sillas[0].parentNode.removeChild(sillas[0]);
        }

        this.personas.forEach(persona => {
            let silla = document.createElement("span");
            silla.setAttribute("class", "silla");
            silla.setAttribute("title", persona.nombre);
            silla.appendChild(document.createTextNode(persona.emojis.feliz));
            contenedor.appendChild(silla);
        });
        for (let i = this.personas.length; i < this.capacidad; i++) {
            let silla = document.createElement("span");
            silla.setAttribute("class", "silla");
            silla.appendChild(document.createTextNode(emojis.puesto));
            contenedor.appendChild(silla);
        }
    }

    _pintarOrdenes(contenedor) {

        var ordenes = contenedor.getElementsByClassName("orden");
        while (ordenes[0]) {
            ordenes[0].parentNode.removeChild(ordenes[0]);
        }

        this.ordenes.forEach(orden => {
            let eorden = document.createElement("span");
            eorden.setAttribute("class", "orden");
            eorden.setAttribute("title", orden.getNombres().join(", "));
            eorden.appendChild(document.createTextNode(emojis.orden));
            contenedor.appendChild(eorden);
        });
    }

    _createItemElement(campo, label, data) {
        let item = document.createElement("div");
        item.setAttribute("class", "item " + campo);

        let vlabel = document.createElement("div");
        vlabel.setAttribute("class", "label");
        vlabel.appendChild(document.createTextNode(label));
        item.appendChild(vlabel);

        let vdata = document.createElement("div");
        vdata.setAttribute("class", "data");
        vdata.appendChild(document.createTextNode(data));
        item.appendChild(vdata);

        return item;
    }

    _appendElement(contenedor) {
        this.view = document.createElement("div");
        this.view.setAttribute("class", "mesa");
        this.view.setAttribute("capacidad", this.capacidad);

        let vHead = document.createElement("h3");
        vHead.appendChild(document.createTextNode(this.id));
        this.view.appendChild(vHead);

        let info = document.createElement("div");
        info.setAttribute("class", "info");
        info.appendChild(this._createItemElement("capacidad", "Capacidad", this.capacidad));
        info.appendChild(this._createItemElement("ocupada", "Ocupada", this.ocupada));
        info.appendChild(this._createItemElement("personas-length", "Personas", this.personas.length));
        info.appendChild(this._createItemElement("ordenes-length", "Ordenes", this.ordenes.length));
        this.view.appendChild(info);

        let sillas = document.createElement("div");
        sillas.setAttribute("class", "sillas");
        this._pintarSillas(sillas);
        this.view.appendChild(sillas);

        let ordenes = document.createElement("div");
        ordenes.setAttribute("class", "ordenes");
        this._pintarOrdenes(this.view);
        this.view.appendChild(ordenes);

        contenedor.appendChild(this.view);
    }

    _updateElement() {
        this.view.querySelector(".ocupada .data").innerText = this.ocupada;
        this.view.querySelector(".personas-length .data").innerText = this.personas.length;
        this.view.querySelector(".ordenes-length .data").innerText = this.ordenes.length;
        this._pintarSillas(this.view.querySelector(".sillas"));
        this._pintarOrdenes(this.view.querySelector(".ordenes"));
    }

    pintar(contenedor) {
        if (this.view) {
            this._updateElement();
        } else {
            this._appendElement(contenedor);
        }
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
        this.currencyFormatter = null;

    }

    setCurrencyFormatter(currencyFormatter) {
        this.currencyFormatter = currencyFormatter;
    }

    formatPrecio() {
        return this.currencyFormatter ? this.currencyFormatter.format(this.precio) : this.precio;
    }

    _createItemElement(clase, data) {
        let item = document.createElement("td");
        item.setAttribute("class", clase);
        item.appendChild(document.createTextNode(data));

        return item;
    }

    _appendElement(tbody) {
        this.view = document.createElement("tr");
        this.view.setAttribute("existencias", this.existencias);

        this.view.appendChild(this._createItemElement("nombre", this.nombre));
        this.view.appendChild(this._createItemElement("calorias numero", this.calorias));
        this.view.appendChild(this._createItemElement("precio numero", this.formatPrecio()));

        tbody.appendChild(this.view);
    }

    _updateElement() {
        this.view.setAttribute("existencias", this.existencias);
        this.view.querySelector(".precio").innerText = this.formatPrecio();
    }

    pintar(tbody) {
        if (this.view) {
            this._updateElement();
        } else {
            this._appendElement(tbody);
        }
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

    _appendElement(tbody) {
        this.view = document.createElement("tr");
        this.view.setAttribute("existencias", this.existencias);

        this.view.appendChild(this._createItemElement("nombre", this.nombre));
        this.view.appendChild(this._createItemElement("calorias numero", this.calorias));
        this.view.appendChild(this._createItemElement("precio numero", this.formatPrecio()));
        this.view.appendChild(this._createItemElement("alcohol numero", this.esAlcoholica ? this.grados + "°" : ""));

        tbody.appendChild(this.view);
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

    _appendElement(tbody) {
        this.view = document.createElement("tr");
        this.view.setAttribute("existencias", this.existencias);

        this.view.appendChild(this._createItemElement("nombre", this.nombre));
        this.view.appendChild(this._createItemElement("calorias numero", this.calorias));
        this.view.appendChild(this._createItemElement("precio numero", this.formatPrecio()));
        this.view.appendChild(this._createItemElement("tipo", this.tipo));

        tbody.appendChild(this.view);
    }
}
Comida.TIPOS = ["entrante", "principal", "postre"];

/* ********** Clase Carta ********** */

class Carta {
    constructor(
        id = Util.getSecuentialId('Carta'),
        bebidas = 5,
        comidas = 5
    ) {

        this.id = id;
        if (typeof bebidas == "number") {
            this.setBebidasAleatorio(bebidas);
        } else {
            this.bebidas = bebidas;
        }
        if (typeof comidas == "number") {
            this.setComidasAleatorio(comidas);
        } else {
            this.comidas = comidas;
        }
        this.currencyFormatter = null;

    }

    addComida(comida = new Comida()) {
        this.comidas.push(comida);
    }

    addBebida(bebida = new Bebida()) {
        this.bebidas.push(bebida);
    }

    setComidasAleatorio(numComidas) {
        this.comidas = [];
        for (let i = 0; i < numComidas; i++) {
            this.addComida();
        }
    }

    setBebidasAleatorio(numBebidas) {
        this.bebidas = [];
        for (let i = 0; i < numBebidas; i++) {
            this.addBebida();
        }
    }

    setCurrencyFormatter(currencyFormatter) {
        this.currencyFormatter = currencyFormatter;
        this.bebidas.forEach(bebida => bebida.setCurrencyFormatter(this.currencyFormatter));
        this.bebidas.forEach(comida => comida.setCurrencyFormatter(this.currencyFormatter));
    }

    _createTable(headLabels, clase, productos) {
        let table = document.createElement("table");
        table.setAttribute("class", clase);

        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        headLabels.forEach(label => {
            let td = document.createElement("th");
            td.appendChild(document.createTextNode(label));
            tr.appendChild(td);
        });
        thead.appendChild(tr);
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        productos.forEach(producto => producto.pintar(tbody));
        table.appendChild(tbody);

        return table;
    }

    _appendElement(contenedor) {
        this.view = contenedor;

        let head = document.createElement("h2");
        head.appendChild(document.createTextNode("Carta"));
        this.view.appendChild(head);

        let head1 = document.createElement("h3");
        head1.appendChild(document.createTextNode("Bebidas"));
        this.view.appendChild(head1);

        this.view.appendChild(this._createTable(["Producto", "Calorias", "Precio", "Alcohol"], "bebidas", this.bebidas));

        let head2 = document.createElement("h3");
        head2.appendChild(document.createTextNode("Comidas"));
        this.view.appendChild(head2);

        this.view.appendChild(this._createTable(["Producto", "Calorias", "Precio", "Tipo"], "comidas", this.comidas));

    }

    _updateElement() {
        this.bebidas.forEach(bebida => bebida.pintar());
        this.comidas.forEach(comida => comida.pintar());
    }

    pintar(contenedor) {
        if (this.view) {
            this._updateElement();
        } else {
            this._appendElement(contenedor);
        }
    }
}

/* ********** Clase Restaurante ********** */

class Restaurante {
    constructor(
        id = Util.getSecuentialId('Restaurante'),
        nombre = "El mesón de " + Util.getNombreAleatorio(),
        mesas = 30,
        camareros = 5,
        carta = new Carta(),
        currencyFormatter = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })
    ) {

        this.id = id;
        this.nombre = nombre;

        if (typeof mesas == "number") {
            this.setMesasAleatorio(mesas);
        } else {
            this.mesas = mesas;
        }

        if (typeof camareros == "number") {
            this.setCamarerosAleatorio(camareros);
        } else {
            this.camareros = camareros;
        }

        this.carta = carta;

        this.recepcion = new Recepcion();

        this.setCurrencyFormatter(currencyFormatter);

    }

    addMesa(mesa = new Mesa()) {
        this.mesas.push(mesa);
    }

    addCamarero(camarero = new Camarero()) {
        this.camareros.push(camarero);
    }

    setMesasAleatorio(numMesas) {
        this.mesas = [];
        for (let i = 0; i < numMesas; i++) {
            this.addMesa();
        }
    }

    setCamarerosAleatorio(numCamareros) {
        this.camareros = [];
        for (let i = 0; i < numCamareros; i++) {
            this.addCamarero();
        }
    }

    setCurrencyFormatter(currencyFormatter) {
        this.currencyFormatter = currencyFormatter;
        this.carta.setCurrencyFormatter(this.currencyFormatter);
        this.mesas.forEach(mesa => mesa.setCurrencyFormatter(this.currencyFormatter));
    }

    recibirClientes() {
        let grupo = this.recepcion.grupos.shift();
        if (grupo) {
            var mesa = this.mesas.find(mesa => !mesa.ocupada && mesa.capacidad == grupo.personas.length);
            if (!mesa) {
                let mesas = this.mesas.filter(mesa => !mesa.ocupada && mesa.capacidad > grupo.personas.length);
                if (mesas.length) {
                    mesas.sort((a, b) => a.capacidad - b.capacidad);
                    mesa = mesas[0];
                }
            }
            if (mesa) {
                console.log(`Acomodando ${grupo.personas.length} personas en la mesa ${mesa.id} (capacidad: ${mesa.capacidad})`);
                mesa.ocupada = true;
                grupo.personas.forEach(cliente => mesa.addPersona(cliente));
            } else {
                console.log("No hay mesa disponible para un grupo de " + grupo.personas.length + " personas");
            }
        } else {
            console.log("No hay personas en recepción");
        }
    }

    tomarNota() {
        this.mesas.forEach(mesa => mesa.tomarNota(this.carta));
    }

    ejecutarCiclo() {
        console.log("Ejecutando ciclo " + Util.getSecuentialId("ciclo"));
        this.camareros.forEach(camarero => camarero.ejecutarCiclo());
        this.mesas.forEach(mesa => mesa.ejecutarCiclo());
        this.pintar();
    }

    _appendElement() {

        /* CONTROLES */
        let controles = document.createElement("nav");
        let traerClientes = document.createElement("button");
        traerClientes.appendChild(document.createTextNode("Traer clientes"));
        traerClientes.onclick = () => this.recepcion.addGruposAleatorio(Util.getRandomInt(1, 3));
        controles.appendChild(traerClientes);

        let recibirClientes = document.createElement("button");
        recibirClientes.appendChild(document.createTextNode("Recibir clientes"));
        recibirClientes.onclick = () => this.recibirClientes();
        controles.appendChild(recibirClientes);

        let tomarNota = document.createElement("button");
        tomarNota.appendChild(document.createTextNode("Tomar Nota"));
        tomarNota.onclick = () => this.tomarNota();
        controles.appendChild(tomarNota);

        let cerrarRestaurante = document.createElement("button");
        cerrarRestaurante.appendChild(document.createTextNode("Cerrar"));
        cerrarRestaurante.onclick = () => this.cerrarRestaurante();
        controles.appendChild(cerrarRestaurante);
        document.body.appendChild(controles);

        /* CARTA Y RESTAURANTE */
        this.view = document.createElement("div");
        this.view.setAttribute("class", "contenedor");

        let head = document.createElement("h1");
        head.appendChild(document.createTextNode(this.nombre));
        this.view.appendChild(head);

        let col1 = document.createElement("div");
        col1.setAttribute("class", "col");
        let carta = document.createElement("aside");
        carta.setAttribute("class", "carta");
        this.carta.pintar(carta);
        col1.appendChild(carta);
        this.view.appendChild(col1);

        let col2 = document.createElement("div");
        col2.setAttribute("class", "col");
        let mesas = document.createElement("article");
        mesas.setAttribute("class", "mesas");
        this.mesas.forEach(mesa => mesa.pintar(mesas));
        col2.appendChild(mesas);
        this.view.appendChild(col2);

        document.body.appendChild(this.view);

        /* RECEPCION */
        let recepcion = document.createElement("footer");
        recepcion.setAttribute("class", "recepcion");
        this.recepcion.pintar(recepcion);
        document.body.appendChild(recepcion);
    }

    _updateElement() {
        this.carta.pintar();
        this.mesas.forEach(mesa => mesa.pintar());
        this.recepcion.pintar();
    }

    pintar() {
        if (this.view) {
            this._updateElement();
        } else {
            this._appendElement();
        }
    }

    iniciarIntervalo() {
        this.pintar();
        this.intervalID = setInterval(() => this.ejecutarCiclo(), 1000);
    }

    cerrarRestaurante() {
        clearInterval(this.intervalID);
    }
}

/* ********** Clase GrupoPersonas ********** */

class GrupoPersonas {
    constructor(
        id = Util.getSecuentialId('GrupoPersonas'),
        personas = Util.getRandomInt(1, 20)
    ) {

        this.id = id;

        if (typeof personas == "number") {
            this.setPersonasAleatorio(personas);
        } else {
            this.personas = personas;
        }
    }

    addPersona(persona = new Cliente()) {
        this.personas.push(persona);
    }

    setPersonasAleatorio(numPersonas) {
        this.personas = [];
        for (let i = 0; i < numPersonas; i++) {
            this.addPersona();
        }
    }

    pintar(contenedor) {
        var htmlGrupo = this.personas.length + this.personas.reduce((html, persona) => html + persona.emojis.feliz, "");

        let grupo = document.createElement("span");
        grupo.setAttribute("class", "grupo");
        grupo.appendChild(document.createTextNode(htmlGrupo));

        contenedor.appendChild(grupo);
    }
}

/* ********** Clase Recepcion ********** */

class Recepcion {
    constructor(
        id = Util.getSecuentialId('Recepcion'),
        grupos = []
    ) {

        this.id = id;
        this.grupos = grupos;

    }

    addGrupo(grupo = new GrupoPersonas()) {
        this.grupos.push(grupo);
    }

    addGruposAleatorio(numgrupos) {
        for (let i = 0; i < numgrupos; i++) {
            this.addGrupo();
        }
    }

    ejecutarCiclo() {
        //...
        this.pintar();
    }

    _appendElement(contenedor) {
        this.view = contenedor;

        let head = document.createElement("h2");
        head.appendChild(document.createTextNode("Recepción"));
        this.view.appendChild(head);

        let espera = document.createElement("div");
        espera.setAttribute("class", "espera");
        this.grupos.forEach(grupo => grupo.pintar(espera));

        this.view.appendChild(espera);
    }

    _updateElement() {
        let espera = this.view.querySelector(".espera");
        while (espera.firstChild) {
            espera.removeChild(espera.firstChild);
        }
        this.grupos.forEach(grupo => grupo.pintar(espera));
    }

    pintar(contenedor) {
        if (this.view) {
            this._updateElement();
        } else {
            this._appendElement(contenedor);
        }
    }
}

/* ********** Clase Orden ********** */

class Orden {
    constructor(
        id = Util.getSecuentialId('Orden'),
        bebidas = [],
        comidas = []
    ) {

        this.id = id;
        this.bebidas = bebidas;
        this.comidas = comidas;
        this.currencyFormatter = null;

    }

    addComida(comida) {
        this.comidas.push(comida);
    }

    addBebida(bebida) {
        this.bebidas.push(bebida);
    }

    getNombres() {
        return this.bebidas.map(bebida => bebida.nombre).concat(this.comidas.map(comida => comida.nombre));
    }

    setCurrencyFormatter(currencyFormatter) {
        this.currencyFormatter = currencyFormatter;
        this.bebidas.forEach(bebida => bebida.setCurrencyFormatter(this.currencyFormatter));
        this.bebidas.forEach(comida => comida.setCurrencyFormatter(this.currencyFormatter));
    }
}


/* ********** Instancia de Restaurante ********** */

let restaurante;

window.onload = () => {

    restaurante = new Restaurante();
    restaurante.iniciarIntervalo();

}