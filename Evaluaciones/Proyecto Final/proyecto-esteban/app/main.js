/*

Proyecto final

El proyecto final consistirá en la realización de una Web-App o SPA basada en JavaScript, HTML y CSS. No se permite el uso de ningún framework JavaScript, aunque se recomienda hacer uso de algún framework CSS que facilite realizar la estructura de las páginas (Bootstrap, Foundation, Skeleton, Materialize...).

En caso de usar alguna librería, se recomienda hacer uso de algún framework para gestionar dependencias (Bower, NPM...).

La SPA deberá contar al menos 5 páginas, de las cuales una de ellas deberá ser un login, que deberá permitir recordar contraseña. Si no hemos iniciado sesión no podremos ir a ningún parte dentro de la App.

Todas las páginas (exceptuando el login) deberán hacer uso de servicios REST para cargar sus datos.

Parte 1

Como se ha comentado en la introducción, no se permite el uso de ningún framework JavaScript, así que vamos a tratar de hacer nuestro propio framework:

Analiza las necesidades del proyecto y piensa una estructura de proyecto lo más flexible posible. Deberás generar:

1) Un sistema de “navegación”: puedes cambiar la URL de la página en la que te encuentras sin necesidad de recargar la página con:

    window.history.pushState("Datos a enviar", "Nuevo título", "/nueva-url");

2) Un sistema de páginas: puedes gestionar que el cambio de URL esté asociado al cambio de “página”. Realmente no tendremos páginas, pero simularemos el comportamiento cambiando el contenido de nuestra página. Haz que la página sea una clase y que tenga un método de pintado. Puedes usar herencia dentro de las páginas y hacer por ejemplo un tipo de páginas con Cabecera y Footer y otras que no tengan.

3) Una clase App o Main que se encargue de orquestar toda la APP.

4) Una clase APIClient que se encargue de realizar todas las peticiones HTTP necesarias, recuerda que debe ser transparente y no debe “conocer” la estructura ni las rutas de la API que vayas a usar.

5) Una clase clase xClient que sea el cliente de tu API (el nombre dependerá de la API que sea accedida). Esta clase será la responsable de conocer las rutas de tu API y modelará los objetos de respuesta.

6) Una pantalla o capa de Loading que pueda ser activada o desactivada. De manera que cuando realicemos alguna petición HTTP nos impida hacer click cualquier botón de la pantalla.

*/


/* ***** APIS GENERICAS ***** */

class HtmlUtil {
    static removeChilds(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    static createText(text) {
        return document.createTextNode(text);
    }
    static createElement({
        tag,
        text = null,
        attr = {},
        events = {}
    }) {

        let element = document.createElement(tag);
        for (let key in attr) {
            element.setAttribute(key, attr[key]);
        }
        for (let key in events) {
            element.addEventListener(key, events[key]);
        }
        if (text !== null) {
            element.appendChild(document.createTextNode(text));
        }
        return element;
    }
    static createElementWithChildren({
        tag,
        attr = {},
        events = {},
        children = []
    }) {

        let elements = [];
        let element = HtmlUtil.createElement({ tag: tag, attr: attr });
        elements.push(element);
        for (let child of children) {
            let childElement = HtmlUtil.createElement(child);
            element.appendChild(childElement);
            elements.push(childElement);
        }
        return elements;
    }
    static createButton({
        text,
        click,
        attr = {}
    }) {
        let btnAttr = {
            class: "btn btn-primary",
            type: "button"
        };
        for (let key in attr) {
            btnAttr[key] = attr[key];
        }

        return HtmlUtil.createElement({
            tag: "button",
            text: text,
            attr: btnAttr,
            events: {
                click: click
            }
        });
    }
    static createLabelValuePair({
        tag = "span",
        attr = {},
        labelTag = "label",
        labelText = null,
        labelAttr = {},
        valueTag = "input",
        valueText = null,
        valueAttr = {},
        valueEvents = {}
    }) {

        return HtmlUtil.createElementWithChildren({
            tag: tag,
            attr: attr,
            children: [{
                    tag: labelTag,
                    text: labelText,
                    attr: labelAttr
                },
                {
                    tag: valueTag,
                    text: valueText,
                    attr: valueAttr,
                    events: valueEvents
                }
            ]
        });
    }
    static createModal({
        id,
        title = "",
        buttons = [{
            type: "close",
            text: "Close"
        }],
        content = null
    }) {
        let elements = [];

        let modal = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "id": id,
                "class": "modal fade",
                "role": "dialog"
            }
        });
        elements.push(modal);

        let modalDialog = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "modal-dialog" }
        });
        let modalContent = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "modal-content" }
        });

        let modalHeader = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "modal-header" }
        });
        let modalClose = HtmlUtil.createElement({
            tag: "button",
            attr: {
                "type": "button",
                "class": "close",
                "data-dismiss": "modal"
            },
            text: "(×)"
        });
        modalHeader.appendChild(modalClose);

        let modalTitle = HtmlUtil.createElement({
            tag: "h4",
            attr: { "class": "modal-title" },
            text: title
        });
        modalHeader.appendChild(modalTitle);
        modalContent.appendChild(modalHeader);
        elements.push(modalTitle);

        let modalBody = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "modal-body" }
        });
        if (content) {
            modalBody.appendChild(content);
        }
        modalContent.appendChild(modalBody);
        elements.push(modalBody);

        let modalFooter = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "modal-footer" }
        });
        buttons.forEach(button => {
            let buttonElement = null;
            if (button.type == "close") {
                buttonElement = HtmlUtil.createButton({
                    text: button.text,
                    attr: { "data-dismiss": "modal" }
                });
            } else {
                buttonElement = HtmlUtil.createButton(button);

            }
            modalFooter.appendChild(buttonElement);
            elements.push(buttonElement);
        });
        modalContent.appendChild(modalFooter);

        modalDialog.appendChild(modalContent);

        modal.appendChild(modalDialog);

        return elements;
    }
    static createLoader() {
        //<div class="loader"><img src="loader.svg" /></div>
        let elements = HtmlUtil.createElementWithChildren({
            tag: "div",
            attr: {
                "class": "loader",
                "style": "display: none"
            },
            children: [{
                tag: "img",
                attr: { "src": "loader.svg" }
            }]
        });
        return elements[0];
    }
    static crearTableRow(data, tag = "td") {
        let tr = HtmlUtil.createElement({ tag: "tr" });
        data.forEach(item => {
            if (typeof item == "string") {
                item = {
                    text: item,
                    attr: []
                }
            }
            let td = HtmlUtil.createElement({
                tag: tag,
                text: item.text,
                attr: item.attr
            });
            tr.appendChild(td);
        });
        return tr;
    }
    static hideElement(element) {
        let style = element.getAttribute("style") || "";
        style = "display:none;" + style;
        element.setAttribute("style", style);
    }
    static showElement(element) {
        let style = element.getAttribute("style") || "";
        style = style.replace(/display\s*:\s*none;?/g, "");
        element.setAttribute("style", style);
    }
}

