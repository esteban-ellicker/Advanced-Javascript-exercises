/* ***** CLASES DE DATOS ***** */

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


/* ***** CLIENTES ***** */

class ComidaClient {
    constructor(urlBase = "http://formacion-indra-franlindebl.com") {
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

    _dataFromComida(comida) {
        let data = null;
        if (comida._id) {
            data = {
                _id: comida._id,
                nombre: comida.nombre,
                tipo: comida.tipo,
                precio: comida.precio,
                calorias: comida.calorias,
                existencias: comida.existencias,
                __v: comida.__v
            };
        } else {
            data = {
                nombre: comida.nombre,
                tipo: comida.tipo,
                precio: comida.precio,
                calorias: comida.calorias,
                existencias: comida.existencias
            };
        }
        return data;
    }

    find(comida) {
        return this.apiClient.get(
                this.urlBase + "/api/comidas/" + (comida instanceof Comida ? comida._id : comida)
            )
            .then(data => {
                console.log(data);
                return this._comidaFromData(data);
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error al buscar comida: " + error.message);
                throw error;
            });
    }

    get() {
        return this.apiClient.get(
                this.urlBase + "/api/comidas"
            )
            .then(lista => {
                console.log(lista);
                let comidas = [];
                lista.forEach(data => comidas.push(this._comidaFromData(data)));
                return comidas;
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error al listar comidas: " + error.message);
                throw error;
            });
    }

    post(comida) {
        return this.apiClient.post(
                this.urlBase + "/api/comidas",
                this._dataFromComida(comida)
            )
            .then(data => {
                console.log(data);
                //Object {message: "Comida creada!"}
                return data;
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error al crear comida: " + error.message);
                throw error;
            });
    }

    delete(comida) {
        return this.apiClient.delete(
                this.urlBase + "/api/comidas/" + (comida instanceof Comida ? comida._id : comida)
            )
            .then(data => {
                console.log(data);
                return data;
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error al eliminar comida: " + error.message);
                throw error;
            });
    }

    put(comida) {
        return this.apiClient.put(
                this.urlBase + "/api/comidas/" + comida._id,
                this._dataFromComida(comida)
            )
            .then(
                data => {
                    console.log(data);
                    //{message: "Comida actualizada!"}
                    return data;
                })
            .catch(error => {
                console.error(error);
                console.error(error.message);
                error = new Error("Error al actualizar comida: " + error.message);
                throw error;
            });
    }
}


/* ***** PÁGINAS ESPECÍFICAS ***** */

class ComidaPage extends InnerPage {
    constructor(body) {
        super(body);
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

        /* LISTA */
        this.contenedorLista = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "lista" }
        });
        this.contenedor.appendChild(this.contenedorLista);
        this.contenedorMensajes = this.contenedorLista;

        /* FOOTER */
        let contenedorFooter = HtmlUtil.createElement({
            tag: "footer",
            attr: { "class": "page-footer" }
        });

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
            click: () => this.nuevaComida()
        });
        contenedorNav.appendChild(this.buttonCrear);

        contenedorFooter.appendChild(contenedorNav);
        this.contenedor.appendChild(contenedorFooter);
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
                    text: this.formatCurrency(comida.precio),
                    attr: { "class": "numero" }
                },
                {
                    text: this.formatNumber(comida.calorias),
                    attr: { "class": "numero" }
                },
                {
                    text: this.formatNumber(comida.existencias),
                    attr: { "class": "numero" }
                }
            ]);
            let tdAcciones = HtmlUtil.createElement({
                tag: "td",
                attr: { "class": "acciones" }
            });

            let buttonDetalle = HtmlUtil.createButton({
                attr: { "class": "btn btn-xs btn-info" },
                text: "Ver Detalles",
                click: () => this.pintarDetalle(comida)
            });
            tdAcciones.appendChild(buttonDetalle);

            let buttonEditar = HtmlUtil.createButton({
                attr: { "class": "btn btn-xs btn-primary" },
                text: "Editar",
                click: () => this.editar(comida)
            });
            tdAcciones.appendChild(buttonEditar);

            let buttonEliminar = HtmlUtil.createButton({
                attr: { "class": "btn btn-xs btn-danger" },
                text: "Eliminar",
                click: () => this.eliminar(comida)
            });
            tdAcciones.appendChild(buttonEliminar);

            tr.appendChild(tdAcciones);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        this.contenedorLista.appendChild(table);

        this.hideLoader();
    }

    _pintarModal(comida, ClaseModal) {
        this.limpiarMensajes();
        this.showLoader();
        this.comidaClient.find(comida)
            .then(comida => {
                if (comida) {
                    let pageDetalle = new ClaseModal(this.body, comida, this);
                    pageDetalle.pintar();
                } else {
                    this.pintarError("Comida no encontrada, debes refrescar la lista.");
                }
                this.hideLoader();
            })
            .catch(data => {
                console.log(data);
                this.pintarError(data.message);
                this.hideLoader();
            });
    }

    pintarDetalle(comida) {
        this._pintarModal(comida, DetalleComidaPage);
    }

    editar(comida) {
        this._pintarModal(comida, FormComidaPage);
    }

    eliminar(comida) {
        this._pintarModal(comida, EliminarComidaPage);
    }

    nuevaComida() {
        this.editar(new Comida());
    }
}

class DetalleComidaPage extends ModalPage {
    constructor(body, comida) {
        super(body);
        this.comida = comida;
        this.setTitle("Detalle Comida");
    }

