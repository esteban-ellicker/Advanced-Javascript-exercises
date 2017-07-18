
/*  Ejercicio 008__001


Realiza una agenda de contactos que se persista en el navegador.

Trata de realizar la mayor abstracción posib​le: en el HTML no puede haber nada más que la importación del script JS. Los botones de acciones no pueden hacer referencia a ningún objeto (deberás añadir las acciones con addEventListener de arrow functions o funciones bindeadas). Haz que la agenda se pinte haciendo llamadas a pintar de cada contacto.

Pasos:

1) Crea la clase contacto que almacenará los datos básicos de una persona:

- Nombre
- Apellidos
- Email
- URL fotografía

2) Crea la clase Agenda que almacene los contactos de un usuario.

3) Maqueta la agenda de contactos. Puedes hacer uso de una tabla o si lo quieres hacer más visual puedes usar divs y darles el estilo que quieras.

4) Crea un botón que al ser pulsado muestre un formulario que permita la creación de un contacto en la agenda. El formulario tendrá los campos necesarios para la creación y además los botones "Guardar" y "Cerrar". Guardar se encargará de guardar el contacto y cerrar ocultará de nuevo el formulario. Cuando se cree un contacto se deberá mostrar en el listado de contactos de la agenda.

5) Haz que la agenda completa se guarde en LocalStorage de manera que cada vez que abramos la página web se muestre la agenda completa.

BONUS:

6) Añade un botón eliminar en cada contacto que permita el borrado de este.

7) Añade un botón modificar que haga editable la información de un usuario. 

8) Permite la ordenación de la agenda por Nombre o por apellido​







Ejemplo de código con localStorage:


class Persona{
    constructor(nombre = null, apellido = null){
        this._nombre = nombre;
        this._apellido = apellido;
    }

    dimeNombre(){
        alert(this._nombre);
    }

    setParamsDePersonaConObjeto(personaComoObjeto){
        this._nombre = personaComoObjeto._nombre;
        this._apellido = personaComoObjeto._apellido;
    }
}

function getPersonaFromLocalStorage(){
    let personaAsString = localStorage.getItem("persona");
    let persona = JSON.parse(personaAsString);
    return persona;
}

function setPersonaAtLocalStorage(persona){
    let persona1AsString = JSON.stringify(persona);
    localStorage.setItem("persona", persona1AsString);
}


if(!getPersonaFromLocalStorage()){
    debugger;
    let persona1 = new Persona("Fran", "Linde");
    setPersonaAtLocalStorage(persona1);
}else{
    let objeto = getPersonaFromLocalStorage();
    let persona3 = new Persona();
    persona3.setParamsDePersonaConObjeto(objeto);

    console.log(persona3);
}




*/




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

        let label = document.createElement("span");
        label.setAttribute("class", "label");
        label.appendChild(document.createTextNode(etiqueta));
        elemento.appendChild(label);

        let data = document.createElement("span");
        data.setAttribute("class", "data " + nombre);
        data.appendChild(document.createTextNode(valor));
        elemento.appendChild(data);

        return elemento;
    },
    crearElementoCampoEditable(tag, clase, etiqueta, nombre, valor = "") {
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
        elemento.appendChild(input);

        return elemento;
    }
}

