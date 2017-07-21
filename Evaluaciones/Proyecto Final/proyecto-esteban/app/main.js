/* ***** PAGINAS ESPECIFICAS DE USO COMPARTIDO ***** */

class PageHeader extends PageFragment {
    constructor(body) {
        super(body);
    }

    pintarPagina() {

        this.limpiarPagina();

        let [header] = HtmlUtil.createElementWithChildren({
            tag: "header",
            attr: { "class": "global-header" },
            children: [{
                tag: "h1",
                attr: { "class": "global-title" },
                text: "Proyecto Final Javascript Avanzado"
            }]
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
            attr: { "class": "global-footer" },
            text: "Ⓒ Esteban Ellicker 2017"
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
            text: "Ingresa con tu usuario y contraseña"
        });
        this.loginForm.appendChild(title);

        let focusHandler = () => this.limpiarMensajes();

        this.loginForm.appendChild(
            HtmlUtil.createFormGroup({
                id: "username",
                label: "Usuario:",
                value: "",
                placeholder: "Nombre de usuario",
                events: { "focus": focusHandler },
                minlength: 4,
                maxlength: 100,
                required: true
            })
        );

        this.loginForm.appendChild(
            HtmlUtil.createFormGroup({
                id: "password",
                type: "password",
                label: "Contraseña:",
                value: "",
                placeholder: "Contraseña de usuario",
                events: { "focus": focusHandler },
                minlength: 4,
                maxlength: 100,
                required: true
            })
        );

        this.loginForm.appendChild(
            HtmlUtil.createFormGroup({
                id: "recordar",
                type: "checkbox",
                label: " Recordar",
                value: "1"
            })
        );

        let button = HtmlUtil.createButton({
            text: "Login",
            click: () => this.doLogin(),
            attr: {
                "class": "btn btn-lg btn-primary btn-block"
            }
        });
        this.loginForm.appendChild(button);

        this.contenedorMensajes = this.loginForm;

        loginContainer.appendChild(this.loginForm);
        this.contenedor.appendChild(loginContainer);

    }

    doLogin() {
        this.limpiarMensajes();
        if (this.loginForm.checkValidity()) {
            console.log("OK");
            this.showLoader();
            let username = this.loginForm.username.value;
            let password = this.loginForm.password.value;
            let recordar = this.loginForm.recordar.checked;
            this.navigator.login(username, password, recordar)
                .then(ok => {
                    if (ok) {
                        console.log("¡¡¡Login Ok!!!");
                        this.navigator.navigateToHome();
                    } else {
                        console.error("¡¡¡Login Error!!!");
                        this.loginForm.username.value = "";
                        this.loginForm.password.value = "";
                        this.pintarError("El usuario o la contraseña no corresponden");
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

}

class HomePage extends InnerPage {
    constructor(body) {
        super(body);
    }

    actualizar() {
        this.pintarPagina();
    }

    pintarEstructura() {
        super.pintarEstructura();

        /* HEADER */
        let contenedorHead = HtmlUtil.createElement({
            tag: "header",
            attr: { "class": "page-header home" }
        });
        let titulo = HtmlUtil.createElement({
            tag: "h2",
            text: "Home"
        });
        contenedorHead.appendChild(titulo);
        this.contenedor.appendChild(contenedorHead);

        /* LISTA */
        this.contenedorData = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "data" }
        });
        this.contenedor.appendChild(this.contenedorData);
        this.contenedorMensajes = this.contenedorData;

        /* FOOTER */
        let contenedorFooter = HtmlUtil.createElement({
            tag: "footer",
            attr: { "class": "page-footer home" }
        });

        /* NAV */
        let contenedorNav = HtmlUtil.createElement({
            tag: "div",
            attr: { "class": "controles" }
        });

        this.buttonRefresh = HtmlUtil.createButton({
            text: "Refrescar",
            click: () => this.actualizar()
        });
        contenedorNav.appendChild(this.buttonRefresh);

        contenedorFooter.appendChild(contenedorNav);
        this.contenedor.appendChild(contenedorFooter);
    }

    pintarPagina() {
        HtmlUtil.removeChilds(this.contenedorData);

        let content = HtmlUtil.createElement({
            tag: "div",
            attr: {
                "class": "home-comtent row"
            }
        });

        for (let page in this.navigator.pages) {
            let pageAttr = this.navigator.pages[page];
            if (pageAttr.rClass) {
                let resumen = new pageAttr.rClass(content);
                resumen.pintar();
            }
        }



        this.contenedorData.appendChild(content);
    }
}



/* ***** CLASES APLICACIÓN ***** */

class AuthController {
    constructor() {
        this.loginClient = new LoginClient();
        this.publicPages = [];
    }

    login(username, password, recordar) {
        this.logout();
        return this.loginClient.login(username, password)
            .then(authUser => {
                let result = false;
                if (authUser) {
                    SessionAPI.setUser(authUser, recordar);
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
    constructor(authController, home, login, pages) {
        this.authController = authController;
        this.homePage = home;
        this.loginPage = login;
        this.pages = pages;
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
    login(username, password, recordar) {
        return this.authController.login(username, password, recordar);
    }
    logout() {
        return this.authController.logout();
    }
}

class Application {
    constructor() {
        this.authController = new AuthController();
        this.navigator = new NavigationController(
            this.authController,
            "home",
            "login", {
                "home": {
                    title: "Home",
                    pClass: HomePage
                },
                "comidas": {
                    title: "Comidas",
                    pClass: ComidaPage,
                    rClass: ResumenComidaPage
                },
                "bebidas": {
                    title: "Bebidas",
                    pClass: BebidaPage,
                    rClass: ResumenBebidaPage
                },
                "usuarios": {
                    title: "Usuarios",
                    pClass: UserPage
                },
                "login": {
                    title: "Logout",
                    pClass: LoginPage
                }
            }
        );
    }
    start() {
        this.navigator.navigateToHome();
    }
}


let application = null;

window.onload = () => {

    /* USUARIO PARA PRUEBAS */
    // let userClient = new UserLocalClient();
    // userClient.get().then(lista => {
    //     let admin = lista.find(user => user.id == "esteban");
    //     if (admin) {
    //         console.log("Usuario de pruebas:");
    //         console.log(JSON.stringify(admin));
    //     } else {
    //         console.log("Creando usuario de pruebas:");
    //         userClient.post(
    //                 new User(null, "esteban", "123456", "Esteban", "Ellicker Iglesias", "esteban.ellicker@bbva.com", "admin")
    //             )
    //             .then(
    //                 data => console.log(JSON.stringify(data))
    //             );
    //     }
    // });
    /* ******************** */

    application = new Application();
    application.start();
}