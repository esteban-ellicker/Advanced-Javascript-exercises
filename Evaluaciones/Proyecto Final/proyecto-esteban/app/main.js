/* ***** PAGINAS ESPECIFICAS DE USO COMPARTIDO ***** */

class PageHeader extends PageFragment {
    constructor(body) {
        super(body);
    }

    pintarPagina() {

        this.limpiarPagina();

        let header = HtmlUtil.createElement({
            tag: "header",
            attr: { "class": "global-header" },
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
            attr: { "class": "global-footer" },
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
                })
                .catch(data => {
                    console.log(data);
                    this.pintarError(data.message);
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



/* ***** CLASES APLICACIÓN ***** */

class AuthController {
    constructor() {
        this.loginClient = new LoginClient();
        this.publicPages = [];
    }

    login(username, password) {
        this.logout();
        return this.loginClient.login(username, password)
            .then(authUser => {
                let result = false;
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
            "bebidas": {
                title: "Bebidas",
                pClass: BebidaPage
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