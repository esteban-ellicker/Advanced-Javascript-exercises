/* ***** CLASES DE DATOS ***** */

class User {
    constructor(_id, username, password, nombre, apellidos, email, __v) {
        this._id = _id;
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.__v = __v;
    }
}


/* ***** CLIENTES ***** */

class UserClient {
    constructor(urlBase = "http://formacion-indra-franlindebl.com") {
        this.urlBase = urlBase;
        this.apiClient = new APIClient();
    }

    _userFromData(data) {
        return data !== null ? new User(
            data._id,
            data.username,
            data.password,
            data.nombre,
            data.apellidos,
            data.email,
            data.__v
        ) : null;
    }

    _dataFromUser(user) {
        let data = null;
        if (user._id) {
            data = {
                _id: user._id,
                username: user.username,
                password: user.password,
                nombre: user.nombre,
                apellidos: user.apellidos,
                email: user.email,
                __v: user.__v
            };
        } else {
            data = {
                username: user.username,
                password: user.password,
                nombre: user.nombre,
                apellidos: user.apellidos,
                email: user.email
            };
        }
        return data;
    }

    find(user) {
        return this.apiClient.get(
                this.urlBase + "/api/users/" + (user instanceof User ? user._id : user)
            )
            .then(data => {
                console.log(data);
                return this._userFromData(data);
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error al buscar usuario: " + error.message);
                throw error;
            });
    }

    get() {
        return this.apiClient.get(
                this.urlBase + "/api/users"
            )
            .then(lista => {
                console.log(lista);
                let users = [];
                lista.forEach(data => users.push(this._userFromData(data)));
                return users;
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error al listar usuarios: " + error.message);
                throw error;
            });
    }

    post(user) {
        return this.apiClient.post(
                this.urlBase + "/api/users",
                this._dataFromUser(user)
            )
            .then(data => {
                console.log(data);
                return {
                    user: this._userFromData(data),
                    message: "Usuario creado!"
                };
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error al crear usuario: " + error.message);
                throw error;
            });
    }

    delete(user) {
        return this.apiClient.delete(
                this.urlBase + "/api/users/" + (user instanceof User ? user._id : user), {
                    password: user.password
                }
            )
            .then(data => {
                console.log(data);
                return data;
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error al eliminar usuario: " + error.message);
                throw error;
            });
    }

    put(user) {
        return this.apiClient.put(
                this.urlBase + "/api/users/" + user._id,
                this._dataFromUser(user)
            )
            .then(
                data => {
                    console.log(data);
                    return {
                        user: this._userFromData(data),
                        message: "Usuario actualizado!"
                    };
                })
            .catch(error => {
                console.error(error);
                console.error(error.message);
                error = new Error("Error al actualizar usuario: " + error.message);
                throw error;
            });
    }
}

class LoginClient extends UserClient {
    constructor() {
        super();
    }

    login(username, password) {
        return this.apiClient.post(
                this.urlBase + "/api/users/login", {
                    username: username,
                    password: password
                }
            )
            .then(data => {
                console.log(data);
                return this._userFromData(data);
            })
            .catch(error => {
                console.error(error);
                error = new Error("Error validar credenciales: " + error.message);
                throw error;
            });
    }
}


/* ***** PÁGINAS ESPECÍFICAS ***** */

class UserPage extends InnerPage {
    constructor(body) {
        super(body);
        this.users = [];
        this.userClient = new UserClient();
        this.contenedorLista = null;
        this.contenedorDetalle = null;
    }

    getUsers() {
        this.showLoader();
        this.userClient.get()
            .then(
                lista => {
                    console.log(lista);
                    this.users = lista;
                    this.pintar();
                }
            );
    }