class APIClient {

    _send(
        url, {
            method = "GET",
            headers = new Headers(),
            data = null,
            requestType = "json",
            reponseType = "json"
        } = {}
    ) {
        console.log(`${method} ${url} ––> ${reponseType}`);

        let init = {
            method: method,
            headers: headers,
            mode: 'cors'
        };

        if (data) {
            if (requestType == "json") {
                headers.append('Content-Type', 'application/json');
                init.body = JSON.stringify(data);
            } else {
                let formData = new FormData();
                for (let key in data) {
                    console.log(key + ": " + data[key]);
                    formData.append(key, data[key]);
                }
                init.body = formData;
            }
        }

        return fetch(url, init)
            .then(response => {
                console.log(response);
                let responseObject = null;
                switch (reponseType) {
                    case "json":
                        responseObject = response.json();
                        break;
                    case "text":
                        responseObject = response.text();
                        break;
                    default:
                        responseObject = response;
                }
                return responseObject;
            });
    }

    get(url, reponseType) {
        return this._send(url, {
            reponseType: reponseType
        });
    }

    post(url, data, requestType, reponseType) {
        return this._send(url, {
            method: "POST",
            data: data,
            requestType: requestType,
            reponseType: reponseType
        });
    }

    delete(url, reponseType) {
        return this._send(url, {
            method: 'DELETE',
            reponseType: "text",
            reponseType: reponseType
        });
    }

    put(url, data, requestType, reponseType) {
        return this._send(url, {
            method: "PUT",
            data: data,
            requestType: requestType,
            reponseType: reponseType
        });
    }
}

class StorageListClient {

    constructor(itemName, storage = localStorage) {
        this._storage = storage;
        this.itemName = itemName;
    }

    _save(lista) {
        return new Promise((resolve, reject) => {
            let listaString = JSON.stringify(lista);
            this._storage.setItem(this.itemName, listaString);
            resolve();
        });
    }

    clear() {
        return new Promise((resolve, reject) => {
            let listaString = this._storage.removeItem(this.itemName);
            resolve();
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {
            let listaString = this._storage.getItem(this.itemName);
            let lista = listaString !== null ? JSON.parse(listaString) : [];
            if (id) {
                resolve(lista.find(registro => registro._id == id));
            } else {
                resolve(lista);
            }
        });
    }

    post(data) {
        return this.get().then(
            lista => {
                data._id = lista.reduce((max, registro) => Math.max(max, registro._id), 0) + 1;
                lista.push(data);
                return this._save(lista).then(() => data);
            });
    }

    delete(id) {
        return this.get().then(
            lista => {
                let index = lista.findIndex(registro => registro._id == id);
                let borrado = null;
                let promise = null;
                if (index !== -1) {
                    [borrado] = lista.splice(index, 1);
                    promise = this._save(lista);
                } else {
                    let error = new Error("Registro no encontrado");
                    console.error(error);
                    promise = new Promise((resolve, reject) => reject(error));
                }
                return promise.then(() => borrado);
            });
    }

    put(data) {
        return this.get().then(
            lista => {
                let index = lista.findIndex(registro => registro._id == data._id);
                let actualizado = null;
                let promise = null;
                if (index !== -1) {
                    lista[index] = data;
                    actualizado = data;
                    promise = this._save(lista);
                } else {
                    let error = new Error("Registro no encontrado");
                    console.error(error);
                    promise = new Promise((resolve, reject) => reject(error));
                }
                return promise.then(() => actualizado);
            });
    }
}


/* ***** APIS ESPECIFICAS ***** */

class UsersClient {
    constructor() {
        this._storage = new StorageListClient("users");
    }

