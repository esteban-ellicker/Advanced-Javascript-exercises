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
                    attr: { "class": "number" }
                },
                {
                    text: this.formatNumber(comida.calorias),
                    attr: { "class": "number" }
                },
                {
                    text: this.formatNumber(comida.existencias),
                    attr: { "class": "number" }
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

        if (this.comida._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "ID:",
                    value: this.comida._id
                })
            );
        }

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Nombre:",
                value: this.comida.nombre
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Tipo:",
                value: this.comida.tipo
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Precio:",
                value: this.formatCurrency(this.comida.precio)
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Calorias:",
                value: this.formatNumber(this.comida.calorias)
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Existencias:",
                value: this.formatNumber(this.comida.existencias)
            })
        );

        if (this.comida._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "V:",
                    value: this.comida.__v
                })
            );
        }

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

        if (this.comida._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "ID:",
                    value: this.comida._id
                })
            );
        }

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "nombre",
                type: "text",
                label: "Nombre:",
                value: this.comida.nombre,
                minlength: 4,
                maxlength: 100,
                required: true
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "tipo",
                type: "select",
                label: "Tipo:",
                value: this.comida.tipo,
                options: ["Entrante", "Principal", "Postre"]
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "precio",
                type: "number",
                label: "Precio:",
                value: this.comida.precio,
                min: 0,
                max: 10000,
                required: true
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "calorias",
                type: "number",
                label: "Calorias:",
                value: this.comida.calorias,
                min: 0,
                max: 5000,
                required: true
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "existencias",
                type: "number",
                label: "Existencias:",
                value: this.comida.existencias,
                min: 0,
                max: 1000,
                required: true
            })
        );

        if (this.comida._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "V:",
                    value: this.comida.__v
                })
            );
        }

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

class ResumenComidaPage extends PageFragment {
    constructor(body) {
        super(body);
        this.comidaClient = new ComidaClient();
        this.resumen = null;
    }

    getResumen() {
        this.showLoader();
        this.comidaClient.get()
            .then(
                lista => {
                    this.resumen = {
                        total: lista.length,
                        Entrante: 0,
                        Principal: 0,
                        Postre: 0
                    }
                    if (lista.length) {

                        this.resumen = lista.reduce(
                            (result, comida) => {
                                result[comida.tipo]++;
                                return result;
                            },
                            this.resumen
                        );

                        lista.sort((a, b) => a.calorias - b.calorias);
                        this.resumen.minCalorias = lista[0];
                        this.resumen.maxCalorias = lista[lista.length - 1];

                        lista.sort((a, b) => a.precio - b.precio);
                        this.resumen.minPrecio = lista[0];
                        this.resumen.maxPrecio = lista[lista.length - 1];

                        lista.sort((a, b) => a.existencias - b.existencias);
                        this.resumen.minExistencias = lista[0];
                        this.resumen.maxExistencias = lista[lista.length - 1];
                    }

                    console.log(this.resumen);

                    this.pintarPagina();
                    this.hideLoader();
                }
            );
    }

    pintarEstructura() {
        /* CONTENEDOR */
        this.contenedor = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "resumen-container col-sm-12 col-md-6" }
        });
        this.appendChild(this.contenedor);
    }

    pintarPagina() {
        let content = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "class": "resumen-content"
            }
        });
        let titulo = HtmlUtil.createElement({
            tag: "h3",
            text: "Resumen Comidas"
        });
        content.appendChild(titulo);

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Total:",
                value: this.resumen.total
            })
        );

        if (this.resumen.total) {

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "Entrantes:",
                    value: this.resumen.Entrante,
                    labelCols: 3
                })
            );

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "Principales:",
                    value: this.resumen.Principal,
                    labelCols: 3
                })
            );

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "Postres:",
                    value: this.resumen.Postre,
                    labelCols: 3
                })
            );

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "Mayor Precio:",
                    value: `${this.resumen.maxPrecio.nombre}: ${this.formatCurrency(this.resumen.maxPrecio.precio)}`,
                    labelCols: 4
                })
            );

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "Menor Precio:",
                    value: `${this.resumen.minPrecio.nombre}: ${this.formatCurrency(this.resumen.minPrecio.precio)}`,
                    labelCols: 4
                })
            );

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "Más Calorias:",
                    value: `${this.resumen.maxCalorias.nombre}: ${this.formatNumber(this.resumen.maxCalorias.calorias)}`,
                    labelCols: 4
                })
            );

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "Menos Calorias:",
                    value: `${this.resumen.minCalorias.nombre}: ${this.formatNumber(this.resumen.minCalorias.calorias)}`,
                    labelCols: 4
                })
            );

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "Más Existencias:",
                    value: `${this.resumen.maxExistencias.nombre}: ${this.formatNumber(this.resumen.maxExistencias.existencias)}`,
                    labelCols: 4
                })
            );

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "Menos Existencias:",
                    value: `${this.resumen.minExistencias.nombre}: ${this.formatNumber(this.resumen.minExistencias.existencias)}`,
                    labelCols: 4
                })
            );

        }

        this.contenedor.appendChild(content);
    }

    pintar() {
        if (!this.contenedor) {
            this.pintarEstructura();
        }
        this.getResumen();
    }
}