class Contacto {
    constructor(nombre, apellidos, email, urlFoto, id) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.urlFoto = urlFoto;
        this.id = id;
    }

    static getFromObject(object) {
        return new Contacto(object.nombre, object.apellidos, object.email, object.urlFoto, object.id);
    }

    pintar(tbody, botones = []) {
        let tr = document.createElement("tr");
        tr.appendChild(Util.crearElementoSimple("td", "id", this.id));
        tr.appendChild(Util.crearElementoSimple("td", "nombre", this.nombre));
        tr.appendChild(Util.crearElementoSimple("td", "apellidos", this.apellidos));
        tr.appendChild(Util.crearElementoSimple("td", "email", this.email));
        tr.appendChild(Util.crearElementoSimple("td", "urlFoto", this.urlFoto));
        if (botones.length) {
            let td = document.createElement("td");
            botones.forEach(boton => {
                td.setAttribute("class", "acciones");
                let button = document.createElement("button");
                button.setAttribute("class", boton.clase);
                button.appendChild(document.createTextNode(boton.texto));
                button.setAttribute("type", "button");
                button.onclick = () => boton.onclick(this);
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
        tr.appendChild(Util.crearElementoSimple("th", "apellidos", "Apellidos"));
        tr.appendChild(Util.crearElementoSimple("th", "email", " E-mail"));
        tr.appendChild(Util.crearElementoSimple("th", "urlFoto", "URL Foto"));
        if (acciones) {
            tr.appendChild(Util.crearElementoSimple("th", "acciones", acciones));
        }
        thead.appendChild(tr);
    }

    static pintarForm(contenedor, contacto, botones = []) {
        let form = document.createElement("form");

        form.appendChild(Util.crearElementoCampoEditable("span", "item nombre", "Nombre", "nombre", contacto ? contacto.nombre : ""));
        form.appendChild(Util.crearElementoCampoEditable("span", "item apellidos", "Apellidos", "apellidos", contacto ? contacto.apellidos : ""));
        form.appendChild(Util.crearElementoCampoEditable("span", "item email", "E-mail", "email", contacto ? contacto.email : ""));
        form.appendChild(Util.crearElementoCampoEditable("span", "item urlFoto", "URL Foto", "urlFoto", contacto ? contacto.urlFoto : ""));

        form.nombre.setAttribute("required", true);
        form.apellidos.setAttribute("required", true);
        form.email.setAttribute("required", true);

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
                        if (!contacto) {
                            contacto = new Contacto(form.nombre.value, form.apellidos.value, form.email.value, form.urlFoto.value);
                        } else {
                            contacto.nombre = form.nombre.value;
                            contacto.apellidos = form.apellidos.value;
                            contacto.email = form.email.value;
                            contacto.urlFoto = form.urlFoto.value;
                        }
                        boton.onclick(contacto, form);
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

class AgendaStorage {

    constructor(itemName) {
        this.itemName = itemName;
    } 

     getContactos() {
        let itemString = localStorage.getItem(this.itemName);
        let item = JSON.parse(itemString);
        return item;
    }

     setContactos(item) {
        let itemString = JSON.stringify(item);
        localStorage.setItem(this.itemName, itemString);
    }
    
}

class Agenda {
    constructor() {
        this.lista = [];
        this.storage = new AgendaStorage("contactos");
        this.contenedorLista = null;
        this.contenedorForm = null;
    }

    addContacto(contacto) {
        this.lista.push(contacto);
    }

    getContactoById(id) {
        return this.lista.find(contacto => contacto.id == contacto);
    }

    loadContactos() {
        this.lista = [];
        let objArray = this.storage.getContactos();
        if (objArray) {
            objArray.forEach(object => {
                let contacto = Contacto.getFromObject(object);
                this.lista.push(contacto);
            });
        }
        this.pintar();
    }

    saveContactos() {
        this.storage.setContactos(this.lista);
        this.pintar();
    }

    saveContacto(contactoForm) {
        if (contactoForm.id) {
            let contactoLista = this.getContactoById(contactoForm.id);
            contactoLista = contactoForm;
        } else {
            contactoForm.id = agenda.lista.reduce((maxId, contacto) => Math.max(maxId, contacto.id),0) + 1;
            this.lista.push(contactoForm);
        }
        this.saveContactos();
    }

    deleteContacto(contacto) {
        var index = this.lista.indexOf(contacto);
        this.lista.splice(index, 1);
        this.saveContactos();
    }

    deleteContactoById(id) {
        var index = this.lista.findIndex(contacto => contacto.id = id);
        this.lista.splice(index, 1);
        this.saveContactos();
    }

    editContacto(contacto) {
        console.log("Contacto para editar");
        console.log(contacto);
        this.pintarForm(contacto);
    }

    pintarContendor() {
        let contenedor = document.body;
        while (contenedor.firstChild) {
            contenedor.removeChild(contenedor.firstChild);
        }
        this.contenedorForm = document.createElement("div");
        this.contenedorForm.setAttribute("class", "popup");
        this.contenedorForm.setAttribute("style", "display: none");
        contenedor.appendChild(this.contenedorForm);

        let contenedorButton = document.createElement("div");
        contenedorButton.setAttribute("class", "contenedor");

        let buttonRefrescar = document.createElement("button");
        buttonRefrescar.setAttribute("class", "listar");
        buttonRefrescar.appendChild(document.createTextNode("Refrescar"));
        buttonRefrescar.setAttribute("type", "button");
        buttonRefrescar.onclick = () => this.loadContactos();
        contenedorButton.appendChild(buttonRefrescar);

        let buttonAgregar = document.createElement("button");
        buttonAgregar.setAttribute("class", "listar");
        buttonAgregar.appendChild(document.createTextNode("Agregar"));
        buttonAgregar.setAttribute("type", "button");
        buttonAgregar.onclick = () => this.pintarForm();
        contenedorButton.appendChild(buttonAgregar);

        contenedor.appendChild(contenedorButton);

        this.contenedorLista = document.createElement("div");
        this.contenedorLista.setAttribute("class", "contenedor");
        contenedor.appendChild(this.contenedorLista);
    }
    cerrarForm(){
        this.contenedorForm.setAttribute("style", "display: none");
    }
    pintarForm(contacto) {
        while (this.contenedorForm.firstChild) {
            this.contenedorForm.removeChild(this.contenedorForm.firstChild);
        }
        let botones = [{
            clase: "crear",
            texto: contacto ? "Modificar" : "Crear",
            onclick: (contacto, form) => {
                console.log(contacto);
                console.log(form);
                console.log(this);
                this.saveContacto(contacto);
                this.cerrarForm();
            },
            onerror: (error, form) => {
                console.log(error);
            }
        }, {
            clase: "reset",
            texto: "Reset",
            reset: true
        }, {
            clase: "cerrar",
            texto: "Cerrar",
            onclick: (contacto, form) => this.cerrarForm(),
            onerror: (error, form) => this.cerrarForm()
        }];

        Contacto.pintarForm(this.contenedorForm, contacto, botones);
        this.contenedorForm.setAttribute("style", "display: block");
    }
    pintarLista() {
        this.cerrarForm();
        while (this.contenedorLista.firstChild) {
            this.contenedorLista.removeChild(this.contenedorLista.firstChild);
        }
        let table = document.createElement("table");
        table.setAttribute("class", "contactos");

        let thead = document.createElement("thead");
        Contacto.pintarCabecera(thead, "Acciones");
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        this.lista.forEach(contacto => contacto.pintar(
            tbody, [{
                clase: "eliminar",
                texto: "Eliminar",
                onclick: contacto => this.deleteContacto(contacto)
            }, {
                clase: "editar",
                texto: "Editar",
                onclick: contacto => this.editContacto(contacto)
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

let agenda = null;

window.onload = () => {
    agenda = new Agenda();
    agenda.loadContactos();
};