    start() {
        super.start();
        this.getUsers();
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
            text: "Usuarios"
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
            click: () => this.getUsers()
        });
        contenedorNav.appendChild(this.buttonRefresh);

        this.buttonCrear = HtmlUtil.createButton({
            text: "Crear Usuario",
            click: () => this.nuevaUser()
        });
        contenedorNav.appendChild(this.buttonCrear);

        contenedorFooter.appendChild(contenedorNav);
        this.contenedor.appendChild(contenedorFooter);
    }

    pintarPagina() {
        HtmlUtil.removeChilds(this.contenedorLista);

        let table = HtmlUtil.createElement({
            tag: "table",
            attr: { "class": "table table-condensed table-bordered table-striped users" }
        });

        let thead = HtmlUtil.createElement({ tag: "thead" });
        let tr = HtmlUtil.crearTableRow(["Nombre Usuario", "Nombre", "Apellidos", "Correo Electrónico", "Acciones"], "th");
        thead.appendChild(tr);
        table.appendChild(thead);

        let tbody = HtmlUtil.createElement({ tag: "tbody" });
        this.users.forEach(user => {
            let tr = HtmlUtil.crearTableRow([
                user.username,
                user.nombre,
                user.apellidos,
                user.email
            ]);
            let tdAcciones = HtmlUtil.createElement({
                tag: "td",
                attr: { "class": "acciones" }
            });

            let buttonDetalle = HtmlUtil.createButton({
                attr: { "class": "btn btn-xs btn-info" },
                text: "Ver Detalles",
                click: () => this.pintarDetalle(user)
            });
            tdAcciones.appendChild(buttonDetalle);

            let buttonEditar = HtmlUtil.createButton({
                attr: { "class": "btn btn-xs btn-primary" },
                text: "Editar",
                click: () => this.editar(user)
            });
            tdAcciones.appendChild(buttonEditar);

            let buttonEliminar = HtmlUtil.createButton({
                attr: { "class": "btn btn-xs btn-danger" },
                text: "Eliminar",
                click: () => this.eliminar(user)
            });
            tdAcciones.appendChild(buttonEliminar);

            tr.appendChild(tdAcciones);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        this.contenedorLista.appendChild(table);

        this.hideLoader();
    }

    _pintarModal(user, ClaseModal) {
        this.limpiarMensajes();
        this.showLoader();
        this.userClient.find(user)
            .then(user => {
                if (user) {
                    let pageDetalle = new ClaseModal(this.body, user, this);
                    pageDetalle.pintar();
                } else {
                    this.pintarError("Usuario no encontrada, debes refrescar la lista.");
                }
                this.hideLoader();
            })
            .catch(data => {
                console.log(data);
                this.pintarError(data.message);
                this.hideLoader();
            });
    }

    pintarDetalle(user) {
        this._pintarModal(user, DetalleUserPage);
    }

    editar(user) {
        this._pintarModal(user, FormUserPage);
    }

    eliminar(user) {
        this._pintarModal(user, EliminarUserPage);
    }

    nuevaUser() {
        this.editar(new User());
    }
}

class DetalleUserPage extends ModalPage {
    constructor(body, user) {
        super(body);
        this.user = user;
        this.setTitle("Detalle Usuario");
    }

    pintarPagina() {
        this.limpiarPagina();

        let content = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "detalle" }
        });

        if (this.user._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "ID:",
                    value: this.user._id,
                    labelCols: 3
                })
            );
        }

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Nombre Usuario:",
                value: this.user.username,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Nombre:",
                value: this.user.nombre,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Apellidos:",
                value: this.user.apellidos,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Correo Electrónico:",
                value: this.user.email,
                labelCols: 3
            })
        );

        if (this.user._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "V:",
                    value: this.user.__v,
                    labelCols: 3
                })
            );
        }

        super.setContent(content);
    }
}