    _userFromData(data) {
        return data != null ? new User(
            data._id,
            data.username,
            data.password,
            data.nombre,
            data.rol
        ) : null;
    }

    _dataFromUser(user) {
        return {
            _id: user._id,
            username: user.username,
            password: user.password,
            nombre: user.nombre,
            rol: user.rol
        };
    }

    get(id) {
        return this._storage.get(id)
            .then(lista => {
                let result = null;
                if (lista instanceof Array) {
                    result = lista.map(data => this._userFromData(data));
                } else {
                    result = this._userFromData(lista);
                }
                return result;
            });
    }

    post(user) {
        return this._storage.post(this._dataFromUser(user))
            .then(data => {
                return this._userFromData(data);
            });
    }

    delete(user) {
        return this._storage.delete(user instanceof User ? user._id : user)
            .then(data => {
                return this._userFromData(data);
            })
            .catch(error => {
                error = new Error("Error al eliminar usuario: " + error.message);
                console.error(error);
                throw error;
            });
    }

    put(user) {
        return this._storage.put(this._dataFromUser(user))
            .then(data => {
                return this._userFromData(data);
            })
            .catch(error => {
                error = new Error("Error al actualizar usuario: " + error.message);
                console.error(error);
                throw error;
            });
    }
}

class SessionAPI {

    static getUser() {
        let json = sessionStorage.getItem("user");
        let data = JSON.parse(json);
        return data !== null ? new User(
            data._id,
            data.username,
            data.nombre,
            data.rol
        ) : null;
    }

    static setUser(user) {
        let data = {
            _id: user._id,
            username: user.username,
            nombre: user.nombre,
            rol: user.rol
        };
        let json = JSON.stringify(data);
        sessionStorage.setItem("user", json);
    }

    static getItem(key, defaultValue) {
        let value = sessionStorage.getItem(key);
        return value !== null ? value : defaultValue;
    }

    static setItem(key, value) {
        if (key == "user") {
            throw new Error("Para modificar usuario de la sesión debe usar setUser");
        }
        sessionStorage.setItem(key, value);
    }

    static removeItem(key) {
        if (key == "user") {
            throw new Error("No está permitido eliminar el usuario de la sesión");
        }
        sessionStorage.removeItem(key);
    }

    static clear() {
        sessionStorage.clear();
    }
}

class ComidaClient {
    constructor(urlBase = "http://tuabogadodeaccidentes.es") {
        this.urlBase = urlBase;
        this.apiClient = new APIClient();
    }

    _comidaFromData(data) {
        return data !== null ? new Comida(
            data._id,
            data.nombre,
            data.tipo,
            data.precio,
            data.calorias,
            data.existencias,
            data.__v
        ) : null;
    }

    _dataFormComida(comida) {
        return {
            _id: comida._id,
            nombre: comida.nombre,
            tipo: comida.tipo,
            precio: comida.precio,
            calorias: comida.calorias,
            existencias: comida.existencias,
            __v: comida.__v
        };
    }

    get() {
        return this.apiClient.get(this.urlBase + "/api/comidas")
            .then(lista => {
                console.log(lista);
                let comidas = [];
                lista.forEach(data => comidas.push(this._comidaFromData(data)));
                return comidas;
            });
    }

    post(comida) {
        return this.apiClient.post(
            this.urlBase + "/api/comidas",
            this._dataFormComida(comida)
        ).then(
            data => {
                console.log(data);
                //Object {message: "Comida creada!"}
                return data;
            }
        ).catch(
            data => {
                console.log(data);
                //{code: 11000, index: 0, errmsg: "E11000 duplicate key error index: restaurante.comidas.$nombre_1 dup key: { : "Bife de chorizo" }", op: Object...}
                return data;
            }
        );
    }

    delete(comida) {
        return this.apiClient.delete(
            this.urlBase + "/api/comidas/" + (comida instanceof Comida ? comida._id : comida)
        ).then(data => {
            console.log(data);
            return data;
        });
    }

    put(comida) {
        return this.apiClient.put(
            this.urlBase + "/api/comidas/" + comida._id,
            this._dataFormComida(comida)
        ).then(
            data => {
                console.log(data);
                //{message: "Comida actualizada!"}
                return data;
            }
        ).catch(
            data => {
                console.log(data);
                //{code: ..., index: ..., errmsg: ..., op: Comida...}
                return data;
            }
        );
    }
}

class BebidaClient {
    constructor(urlBase = "http://tuabogadodeaccidentes.es") {
        this.urlBase = urlBase;
        this.apiClient = new APIClient();
    }

    _bebidaFromData(data) {
        return data !== null ? new Bebida(
            data._id,
            data.nombre,
            data.grados,
            data.esAlcoholica,
            data.precio,
            data.calorias,
            data.existencias,
            data.__v
        ) : null;
    }

    _dataFormBebida(bebida) {
        return {
            _id: bebida._id,
            nombre: bebida.nombre,
            grados: bebida.grados,
            esAlcoholica: bebida.esAlcoholica,
            precio: bebida.precio,
            calorias: bebida.calorias,
            existencias: bebida.existencias,
            __v: bebida.__v
        };
    }

    get() {
        return this.apiClient.get(this.urlBase + "/api/bebidas")
            .then(lista => {
                console.log(lista);
                let bebidas = [];
                lista.forEach(data => bebidas.push(this._bebidaFromData(data)));
                return bebidas;
            });
    }

