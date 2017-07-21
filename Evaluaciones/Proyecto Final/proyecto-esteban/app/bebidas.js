/* ***** CLASES DE DATOS ***** */

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


/* ***** CLIENTES ***** */

class BebidaClient {
    constructor(urlBase = "http://formacion-indra-franlindebl.com") {
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

    _dataFromBebida(bebida) {
        let data = null;
        if (bebida._id) {
            data = {
                _id: bebida._id,
                nombre: bebida.nombre,
                grados: bebida.grados,
                esAlcoholica: bebida.esAlcoholica,
                precio: bebida.precio,
                calorias: bebida.calorias,
                existencias: bebida.existencias,
                __v: bebida.__v
            };
        } else {
            data = {
                nombre: bebida.nombre,
                grados: bebida.grados,
                esAlcoholica: bebida.esAlcoholica,
                precio: bebida.precio,
                calorias: bebida.calorias,
                existencias: bebida.existencias
            };
        }
        return data;
    }

    find(bebida) {
        return this.apiClient.get(
                this.urlBase + "/api/bebidas/" + (bebida instanceof Bebida ? bebida._id : bebida)
            )
            .then(data => {
                console.log(data);
                return this._bebidaFromData(data);
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error al buscar bebida: " + error.message);
                throw error;
            });
    }

    get() {
        return this.apiClient.get(
                this.urlBase + "/api/bebidas"
            )
            .then(lista => {
                console.log(lista);
                let bebidas = [];
                lista.forEach(data => bebidas.push(this._bebidaFromData(data)));
                return bebidas;
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error al listar bebidas: " + error.message);
                throw error;
            });
    }

    post(bebida) {
        return this.apiClient.post(
                this.urlBase + "/api/bebidas",
                this._dataFromBebida(bebida)
            ).then(
                data => {
                    console.log(data);
                    //Object {message: "Bebida creada!"}
                    return data;
                })
            .catch(error => {
                console.error(error);
                error = new Error("Error al crear bebida: " + error.message);
                throw error;
            });
    }

    delete(bebida) {
        return this.apiClient.delete(
                this.urlBase + "/api/bebidas/" + (bebida instanceof Bebida ? bebida._id : bebida)
            )
            .then(data => {
                console.log(data);
                return data;
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error al eliminar bebida: " + error.message);
                throw error;
            });
    }

    put(bebida) {
        return this.apiClient.put(
                this.urlBase + "/api/bebidas/" + bebida._id,
                this._dataFromBebida(bebida)
            )
            .then(
                data => {
                    console.log(data);
                    //{message: "Bebida actualizada!"}
                    return data;
                })
            .catch(error => {
                console.error(error);
                console.error(error.message);
                error = new Error("Error al actualizar bebida: " + error.message);
                throw error;
            });
    }
}


/* ***** PÁGINAS ESPECÍFICAS ***** */

class BebidaPage extends InnerPage {
    constructor(body) {
        super(body);
        this.bebidas = [];
        this.bebidaClient = new BebidaClient();
        this.contenedorLista = null;
        this.contenedorDetalle = null;
    }

    getBebidas() {
        this.showLoader();
        this.bebidaClient.get()
            .then(
                lista => {
                    console.log(lista);
                    this.bebidas = lista;
                    this.pintar();
                }
            );
    }

    start() {
        super.start();
        this.getBebidas();
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
            text: "Bebidas"
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
            click: () => this.getBebidas()
        });
        contenedorNav.appendChild(this.buttonRefresh);

        this.buttonCrear = HtmlUtil.createButton({
            text: "Crear bebida",
            click: () => this.nuevaBebida()
        });
        contenedorNav.appendChild(this.buttonCrear);