class FormUserPage extends DetalleUserPage {
    constructor(body, user, userPage) {
        super(body, user);
        this.userPage = userPage;
        this.setTitle(this.user._id ? "Editar Usuario" : "Crear Usuario");
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

            this.user.username = this.form.username.value;
            this.user.password = this.form.password.value;
            this.user.nombre = this.form.nombre.value;
            this.user.apellidos = this.form.apellidos.value;
            this.user.email = this.form.email.value;

            let promise = this.user._id ?
                this.userPage.userClient.put(this.user) :
                this.userPage.userClient.post(this.user);

            promise.then(data => {
                    console.log(data);
                    if (data.errors) {
                        this.pintarError(data.message);
                        this.hideLoader();
                    } else {
                        if (data.errmsg) {
                            this.pintarError(data.errmsg);
                        } else {
                            this.user = data.user;
                            this.pintarPaginaSoloLectura();
                            this.hideButtons();
                            this.pintarMensaje(data.message);
                            this.addCloseEventListener(() => {
                                this.userPage.getUsers();
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
        } else {
            this.pintarError("Alguno de los campos no está informado correctamente");
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

        if (this.user._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "ID:",
                    value: this.user._id,
                    labelCols: 3
                })
            );
        }

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "username",
                type: "text",
                label: "Nombre Usuario:",
                value: this.user.username,
                minlength: 4,
                maxlength: 100,
                required: true,
                labelCols: 3
            })
        );

        if (!this.user._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    id: "password",
                    type: "password",
                    label: "Contraseña:",
                    value: this.user.password,
                    minlength: 4,
                    maxlength: 100,
                    required: true,
                    labelCols: 3
                })
            );
        }

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "nombre",
                type: "text",
                label: "Nombre:",
                value: this.user.nombre,
                minlength: 4,
                maxlength: 100,
                required: true,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "apellidos",
                type: "text",
                label: "Apellidos:",
                value: this.user.apellidos,
                minlength: 4,
                maxlength: 100,
                required: true,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                id: "email",
                type: "email",
                label: "Correo Electrónico:",
                value: this.user.email,
                minlength: 4,
                maxlength: 100,
                required: true,
                labelCols: 3
            })
        );

        if (this.user._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "V:",
                    value: this.user.__v,
                    labelCols: 3
                })
            );
        }

        if (this.user._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    id: "password",
                    type: "password",
                    label: "Contraseña actual:",
                    value: this.user.password,
                    minlength: 4,
                    maxlength: 100,
                    required: true,
                    labelCols: 3
                })
            );
        }

        super.setContent(content);
    }
}

class EliminarUserPage extends DetalleUserPage {
    constructor(body, user, userPage) {
        super(body, user);
        this.userPage = userPage;
        this.setTitle("Confirmación Eliminar User");
        this.addBoton({
            attr: { "class": "btn btn-danger" },
            text: "Eliminar",
            click: () => this.eliminar()
        });
    }

    eliminar() {
        this.limpiarMensajes();
        if (this.form.checkValidity()) {
            this.showLoader();

            this.user.password = this.form.password.value;

            this.userPage.userClient.delete(this.user)
                .then(data => {
                    console.log(data);
                    if (data.errors) {
                        this.pintarError(data.message);
                    } else {
                        this.hideButtons();
                        this.pintarMensaje(data.message);
                        this.addCloseEventListener(() => {
                            this.userPage.getUsers();
                        });
                    }
                    this.hideLoader();
                })
                .catch(data => {
                    console.log(data);
                    this.pintarError(data.message);
                    this.hideLoader();
                });
        } else {
            this.pintarError("Alguno de los campos no está informado correctamente");
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

        if (this.user._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "ID:",
                    value: this.user._id,
                    labelCols: 3
                })
            );
        }

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Nombre Usuario:",
                value: this.user.username,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Nombre:",
                value: this.user.nombre,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Apellidos:",
                value: this.user.apellidos,
                labelCols: 3
            })
        );

        content.appendChild(
            HtmlUtil.createFormGroup({
                type: "static",
                label: "Correo Electrónico:",
                value: this.user.email,
                labelCols: 3
            })
        );

        if (this.user._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    type: "static",
                    label: "V:",
                    value: this.user.__v,
                    labelCols: 3
                })
            );
        }

        if (this.user._id) {
            content.appendChild(
                HtmlUtil.createFormGroup({
                    id: "password",
                    type: "password",
                    label: "Contraseña actual:",
                    value: this.user.password,
                    required: true,
                    labelCols: 3
                })
            );
        }

        super.setContent(content);
    }
}