    post(bebida) {
        return this.apiClient.post(
            this.urlBase + "/api/bebidas",
            this._dataFormBebida(bebida)
        ).then(
            data => {
                console.log(data);
                return this._bebidaFromData(data);
            });
    }

    delete(bebida) {
        return this.apiClient.delete(
            this.urlBase + "/api/bebidas/" + (bebida instanceof Bebida ? bebida._id : bebida)
        ).then(data => {
            console.log(data);
            return data;
        });
    }

    put(bebida) {
        return this.apiClient.put(
            this.urlBase + "/api/bebidas/" + bebida._id,
            this._dataFormBebida(bebida)
        ).then(
            data => {
                console.log(data);
                return this._bebidaFromData(data);
            });
    }
}


/* ***** PAGINAS GENERICAS ***** */

class Page {
    constructor(body = document.body) {
        this.body = body;
        this.navigator = null;
        this.contenedor = null;
        this.loader = null;
    }

    setNavigator(navigator) {
        this.navigator = navigator;
    }

    getNavigator(navigator) {
        return this.navigator;
    }

    appendChild(element) {
        this.body.appendChild(element);
    }

    pintarEstructura() {
        this.limpiar();

        /* LOADER */
        this.loader = HtmlUtil.createLoader();
        this.appendChild(this.loader);

        /* CONTENEDOR */
        this.contenedor = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "container" }
        });
        this.appendChild(this.contenedor);
    }

    pintarPagina() {

    }

    pintar() {
        if (!this.contenedor) {
            this.pintarEstructura();
        }
        this.pintarPagina();
    }

    limpiarPagina() {
        HtmlUtil.removeChilds(this.contenedor);
    }

    limpiar() {
        HtmlUtil.removeChilds(this.body);
        this.contenedor = null;
        this.loader = null;
    }

    start() {
        this.limpiar();
        this.pintar();
    }

    showLoader() {
        if (this.loader) {
            HtmlUtil.showElement(this.loader);
        }
    }

    hideLoader() {
        if (this.loader) {
            HtmlUtil.hideElement(this.loader);
        }
    }
}

class PageFragment extends Page {
    constructor(body) {
        super(body);
    }

    pintarEstructura() {
        /* CONTENEDOR */
        this.contenedor = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "container" }
        });
        this.appendChild(this.contenedor);
    }

}

class InnerPage extends Page {
    constructor(body) {
        super(body);
        this.header = new PageHeader(this.body);
        this.footer = new PageFooter(this.body);
    }

    pintarEstructura() {
        this.limpiar();

        /* LOADER */
        this.loader = HtmlUtil.createLoader();
        this.appendChild(this.loader);

        /* HEADER */
        this.header = new PageHeader(this.body);
        this.header.setNavigator(this.navigator);
        this.header.pintar();

        /* CONTENEDOR */
        this.contenedor = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "container" }
        });
        this.appendChild(this.contenedor);

        /* FOOTER */
        this.footer = new PageFooter(this.body);
        this.footer.setNavigator(this.navigator);
        this.footer.pintar();
    }
}

/* ***** PAGINAS ESPECIFICAS DE USO COMPARTIDO ***** */

class PageHeader extends PageFragment {
    constructor(body) {
        super(body);
    }

    pintarPagina() {

        this.limpiarPagina();

        let header = HtmlUtil.createElement({
            tag: "header",
            attr: { "class": "header" },
            text: "--- HEADER ---"
        });

        if (this.navigator && this.navigator.pages) {
            let [nav, ul] = HtmlUtil.createElementWithChildren({
                tag: "nav",
                attr: { "class": "menu" },
                children: [{
                    tag: "ul",
                    attr: { "class": "menu-list" }
                }]
            });
            let thisNavigator = this.navigator;
            let navigate = function(event) {
                thisNavigator.navigateToUrl(this.getAttribute("href"));
                event.preventDefault();
            };
            for (let page in this.navigator.pages) {
                let pageAttr = this.navigator.pages[page];
                let [li, a] = HtmlUtil.createElementWithChildren({
                    tag: "li",
                    attr: { "class": "menu-item" },
                    children: [{
                        tag: "a",
                        attr: {
                            "class": "menu-link",
                            "href": page
                        },
                        events: {
                            "click": navigate
                        },
                        text: pageAttr.title
                    }]
                });
                ul.appendChild(li);
            }
            header.appendChild(nav);
        }

        this.contenedor.appendChild(header);
    }
}

class PageFooter extends PageFragment {
    constructor(body) {
        super(body);
    }

    pintarPagina() {

        this.limpiarPagina();

        let footer = HtmlUtil.createElement({
            tag: "footer",
            attr: { "class": "footer" },
            text: "--- FOOTER ---"
        });

        this.contenedor.appendChild(footer);
    }
}


/* ***** PAGINAS ESPECIFIAS ***** */

class LoginPage extends Page {
    constructor(body) {
        super(body);
        this.authController = null;
        this.loginForm = null;
        this.inputUsername = null;
        this.inputPassword = null;
        this.errorContainer = null;
    }

    start() {
        super.start();
        this.navigator.logout();
    }

    setAuthController(authController) {
        this.authController = authController;
    }

    showError(message) {
        this.errorContainer.innerText = message;
        HtmlUtil.showElement(this.errorContainer);
    }

    hideError(message) {
        HtmlUtil.hideElement(this.errorContainer);
    }

