class APIClient {

    get(url) {
        let misCabeceras = new Headers();

        let miInit = {
            method: 'GET',
            headers: misCabeceras
        };

        return fetch(url, miInit)
            .then(response => {
                console.log(response);
                return response.json();
            });
    }

    post(url, data) {
        let misCabeceras = new Headers();

        let formData = new FormData();
        for (let key in data) {
            console.log(key + ": " + data[key]);
            formData.append(key, data[key]);
        }

        let miInit = {
            method: 'POST',
            headers: misCabeceras,
            body: formData
        };

        return fetch(url, miInit)
            .then(response => {
                console.log(response);
                return response.json();
            });
    }

    delete(url) {
        let misCabeceras = new Headers();

        let miInit = {
            method: 'DELETE',
            headers: misCabeceras
        };

        return fetch(url, miInit)
            .then(response => {
                console.log(response);
                return response.text();
            });
    }

    put(url, data) {
        let misCabeceras = new Headers();

        let formData = new FormData();
        for (let key in data) {
            console.log(key + ": " + data[key]);
            formData.append(key, data[key]);
        }

        let miInit = {
            method: 'PUT',
            headers: misCabeceras,
            body: formData
        };

        return fetch(url, miInit)
            .then(response => {
                console.log(response);
                return response.json();
            });
    }
}

const Util = {
    crearElementoSimple(tag, clase, valor) {
        let elemento = document.createElement(tag);
        elemento.setAttribute("class", clase);
        elemento.appendChild(document.createTextNode(valor));
        return elemento;
    },
    crearElementoCampo(tag, clase, etiqueta, nombre, valor = "") {
        let elemento = document.createElement(tag);
        elemento.setAttribute("class", clase);

        let label = document.createElement("label");
        label.setAttribute("for", nombre);
        label.appendChild(document.createTextNode(etiqueta));
        elemento.appendChild(label);

        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", nombre);
        input.setAttribute("name", nombre);
        input.setAttribute("value", valor);
        input.setAttribute("required", true);
        elemento.appendChild(input);

        return elemento;
    }
}

class Personaje {
    constructor(nombre, arma, profesion, deuda, id) {
        this.nombre = nombre;
        this.arma = arma;
        this.profesion = profesion;
        this.deuda = deuda;
        this.id = id;
    }