        contenedorFooter.appendChild(contenedorNav);
        this.contenedor.appendChild(contenedorFooter);
    }

    pintarPagina() {
        HtmlUtil.removeChilds(this.contenedorLista);

        let table = HtmlUtil.createElement({
            tag: "table",
            attr: { "class": "table table-condensed table-bordered table-striped bebidas" }
        });

        let thead = HtmlUtil.createElement({ tag: "thead" });
        let tr = HtmlUtil.crearTableRow(["Nombre", "Grados", "Precio", "Calorias", "Existencias", "Acciones"], "th");
        thead.appendChild(tr);
        table.appendChild(thead);

        let tbody = HtmlUtil.createElement({ tag: "tbody" });
        this.bebidas.forEach(bebida => {
            let tr = HtmlUtil.crearTableRow([
                bebida.nombre,
                {
                    text: bebida.esAlcoholica ? bebida.grados + "°" : "N/A",
                    attr: { "class": bebida.esAlcoholica ? "number" : "no-aplica" }
                }, {
                    text: this.formatCurrency(bebida.precio),
                    attr: { "class": "number" }
                }, {
                    text: this.formatNumber(bebida.calorias),
                    attr: { "class": "number" }
                }, {
                    text: this.formatNumber(bebida.existencias),
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
                click: () => this.pintarDetalle(bebida)
            });
            tdAcciones.appendChild(buttonDetalle);

            let buttonEditar = HtmlUtil.createButton({
                attr: { "class": "btn btn-xs btn-primary" },
                text: "Editar",
                click: () => this.editar(bebida)
            });
            tdAcciones.appendChild(buttonEditar);

            let buttonEliminar = HtmlUtil.createButton({
                attr: { "class": "btn btn-xs btn-danger" },
                text: "Eliminar",
                click: () => this.eliminar(bebida)
            });
            tdAcciones.appendChild(buttonEliminar);

            tr.appendChild(tdAcciones);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        this.contenedorLista.appendChild(table);

        this.hideLoader();
    }

    _pintarModal(bebida, ClaseModal) {
        this.limpiarMensajes();
        this.showLoader();
        this.bebidaClient.find(bebida)
            .then(bebida => {
                if (bebida) {
                    let pageDetalle = new ClaseModal(this.body, bebida, this);
                    pageDetalle.pintar();
                } else {
                    this.pintarError("Bebida no encontrada, debes refrescar la lista.");
                }
                this.hideLoader();
            })
            .catch(data => {
                console.log(data);
                this.pintarError(data.message);
                this.hideLoader();
            });
    }

    pintarDetalle(bebida) {
        this._pintarModal(bebida, DetalleBebidaPage);
    }

    editar(bebida) {
        this._pintarModal(bebida, FormBebidaPage);
    }

    eliminar(bebida) {
        this._pintarModal(bebida, EliminarBebidaPage);
    }

    nuevaBebida() {
        this.editar(new Bebida());
    }
}

class DetalleBebidaPage extends ModalPage {
    constructor(body, bebida) {
        super(body);
        this.bebida = bebida;
        this.setTitle("Detalle Bebida");
    }

    pintarPagina() {
        this.limpiarPagina();

        let content = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "detalle" }
        });

        if (this.bebida._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "ID:",
                    value: this.bebida._id,
                    labelCols: 3
                })
            );
        }

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Nombre:",
                value: this.bebida.nombre,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Contiene Alcohol:",
                value: this.bebida.esAlcoholica ? "Si" : "No",
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Grados:",
                value: this.bebida.grados + "°",
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Precio:",
                value: this.bebida.precio,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Calorias:",
                value: this.bebida.calorias,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Existencias:",
                value: this.bebida.existencias,
                labelCols: 3
            })
        );

        if (this.bebida._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "V:",
                    value: this.bebida.__v,
                    labelCols: 3
                })
            );
        }

        super.setContent(content);
    }
}