    pintarPagina() {
        this.limpiarPagina();

        let loginContainer = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "login-container" }
        });

        this.loginForm = HtmlUtil.createElement({
            tag: "form",
            attr: { "class": "login" }
        });
        let title = HtmlUtil.createElement({
            tag: "h2",
            attr: { "class": "title" },
            text: "Por favor ingresa con tu usuario y contraseña"
        });
        this.loginForm.appendChild(title);

        let focusHandler = () => this.hideError();

        let [contUser, labelUser, inputUser] = HtmlUtil.createLabelValuePair({
            tag: "span",
            attr: { "class": "etiqueta-valor" },
            labelTag: "label",
            labelAttr: {
                "class": "etiqueta user",
                "for": "user"
            },
            labelText: "Usuario: ",
            valueTag: "input",
            valueAttr: {
                "type": "text",
                "class": "valor user",
                "id": "user",
                "name": "user",
                "required": "",
                "autofocus": "",
                "placeholder": "Nombre de usuario",
                "pattern": ".{4,20}",
                "maxlength": "20"
            },
            valueEvents: {
                "focus": focusHandler
            }
        });
        this.inputUsername = inputUser;
        this.loginForm.appendChild(contUser);

        let [contPass, labelPass, inputPass] = HtmlUtil.createLabelValuePair({
            tag: "span",
            attr: { "class": "etiqueta-valor" },
            labelTag: "label",
            labelAttr: {
                "class": "etiqueta password",
                "for": "password"
            },
            labelText: "Contraseña: ",
            valueTag: "input",
            valueAttr: {
                "type": "password",
                "class": "valor password",
                "id": "password",
                "name": "password",
                "required": "",
                "placeholder": "Contraseña de usuario",
                "pattern": ".{4,20}",
                "maxlength": "20"
            },
            valueEvents: {
                "focus": focusHandler
            }
        });
        this.inputPassword = inputPass;
        this.loginForm.appendChild(contPass);

        let button = HtmlUtil.createButton({
            text: "Login",
            click: () => this.doLogin(),
            attr: {
                "class": "btn btn-lg btn-primary btn-block"
            }
        });
        this.loginForm.appendChild(button);

        this.errorContainer = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "class": "error",
                "style": "display: none"
            }
        });
        this.loginForm.appendChild(this.errorContainer);

        loginContainer.appendChild(this.loginForm);
        this.contenedor.appendChild(loginContainer);

    }

    doLogin() {
        if (this.loginForm.checkValidity()) {
            console.log("OK");
            this.showLoader();
            let username = this.inputUsername.value;
            let password = this.inputPassword.value;
            this.navigator.login(username, password)
                .then(ok => {
                    if (ok) {
                        console.log("¡¡¡Login Ok!!!");
                        this.navigator.navigateToHome();
                    } else {
                        console.error("¡¡¡Login Error!!!");
                        this.inputUsername.value = "";
                        this.inputPassword.value = "";
                        this.showError("El usuario o la contraseña no corresponden");
                    }
                    this.hideLoader();
                });
        }
    }

}

class HomePage extends InnerPage {
    constructor(body) {
        super(body);
    }
}

class ComidaPage extends InnerPage {
    constructor() {
        super();
        this.comidas = [];
        this.comidaClient = new ComidaClient();
        this.contenedorLista = null;
        this.contenedorDetalle = null;
    }

    getComidas() {
        this.showLoader();
        this.comidaClient.get()
            .then(
                lista => {
                    console.log(lista);
                    this.comidas = lista;
                    this.pintar();
                }
            );
    }

    nuevaComida() {
        console.log("TODO: crear nueva comida");
    }

    start() {
        super.start();
        this.getComidas();
    }