    pintar(tbody, botones = []) {
        let tr = document.createElement("tr");
        tr.appendChild(Util.crearElementoSimple("td", "id", this.id));
        tr.appendChild(Util.crearElementoSimple("td", "nombre", this.nombre));
        tr.appendChild(Util.crearElementoSimple("td", "arma", this.arma));
        tr.appendChild(Util.crearElementoSimple("td", "profesion", this.profesion));
        tr.appendChild(Util.crearElementoSimple("td", "deuda", this.deuda));
        if (botones.length) {
            let td = document.createElement("td");
            botones.forEach(boton => {
                td.setAttribute("class", "acciones");
                let button = document.createElement("button");
                button.setAttribute("class", boton.clase);
                button.appendChild(document.createTextNode(boton.texto));
                button.setAttribute("type", "button");
                button.onclick = boton.onclick;
                td.appendChild(button);
            });
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    static pintarCabecera(thead, acciones) {
        let tr = document.createElement("tr");
        tr.appendChild(Util.crearElementoSimple("th", "id", "ID"));
        tr.appendChild(Util.crearElementoSimple("th", "nombre", "Nombre"));
        tr.appendChild(Util.crearElementoSimple("th", "arma", "Arma"));
        tr.appendChild(Util.crearElementoSimple("th", "profesion", " Profesión"));
        tr.appendChild(Util.crearElementoSimple("th", "deuda", "Deuda"));
        if (acciones) {
            tr.appendChild(Util.crearElementoSimple("th", "acciones", acciones));
        }
        thead.appendChild(tr);
    }

    static pintarForm(contenedor, personaje, botones = []) {
        let form = document.createElement("form");

        form.appendChild(Util.crearElementoCampo("span", "item nombre", "Nombre", "nombre", personaje ? personaje.nombre : ""));
        form.appendChild(Util.crearElementoCampo("span", "item arma", "Arma", "arma", personaje ? personaje.arma : ""));
        form.appendChild(Util.crearElementoCampo("span", "item profesion", "Profesión", "profesion", personaje ? personaje.profesion : ""));
        form.appendChild(Util.crearElementoCampo("span", "item deuda", "Deuda", "deuda", "1"));

        form.deuda.setAttribute("type", "checkbox");
        form.deuda.removeAttribute("required");
        if (personaje && personaje.deuda && personaje.deuda != "false") {
            form.deuda.setAttribute("checked", true);
        }

        botones.forEach(boton => {
            let button = document.createElement("button");
            button.setAttribute("class", "item " + boton.clase);
            button.appendChild(document.createTextNode(boton.texto));
            if (boton.reset) {
                button.setAttribute("type", "reset");
            } else {
                button.setAttribute("type", "button");
                button.onclick = () => {
                    if (form.checkValidity()) {
                        if (!personaje) {
                            personaje = new Personaje(form.nombre.value, form.arma.value, form.profesion.value, form.deuda.checked);
                        } else {
                            personaje.nombre = form.nombre.value;
                            personaje.arma = form.arma.value;
                            personaje.profesion = form.profesion.value;
                            personaje.deuda = form.deuda.checked
                        }
                        boton.onclick(personaje, form);
                    } else {
                        boton.onerror("Hay errores en los datos", form);
                    }
                };
            }
            form.appendChild(button);
        });

        contenedor.appendChild(form);
    }
}

class PersonajeClient {
    constructor(urlBase = "https://ironhack-characters.herokuapp.com") {
        this.urlBase = urlBase;
        this.apiClient = new APIClient();
    }

    getPersonajes() {
        return this.apiClient.get(
            this.urlBase + "/characters"
        ).then(
            data => {
                console.log(data);
                let personajes = [];
                data.forEach(item => personajes.push(new Personaje(item.name, item.weapon, item.occupation, item.debt, item.id)));
                return personajes;
            }
        );
    }

    postPersonaje(personaje) {

        let data = {
            name: personaje.nombre,
            occupation: personaje.profesion,
            debt: personaje.deuda,
            weapon: personaje.arma
        }

        return this.apiClient.post(
            this.urlBase + "/characters",
            data
        ).then(
            item => {
                console.log(item);
                let personaje = new Personaje(item.name, item.weapon, item.occupation, item.debt, item.id)
                return personaje;
            }
        );

    }

    deletePersonaje(personaje) {
        return this.apiClient.delete(
            this.urlBase + "/characters/" + personaje.id
        ).then(
            data => {
                console.log(data);
                return data;
            }
        );
    }

    putPersonaje(personaje) {

        let data = {
            id: personaje.id,
            name: personaje.nombre,
            occupation: personaje.profesion,
            debt: personaje.deuda,
            weapon: personaje.arma
        }

        return this.apiClient.put(
            this.urlBase + "/characters/" + personaje.id,
            data
        ).then(
            item => {
                console.log(item);
                let personaje = new Personaje(item.name, item.weapon, item.occupation, item.debt, item.id);
                return personaje;
            }
        );

    }
}

class ListaPersonajes {
    constructor() {
        this.lista = [];
        this.personajeClient = new PersonajeClient();
        this.contenedorLista = null;
    }
    addPersonaje(personaje) {
        this.lista.push(personaje);
    }
    getPersonajes() {
        this.personajeClient.getPersonajes(
        ).then(
            personajes => {
                this.lista = personajes.sort((a, b) => b.id - a.id);
                this.pintar();
            }
        );
    }
    postPersonaje(personaje) {
        this.personajeClient.postPersonaje(
            personaje
        ).then(
            personajeCreado => {
                console.log("Personaje creado correctamente");
                console.log(personajeCreado);
                this.getPersonajes();
            }
        );
    }
    deletePersonaje(personaje) {
        this.personajeClient.deletePersonaje(
            personaje
        ).then(
            data => {
                console.log("Personaje eliminado correctamente");
                console.log(data);
                this.getPersonajes();
            }
        );
    }
    editPersonaje(personaje) {
        console.log("Personaje para editar");
        console.log(personaje);
        this.pintarForm(personaje);
    }
    putPersonaje(personaje) {
        this.personajeClient.putPersonaje(
            personaje
        ).then(
            personajeModificado => {
                console.log("Personaje modificado correctamente");
                console.log(personajeModificado);
                this.pintarForm();
                this.getPersonajes();
            }
        );
    }
    pintarContendor() {
        let contenedor = document.body;
        while (contenedor.firstChild) {
            contenedor.removeChild(contenedor.firstChild);
        }
        this.contenedorForm = document.createElement("div");
        this.contenedorForm.setAttribute("class", "contenedor");
        contenedor.appendChild(this.contenedorForm);

        let contenedorButton = document.createElement("div");
        contenedorButton.setAttribute("class", "contenedor");
        let button = document.createElement("button");
        button.setAttribute("class", "listar");
        button.appendChild(document.createTextNode("Refrescar"));
        button.setAttribute("type", "button");
        button.onclick = () => this.getPersonajes();
        contenedorButton.appendChild(button);
        contenedor.appendChild(contenedorButton);

        this.contenedorLista = document.createElement("div");
        this.contenedorLista.setAttribute("class", "contenedor");
        contenedor.appendChild(this.contenedorLista);
    }
    pintarForm(personaje) {
        while (this.contenedorForm.firstChild) {
            this.contenedorForm.removeChild(this.contenedorForm.firstChild);
        }
        let botones = [{
            clase: "crear",
            texto: personaje ? "Modificar" : "Crear",
            onclick: (personaje, form) => {
                console.log(personaje);
                console.log(form);
                console.log(this);
                if (personaje.id) {
                    this.putPersonaje(personaje);
                } else {
                    this.postPersonaje(personaje);
                }
            },
            onerror: (error, form) => {
                console.log(error);
            }
        }, {
            clase: "reset",
            texto: "Reset",
            reset: true
        }];
        if (personaje) {
            botones.push({
                clase: "cancelar",
                texto: "Cancelar",
                onclick: (personaje, form) => this.pintarForm(),
                onerror: (error, form) => this.pintarForm()
            });
        }
        Personaje.pintarForm(this.contenedorForm, personaje, botones);
    }
    pintarLista() {
        while (this.contenedorLista.firstChild) {
            this.contenedorLista.removeChild(this.contenedorLista.firstChild);
        }
        let table = document.createElement("table");
        table.setAttribute("class", "personajes");

        let thead = document.createElement("thead");
        Personaje.pintarCabecera(thead, "Acciones");
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        this.lista.forEach(personaje => personaje.pintar(
            tbody, [{
                clase: "eliminar",
                texto: "Eliminar",
                onclick: () => this.deletePersonaje(personaje)
            }, {
                clase: "editar",
                texto: "Editar",
                onclick: () => this.editPersonaje(personaje)
            }]));
        table.appendChild(tbody);

        this.contenedorLista.appendChild(table);
    }
    pintar() {
        if (!this.contenedorForm || !this.contenedorLista) {
            this.pintarContendor();
            this.pintarForm();
        }
        this.pintarLista();
    }
}

let almacen = null;

window.onload = () => {
    almacen = new ListaPersonajes();
    almacen.getPersonajes();
}


function hacerGetDePersonajesConFetch() {
    var url = "https://ironhack-characters.herokuapp.com/characters";
    var misCabeceras = new Headers();
    var miInit = {
        method: 'GET',
        headers: misCabeceras
    };
    var prueba = fetch(url, miInit)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(dataJson => {
            console.log(dataJson);
            return true;
        });
}