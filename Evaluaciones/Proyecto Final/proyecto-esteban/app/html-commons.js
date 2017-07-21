/* ***** UTILITARIO HTML ***** */

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
            if (attr[key] !== null && attr[key] !== undefined) {
                element.setAttribute(key, attr[key]);
            } else {
                console.warn(`Ignorando atributo ${key}, su valor null o undefined`);
            }
        }
        for (let key in events) {
            if (typeof events[key] == "function") {
                element.addEventListener(key, events[key]);
            } else {
                throw new Error(`El evento en ${key} no es function`);
            }
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

        let listeners = click ? { click: click } : {};

        return HtmlUtil.createElement({
            tag: "button",
            text: text,
            attr: btnAttr,
            events: listeners
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
    static mergeAttributes(...attrs) {
        let merged = {};
        attrs.forEach(attr => {
            if (attr) {
                for (let key in attr) {
                    merged[key] = attr[key];
                }
            }
        });
        return merged;
    }
    static createLabelValuePairList({
        tag = "ul",
        attr = { "class": "list-group" },
        pairTag = "li",
        pairAttr = { "class": "list-group-item etiqueta-valor" },
        labelTag = "span",
        labelAttr = { "class": "etiqueta" },
        valueTag = "span",
        valueAttr = { "class": "valor" },
        data = []
    }) {

        let list = HtmlUtil.createElement({
            tag: tag,
            attr: attr
        });

        data.forEach(item => {
            let [pair, label, value] = HtmlUtil.createLabelValuePair({
                tag: data.pairTag || pairTag,
                attr: HtmlUtil.mergeAttributes(pairAttr, item.pairAttr),
                labelTag: item.labelTag || labelTag,
                labelAttr: HtmlUtil.mergeAttributes(labelAttr, item.labelAttr),
                labelText: item.labelText,
                valueTag: item.valueTag || valueTag,
                valueAttr: HtmlUtil.mergeAttributes(valueAttr, item.valueAttr),
                valueText: item.valueText
            });
            list.appendChild(pair);
        });

        return list;
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


/* ***** PAGINAS GENERICAS ***** */

class Page {
    constructor(body = document.body) {
        this.body = body;
        this.navigator = null;
        this.contenedor = null;
        this.loader = null;
        this._currencyFormatter = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
        this._numberFormatter = new Intl.NumberFormat("es-MX", { style: "decimal", maximumFractionDigits: 0 });
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

    formatCurrency(value) {
        return this._currencyFormatter.format(value);
    }

    formatNumber(value) {
        return this._numberFormatter.format(value);
    }

    pintarEstructura() {
        this.limpiar();

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
        if (!this.loader) {
            this.loader = HtmlUtil.createLoader();
            this.appendChild(this.loader);
        }
        HtmlUtil.showElement(this.loader);
    }

    hideLoader() {
        if (this.loader) {
            HtmlUtil.hideElement(this.loader);
        }
    }

    pintarMensaje(mensaje, clase = "ok") {
        let contenedor = this.contenedorMensajes || this.contenedor;
        let messageDiv = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "class": "mensaje-temp " + clase
            },
            text: mensaje
        });
        contenedor.appendChild(messageDiv);
    }

    pintarError(mensaje) {
        this.pintarMensaje(mensaje, "error");
    }

    limpiarMensajes() {
        let contenedor = this.contenedorMensajes || this.contenedor;
        let mensajes = contenedor.getElementsByClassName("mensaje-temp");
        while (mensajes[0]) {
            contenedor.removeChild(mensajes[0]);
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

class ModalPage extends PageFragment {
    constructor(body) {
        super(body);
        this._title = "";
        this._buttons = [];
        this._content = null;
        this._btContainer = null;
        this._onclose = [];
    }

    setTitle(title) {
        this._title = title;
    }

    addBoton(button) {
        this._buttons.push(button);
    }

    hideButtons() {
        this._buttons.forEach(button => {
            if (button.element && button.element.parentElement) {
                button.element.parentElement.removeChild(button.element);
            }
        });
    }

    setContent(content) {
        this._content = content;
        if (this.contenedor) {
            this.contenedor.appendChild(this._content);
        }
    }

    addCloseEventListener(listener) {
        if (typeof listener == "function") {
            this._onclose.push(listener);
        } else {
            throw new Error("El listener que se intenta agregar a la modal no es function");
        }
    }

    limpiar() {
        if (this.contenedorModal) {
            this.contenedorModal.parentElement.removeChild(this.contenedorModal);
            this.contenedorModal = null;
        }
    }

    cerrar() {
        this._onclose.forEach(listener => listener());
        this.limpiar();
    }

    pintarEstructura() {
        this.limpiar();

        /* CONTENEDOR */
        this.contenedorModal = HtmlUtil.createElement({ tag: "div" });

        let modal = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "class": "modal fade in",
                "role": "dialog",
                "style": "display: block"
            }
        });

        let modalDialog = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "class": "modal-dialog"
            }
        });

        let modalContent = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "class": "modal-content"
            }
        });

        /* HEADER */
        let modalHeader = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "class": "modal-header"
            }
        });

        let modalClose = HtmlUtil.createButton({
            attr: {
                "class": "close"
            },
            click: () => this.cerrar(),
            text: "(×)"
        });
        modalHeader.appendChild(modalClose);

        let modalTitle = HtmlUtil.createElement({
            tag: "h4",
            attr: { "class": "modal-title" },
            text: this._title
        });
        modalHeader.appendChild(modalTitle);

        modalContent.appendChild(modalHeader);

        /* BODY */
        let modalBody = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "class": "modal-body"
            }
        });
        if (this._content) {
            modalBody.appendChild(this._content);
        }
        this.contenedor = modalBody;

        modalContent.appendChild(modalBody);

        /* FOOTER */
        let modalFooter = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "class": "modal-footer"
            }
        });
        this._buttons.forEach(button => {
            if (!button.element) {
                button.element = HtmlUtil.createButton(button);
                modalFooter.appendChild(button.element);
            }
        });
        let buttonClose = HtmlUtil.createButton({
            attr: {
                "class": "btn btn-primary"
            },
            click: () => this.cerrar(),
            text: "Cerrar"
        });
        modalFooter.appendChild(buttonClose);

        modalContent.appendChild(modalFooter);

        modalDialog.appendChild(modalContent);

        modal.appendChild(modalDialog);

        this.contenedorModal.appendChild(modal);

        let backdrop = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "class": "modal-backdrop fade in"
            }
        });

        this.contenedorModal.appendChild(backdrop);

        this.appendChild(this.contenedorModal);
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