    pintarEstructura() {
        super.pintarEstructura();

        /* HEADER */
        let contenedorHead = HtmlUtil.createElement({
            tag: "header",
            attr: { "class": "page-header" }
        });
        let titulo = HtmlUtil.createElement({
            tag: "h1",
            text: "Comidas"
        });
        contenedorHead.appendChild(titulo);
        this.contenedor.appendChild(contenedorHead);

        /* NAV */
        let contenedorNav = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "controles" }
        });

        this.buttonRefresh = HtmlUtil.createButton({
            text: "Refrescar",
            click: () => this.getComidas()
        });
        contenedorNav.appendChild(this.buttonRefresh);

        this.buttonCrear = HtmlUtil.createButton({
            text: "Crear comida",
            click: () => this.nuevaComida(0)
        });
        contenedorNav.appendChild(this.buttonCrear);

        contenedorHead.appendChild(contenedorNav);

        /* LISTA */
        this.contenedorLista = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "lista" }
        });
        this.contenedor.appendChild(this.contenedorLista);

        /* MODAL */
        let [modal, modalTitle, modalBody, modalClose] = HtmlUtil.createModal({
            id: "modal-detalle",
            title: "Detalle de Comida",
            buttons: [{
                type: "close",
                text: "Cerrar"
            }]
        });
        this.modalDetalle = modalBody;

        this.appendChild(modal);
    }

    pintarPagina() {
        HtmlUtil.removeChilds(this.contenedorLista);

        let table = HtmlUtil.createElement({
            tag: "table",
            attr: { "class": "table table-condensed table-bordered table-striped comidas" }
        });

        let thead = HtmlUtil.createElement({ tag: "thead" });
        let tr = HtmlUtil.crearTableRow(["Nombre", "Tipo", "Precio", "Calorias", "Existencias", "Acciones"], "th");
        thead.appendChild(tr);
        table.appendChild(thead);

        let tbody = HtmlUtil.createElement({ tag: "tbody" });
        this.comidas.forEach(comida => {
            let tr = HtmlUtil.crearTableRow([
                comida.nombre,
                comida.tipo,
                {
                    text: comida.precio,
                    attr: { "class": "numero" }
                },
                {
                    text: comida.calorias,
                    attr: { "class": "numero" }
                },
                {
                    text: comida.existencias,
                    attr: { "class": "numero" }
                }
            ]);
            //TODO: tr.appendChild(tdAcciones);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        this.contenedorLista.appendChild(table);

        this.hideLoader();
    }

    pintarDetalle(detallePokemon, contenedorDetalle = this.contenedorDetalle) {
        HtmlUtil.removeChilds(contenedorDetalle);

        detallePokemon.pintar(contenedorDetalle);

        this.hideLoader();
    }
}


/* ***** CLASES DE DATOS ***** */

class User {
    constructor(_id, username, password, nombre, rol) {
        this._id = _id;
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.rol = rol;
    }
}

class Comida {
    constructor(_id, nombre, tipo, precio, calorias, existencias, __v) {
        this._id = _id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.precio = precio;
        this.calorias = calorias;
        this.existencias = existencias;
        this.__v = __v;
    }
}

class Bebida {
    constructor(_id, nombre, grados, esAlcoholica, precio, calorias, existencias, __v) {
        this._id = _id;
        this.nombre = nombre;
        this.grados = grados;
        this.esAlcoholica = esAlcoholica;
        this.precio = precio;
        this.calorias = calorias;
        this.existencias = existencias;
        this.__v = __v;
    }
}



/* ***** TEMPORAL ***** */

class PokemonClient {
    constructor(urlBase = "http://pokeapi.co/api/v2/pokemon") {
        this.urlBase = urlBase;
        this.apiClient = new APIClient();
    }

    getPokemonsAtPage(numeroPagina) {
        let offset = (numeroPagina - 1) * 20;
        let url = `${this.urlBase}/?offset=${offset}`;
        return this.apiClient.get(url)
            .then(
                data => {
                    console.log(data);
                    let pokemons = [];
                    data.results.forEach(item => pokemons.push(new Pokemon(item.name, item.url)));
                    return {
                        numTotalPokemons: data.count,
                        pokemons: pokemons
                    };
                }
            );
    }

    getPokemonByUrl(urlDePokemon) {
        return this.apiClient.get(urlDePokemon)
            .then(
                data => {
                    console.log(data);
                    let imagenes = [];
                    for (let key in data.sprites) {
                        if (data.sprites[key]) {
                            imagenes.push(data.sprites[key]);
                        }
                    }
                    let detallePokemon = new DetallePokemon(data.name, imagenes, data.weight, data.height);
                    return detallePokemon;
                }
            );
    }
}

class DetallePokemon {
    constructor(nombre, imagenes, peso, altura) {
        this.nombre = nombre;
        this.imagenes = imagenes;
        this.peso = peso;
        this.altura = altura;
    }

    pintar(contenedor) {

        let contenedorImagen = HtmlUtil.createElement({
            tag: "li",
            attr: { "class": "list-group-item imagen" }
        });
        if (this.imagenes.length) {
            this.imagenes.forEach(imagenUrl => {
                let imagen = HtmlUtil.createElement({
                    tag: "img",
                    attr: { "src": imagenUrl }
                });
                contenedorImagen.appendChild(imagen);
            });
        } else {
            contenedorImagen.appendChild(HtmlUtil.createText(" No hay imagen disponible."));
        }
        contenedor.appendChild(contenedorImagen);

        let [contenedorNombre] = HtmlUtil.createLabelValuePair({
            tag: "li",
            attr: { "class": "list-group-item etiqueta-valor" },
            labelTag: "span",
            labelAttr: { "class": "etiqueta" },
            labelText: "Nombre: ",
            valueTag: "span",
            valueAttr: { "class": "valor nombre" },
            valueText: this.nombre
        });
        contenedor.appendChild(contenedorNombre);

        let [contenedorPeso] = HtmlUtil.createLabelValuePair({
            tag: "li",
            attr: { "class": "list-group-item etiqueta-valor" },
            labelTag: "span",
            labelAttr: { "class": "etiqueta" },
            labelText: "Peso: ",
            valueTag: "span",
            valueAttr: { "class": "valor peso" },
            valueText: this.peso
        });
        contenedor.appendChild(contenedorPeso);

        let [contenedorAltura] = HtmlUtil.createLabelValuePair({
            tag: "li",
            attr: { "class": "list-group-item etiqueta-valor" },
            labelTag: "span",
            labelAttr: { "class": "etiqueta" },
            labelText: "Altura: ",
            valueTag: "span",
            valueAttr: { "class": "valor altura" },
            valueText: this.altura
        });
        contenedor.appendChild(contenedorAltura);

    }
}

class Pokemon {
    constructor(nombre, urlDetalle) {
        this.nombre = nombre;
        this.urlDetalle = urlDetalle;
    }

    pintar(tbody, verDetalle, verDetallePopup) {
        let tr = HtmlUtil.createElement({ tag: "tr" });

        let tdNombre = HtmlUtil.createElement({
            tag: "td",
            text: this.nombre,
            attr: { "class": "nombre" }
        });
        tr.appendChild(tdNombre);

        let tdAcciones = HtmlUtil.createElement({
            tag: "td",
            attr: { "class": "acciones" },
        });
        if (verDetalle) {
            let button = HtmlUtil.createButton({
                text: "Ver Detalles",
                click: verDetalle,
                attr: {
                    "class": "btn btn-xs btn-primary"
                }
            });
            tdAcciones.appendChild(button);
        }
        if (verDetallePopup) {
            let button = HtmlUtil.createButton({
                text: "Ver Detalles",
                click: verDetallePopup,
                attr: {
                    "class": "btn btn-xs btn-info",
                    "data-toggle": "modal",
                    "data-target": "#modal-detalle"
                }
            });
            tdAcciones.appendChild(button);
        }
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
    }

    static pintarCabecera(thead, acciones) {
        let tr = HtmlUtil.createElement({ tag: "tr" });

        let tdNombre = HtmlUtil.createElement({
            tag: "th",
            text: "Nombre"
        });
        tr.appendChild(tdNombre);

        let tdAcciones = HtmlUtil.createElement({
            tag: "th",
            text: "Acciones"
        });
        tr.appendChild(tdAcciones);

        thead.appendChild(tr);
    }
}

class Pokedex extends InnerPage {
    constructor() {
        super();
        this.pokemons = [];
        this.paginaActual = null;
        this.numTotalPokemons = null;
        this.pokemonClient = new PokemonClient();
        this.contenedorLista = null;
        this.contenedorDetalle = null;
        this.elementPaginaActual = null;
        this.buttonAnt = null;
        this.buttonSig = null;
    }

    getPokemons(numeroPagina = 1) {
        this.showLoader();
        this.pokemonClient.getPokemonsAtPage(numeroPagina)
            .then(
                data => {
                    console.log(data);
                    this.numTotalPokemons = data.numTotalPokemons;
                    this.pokemons = data.pokemons;
                    this.paginaActual = numeroPagina;
                    this.pintar();
                }
            );
    }

    getPaginaInicial() {
        this.getPokemons(1);
    }

    getPaginaSiguiente() {
        this.getPokemons(this.paginaActual + 1);
    }

    getPaginaAnterior() {
        this.getPokemons(this.paginaActual - 1);
    }

    getPaginaUltima() {
        this.getPokemons(Math.ceil(this.numTotalPokemons / 20));
    }

    getPokemon(pokemon, contenedorDetalle = this.contenedorDetalle) {
        this.showLoader();
        this.pokemonClient.getPokemonByUrl(pokemon.urlDetalle)
            .then(
                detallePokemon => {
                    console.log(detallePokemon);
                    this.pintarDetalle(detallePokemon, contenedorDetalle);
                }
            );
    }

    start() {
        super.start();
        this.getPaginaInicial();
    }

    pintarEstructura() {
        super.pintarEstructura();

        let contenedor = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "container theme-showcase" }
        });

        /* HEADER */
        let contenedorHead = HtmlUtil.createElement({
            tag: "header",
            attr: { "class": "page-header" }
        });
        let titulo = HtmlUtil.createElement({
            tag: "h1",
            text: "La Pokedex Xanxa!"
        });
        contenedorHead.appendChild(titulo);
        this.contenedor.appendChild(contenedorHead);

        /* NAV */
        let contenedorNav = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "controles" }
        });

        this.buttonIni = HtmlUtil.createButton({
            text: "|< Primera",
            click: () => this.getPaginaInicial()
        });
        contenedorNav.appendChild(this.buttonIni);

        this.buttonAnt = HtmlUtil.createButton({
            text: "< Anterior",
            click: () => this.getPaginaAnterior()
        });
        contenedorNav.appendChild(this.buttonAnt);

        let [contenedorPag, , elementPag] = HtmlUtil.createLabelValuePair({
            tag: "span",
            attr: { "class": "etiqueta-valor" },
            labelTag: "span",
            labelAttr: { "class": "etiqueta" },
            labelText: " Página actual: ",
            valueTag: "span",
            valueAttr: { "class": "valor" },
            valueText: this.paginaActual + " "
        });
        this.elementPaginaActual = elementPag;
        contenedorNav.appendChild(contenedorPag);

        this.buttonSig = HtmlUtil.createButton({
            text: "Siguiente >",
            click: () => this.getPaginaSiguiente()
        });
        contenedorNav.appendChild(this.buttonSig);

        this.buttonUlt = HtmlUtil.createButton({
            text: "Última >|",
            click: () => this.getPaginaUltima()
        });
        contenedorNav.appendChild(this.buttonUlt);

        contenedorHead.appendChild(contenedorNav);

        /* POKEDEX */
        let contenedorPokedex = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "row" }
        });

        let contenedorColumna1 = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "col-sm-8 col-md-6 col-lg-4" }
        });
        let titulo1 = HtmlUtil.createElement({
            tag: "h2",
            text: "Listado de Pokemons"
        });
        contenedorColumna1.appendChild(titulo1);
        this.contenedorLista = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "lista" }
        });
        contenedorColumna1.appendChild(this.contenedorLista);
        contenedorPokedex.appendChild(contenedorColumna1);

        let contenedorColumna2 = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "col-sm-4 col-md-6 col-lg-8" }
        });
        let titulo2 = HtmlUtil.createElement({
            tag: "h2",
            text: "Detalle del Pokemon"
        });
        contenedorColumna2.appendChild(titulo2);
        this.contenedorDetalle = HtmlUtil.createElement({
            tag: "ul",
            attr: { "class": "list-group detalle" }
        });
        contenedorColumna2.appendChild(this.contenedorDetalle);
        contenedorPokedex.appendChild(contenedorColumna2);

        this.contenedor.appendChild(contenedorPokedex);

        /* MODAL */
        let [modal, modalTitle, modalBody, modalClose] = HtmlUtil.createModal({
            id: "modal-detalle",
            title: "Detalle del Pokemon",
            buttons: [{
                type: "close",
                text: "Cerrar"
            }]
        });
        this.modalDetalle = modalBody;

        this.appendChild(modal);
    }

    pintarPagina() {
        HtmlUtil.removeChilds(this.contenedorLista);

        let table = HtmlUtil.createElement({
            tag: "table",
            attr: { "class": "table table-condensed table-bordered table-striped pokemons" }
        });

        let thead = HtmlUtil.createElement({ tag: "thead" });
        Pokemon.pintarCabecera(thead, "Acciones");
        table.appendChild(thead);

        let tbody = HtmlUtil.createElement({ tag: "tbody" });
        this.pokemons.forEach(pokemon => pokemon.pintar(
            tbody,
            () => this.getPokemon(pokemon, this.contenedorDetalle),
            () => this.getPokemon(pokemon, this.modalDetalle),
        ));
        table.appendChild(tbody);

        this.contenedorLista.appendChild(table);
        this.elementPaginaActual.innerText = this.paginaActual + " ";
        if (this.paginaActual === 1) {
            this.buttonIni.setAttribute("disabled", true);
            this.buttonAnt.setAttribute("disabled", true);
        } else {
            this.buttonIni.removeAttribute("disabled");
            this.buttonAnt.removeAttribute("disabled");
        }
        if (this.paginaActual * 20 > this.numTotalPokemons) {
            this.buttonSig.setAttribute("disabled", true);
            this.buttonUlt.setAttribute("disabled", true);
        } else {
            this.buttonSig.removeAttribute("disabled");
            this.buttonUlt.removeAttribute("disabled");
        }
        this.hideLoader();
    }

    pintarDetalle(detallePokemon, contenedorDetalle = this.contenedorDetalle) {
        HtmlUtil.removeChilds(contenedorDetalle);

        detallePokemon.pintar(contenedorDetalle);

        this.hideLoader();
    }
}