class FormBebidaPage extends DetalleBebidaPage {
    constructor(body, bebida, bebidaPage) {
        super(body, bebida);
        this.bebidaPage = bebidaPage;
        this.setTitle(this.bebida._id ? "Editar Bebida" : "Crear Bebida");
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

            this.bebida.nombre = this.form.nombre.value;
            this.bebida.esAlcoholica = this.form.esAlcoholica.value;
            this.bebida.grados = this.form.grados.value;
            this.bebida.precio = this.form.precio.value;
            this.bebida.calorias = this.form.calorias.value;
            this.bebida.existencias = this.form.existencias.value;

            let promise = this.bebida._id ?
                this.bebidaPage.bebidaClient.put(this.bebida) :
                this.bebidaPage.bebidaClient.post(this.bebida);

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
                                this.bebidaPage.getBebidas();
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

        if (this.bebida._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "ID:",
                    value: this.bebida._id,
                    labelCols: 3
                })
            );
        }

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "nombre",
                type: "text",
                label: "Nombre:",
                value: this.bebida.nombre,
                minlength: 4,
                maxlength: 100,
                required: true,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "esAlcoholica",
                type: "select",
                label: "Contiene Alcohol:",
                value: this.bebida.esAlcoholica,
                options: [{ value: true, text: "Si" }, { value: false, text: "No" }],
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "grados",
                type: "number",
                label: "Grados:",
                value: this.bebida.grados,
                min: 0,
                max: 100,
                required: true,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "precio",
                type: "number",
                label: "Precio:",
                value: this.bebida.precio,
                min: 0,
                max: 10000,
                required: true,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "calorias",
                type: "number",
                label: "Calorias:",
                value: this.bebida.calorias,
                min: 0,
                max: 5000,
                required: true,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "existencias",
                type: "number",
                label: "Existencias:",
                value: this.bebida.existencias,
                min: 0,
                max: 1000,
                required: true,
                labelCols: 3
            })
        );

        if (this.bebida._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "V:",
                    value: this.bebida.__v,
                    labelCols: 3
                })
            );
        }

        super.setContent(content);
    }
}

class EliminarBebidaPage extends DetalleBebidaPage {
    constructor(body, bebida, bebidaPage) {
        super(body, bebida);
        this.bebidaPage = bebidaPage;
        this.setTitle("Confirmación Eliminar Bebida");
        this.addBoton({
            attr: { "class": "btn btn-danger" },
            text: "Eliminar",
            click: () => this.eliminar()
        });
    }

    eliminar() {
        this.limpiarMensajes();
        this.showLoader();

        this.bebidaPage.bebidaClient.delete(this.bebida)
            .then(data => {
                console.log(data);
                if (data.errors) {
                    this.pintarError(data.message);
                } else {
                    this.hideButtons();
                    this.pintarMensaje(data.message);
                    this.addCloseEventListener(() => {
                        this.bebidaPage.getBebidas();
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

class ResumenBebidaPage extends PageFragment {
    constructor(body) {
        super(body);
        this.bebidaClient = new BebidaClient();
        this.resumen = null;
    }

    getResumen() {
        this.showLoader();
        this.bebidaClient.get()
            .then(
                lista => {
                    this.resumen = {
                        total: lista.length,
                        true: 0,
                        false: 0
                    }
                    if (lista.length) {

                        this.resumen = lista.reduce(
                            (result, bebida) => {
                                result[bebida.esAlcoholica]++;
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

                        lista.sort((a, b) => a.grados - b.grados);
                        this.resumen.minGrados = lista.find(bebida => bebida.esAlcoholica);
                        this.resumen.maxGrados = lista[lista.length - 1];
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
            text: "Resumen Bebidas"
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
                    label: "Alcoholicas:",
                    value: this.resumen[true],
                    labelCols: 3
                })
            );

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "No Alcoholicas:",
                    value: this.resumen[false],
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

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "Mayor Grado Alcoholico:",
                    value: `${this.resumen.maxGrados.nombre}: ${this.resumen.maxGrados.grados}°`,
                    labelCols: 4
                })
            );

            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "Menor Grado Alcoholico:",
                    value: `${this.resumen.minGrados.nombre}: ${this.resumen.minGrados.grados}°`,
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