    pintarPagina() {
        this.limpiarPagina();

        let content = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "detalle" }
        });

        let campos = [];

        if (this.comida._id) {
            campos.push({
                labelText: "ID: ",
                valueText: this.comida._id
            });
        }
        campos.push({
            labelText: "Nombre: ",
            valueText: this.comida.nombre
        });
        campos.push({
            labelText: "Tipo: ",
            valueText: this.comida.tipo
        });
        campos.push({
            labelText: "Precio: ",
            valueText: this.formatCurrency(this.comida.precio)
        });
        campos.push({
            labelText: "Calorias: ",
            valueText: this.formatNumber(this.comida.calorias)
        });
        campos.push({
            labelText: "Existencias: ",
            valueText: this.formatNumber(this.comida.existencias)
        });
        if (this.comida._id) {
            campos.push({
                labelText: "V: ",
                valueText: this.comida.__v
            });
        }

        let lista = HtmlUtil.createLabelValuePairList({
            labelTag: "span",
            valueTag: "span",
            data: campos
        });

        content.appendChild(lista);

        super.setContent(content);
    }
}

class FormComidaPage extends DetalleComidaPage {
    constructor(body, comida, comidaPage) {
        super(body, comida);
        this.comidaPage = comidaPage;
        this.setTitle(this.comida._id ? "Editar Comida" : "Crear Comida");
        this.addBoton({
            attr: { "class": "btn btn-primary" },
            text: "Guardar",
            click: () => this.guardar()
        });
        this.form = null;
    }

    guardar() {
        this.limpiarMensajes();
        if (this.form.checkValidity()) {
            this.showLoader();

            this.comida.nombre = this.form.nombre.value;
            this.comida.tipo = this.form.tipo.value;
            this.comida.precio = this.form.precio.value;
            this.comida.calorias = this.form.calorias.value;
            this.comida.existencias = this.form.existencias.value;

            let promise = this.comida._id ?
                this.comidaPage.comidaClient.put(this.comida) :
                this.comidaPage.comidaClient.post(this.comida);

            promise.then(data => {
                    console.log(data);
                    if (data.errors) {
                        this.pintarError(data.message);
                        this.hideLoader();
                    } else {
                        if (data.errmsg) {
                            this.pintarError(data.errmsg);
                        } else {
                            this.pintarPaginaSoloLectura();
                            this.hideButtons();
                            this.pintarMensaje(data.message);
                            this.addCloseEventListener(() => {
                                this.comidaPage.getComidas();
                            });
                        }
                    }
                    this.hideLoader();
                })
                .catch(data => {
                    console.log(data);
                    this.pintarError(data.message);
                    this.hideLoader();
                });
        }
    }

    pintarPaginaSoloLectura() {
        super.pintarPagina();
    }

    pintarPagina() {
        this.limpiarPagina();

        let content = HtmlUtil.createElement({
            tag: "form",
            attr: { "class": "editar" }
        });
        this.form = content;

        let campos = [];

        if (this.comida._id) {
            campos.push({
                labelText: "ID: ",
                valueTag: "span",
                valueText: this.comida._id
            });
        }
        campos.push({
            labelText: "Nombre: ",
            valueAttr: {
                "name": "nombre",
                "type": "text",
                "value": this.comida.nombre
            }
        });
        campos.push({
            labelText: "Tipo: ",
            valueAttr: {
                "name": "tipo",
                "type": "text",
                "value": this.comida.tipo
            }
        });
        campos.push({
            labelText: "Precio: ",
            valueAttr: {
                "name": "precio",
                "type": "number",
                "class": "numero",
                "min": 0,
                "max": 10000,
                "value": this.comida.precio
            }
        });
        campos.push({
            labelText: "Calorias: ",
            valueAttr: {
                "name": "calorias",
                "type": "number",
                "class": "numero",
                "min": 0,
                "max": 10000,
                "value": this.comida.calorias
            }
        });
        campos.push({
            labelText: "Existencias: ",
            valueAttr: {
                "name": "existencias",
                "type": "number",
                "class": "numero",
                "min": 0,
                "max": 10000,
                "value": this.comida.existencias
            }
        });
        if (this.comida._id) {
            campos.push({
                labelText: "V: ",
                valueTag: "span",
                valueText: this.comida.__v
            });
        }

        let lista = HtmlUtil.createLabelValuePairList({
            labelTag: "label",
            valueTag: "input",
            valueAttr: {
                "required": true
            },
            data: campos
        });

        content.appendChild(lista);

        super.setContent(content);
    }
}

class EliminarComidaPage extends DetalleComidaPage {
    constructor(body, comida, comidaPage) {
        super(body, comida);
        this.comidaPage = comidaPage;
        this.setTitle("Confirmación Eliminar Comida");
        this.addBoton({
            attr: { "class": "btn btn-danger" },
            text: "Eliminar",
            click: () => this.eliminar()
        });
    }

    eliminar() {
        this.limpiarMensajes();
        this.showLoader();

        this.comidaPage.comidaClient.delete(this.comida)
            .then(data => {
                console.log(data);
                if (data.errors) {
                    this.pintarError(data.message);
                } else {
                    this.hideButtons();
                    this.pintarMensaje(data.message);
                    this.addCloseEventListener(() => {
                        this.comidaPage.getComidas();
                    });
                }
                this.hideLoader();
            })
            .catch(data => {
                console.log(data);
                this.pintarError(data.message);
                this.hideLoader();
            });
    }
}