/* ***** CLASES APLICACIÓN ***** */

class AuthController {
    constructor() {
        this.usersClient = new UsersClient();
        this.publicPages = [];
    }

    login(username, password) {
        this.logout();
        return this.usersClient.get()
            .then(lista => {
                let result = false;
                let authUser = lista.find(user => user.username == username && user.password == password);
                if (authUser) {
                    SessionAPI.setUser(authUser);
                    result = true;
                }
                return result;
            });

    }

    logout() {
        SessionAPI.clear();
    }

    getAuthUser() {
        return SessionAPI.getUser();
    }

    checkPermisions(strUrl) {
        let result = false;
        if (this.getAuthUser() || this.publicPages.find(pageUrl => pageUrl == strUrl)) {
            result = true;
        }
        return result;
    }

}

class NavigationController {
    constructor(authController) {
        this.authController = authController;
        this.homePage = "home";
        this.loginPage = "login";
        this.pages = {
            "home": {
                title: "Home",
                pClass: HomePage
            },
            "comidas": {
                title: "Comidas",
                pClass: ComidaPage
            },
            "pokedex": {
                title: "Pokedex",
                pClass: Pokedex
            },
            "login": {
                title: "Logout",
                pClass: LoginPage
            }
        }
    }
    navigateToUrl(strUrl) {
        console.log("navigateToUrl: " + strUrl);
        let auth = this.authController.checkPermisions(strUrl);
        if (!auth) {
            strUrl = this.loginPage;
        }
        let page = this.pages[strUrl];
        if (page) {
            window.history.pushState({}, page.title, strUrl);
            if (!page.pObject) {
                page.pObject = new page.pClass();
                page.pObject.setNavigator(this);
            }
            page.pObject.start();
        }
    }
    navigateToHome() {
        this.navigateToUrl(this.homePage);
    }
    login(username, password) {
        return this.authController.login(username, password);
    }
    logout() {
        return this.authController.logout();
    }
}

class Application {
    constructor() {
        this.authController = new AuthController();
        this.navigator = new NavigationController(this.authController);
    }
    start() {
        this.navigator.navigateToHome();
    }
}


let application = null;

window.onload = () => {
    /* USUARIO PARA PRUEBAS */
    let usersClient = new UsersClient();
    usersClient.get().then(lista => {
        let admin = lista.find(user => user.id == "admin");
        if (admin) {
            console.log("Usuario de pruebas:");
            console.log(JSON.stringify(admin));
        } else {
            console.log("Creando usuario de pruebas:");
            usersClient.post(new User(null, "admin", "123456", "Administrador", "admin"))
                .then(data => console.log(JSON.stringify(data)));
        }
    })
    /* ******************** */

    application = new Application();
    application.start();
}