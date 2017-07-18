/*


1) 1 Punto

Modela la clase Pokedex, la cual será nuestra enciclopedia de pokemons.
La clase Pokedex deberá tener:

- Array de Pokemons (contendrá solo los pokemons de la página en la que nos encontremos)
- Página actual (numérico)
- Número total de pokemons

Modela la clase Pokemon. Pokemon deberá tener:

- Nombre
- UrlDetalle

2) 1 Punto

Modela la clase ApiClient que se encargue de realizar peticiones get genéricas.
Sólo recibirá la URL sobre la que ejecutará la petición y debe devoler el body de respuesta ya parseado.
Se valorará el uso de Promesas en vez de callbacks.

4) 2 Puntos

Modela la clase PokemonApi que ofrezca:

- El método getPokemonsAtPage(numeroPagina): que devuelva el array de Pokemon de esa página.
- El método getPokemonByUrl(urlDePokemon): que devuelva el Pokemon de esa URL.

Esta clase deberá hacer uso de la clase ApiClient para pedir que haga el get de las URLs que necesite.
Al igual que en el anterior se valorará el uso de Promesas en vez de callbacks.

5) 2 Puntos 

Implementa las funciones pintarEstructura() y pintarPagina() en la clase pokedex .
Por ahora solo HTML y CSS, la funcionalidad de los botones puedes hacerla más tarde.

    pintarEstructura() debe pintar la estructura básica de la Pokedex:
    
        En la parte superior tendremos un paginador que tendrá:
            - Número de página actual.
            - Botón de página siguiente y página anterior

        En la parte media mostrará una tabla con los pokemons. La tabla tendrá 2 columnas: 
            - Nombre: tendrá el nombre del pokemon
            - Acciones. tendrá un botón ver detalles cuya acción implementaremos más tarde

    pintarPagina() debe rellenar la tabla con los pokemons de la página actual.


5) 1 Puntos

Haz que al cargar la página:
    - Se pinte la estructura de la pokedex.
    - Se pida la página 1
    - Se pinte la página actual

6) 1 Puntos

Implementa el paginador.
Cuando pulsemos en siguiente o anterior deberás pedir la página que corresponda al PokemonClient y posteriormente pintarla.

7) 2 Puntos

Implementa la funcionalidad del botón ver detalles:

    - Deberás pedir los detalles de ese Pokemon llamando a la función getPokemonByUrl de PokemonApi.
    - Deberás mostrar los detalles de ese pokemon, al menos:
        - Nombre
        - Una imagen (cualquiera dentro del array sprites)
        - Peso (weight)
        - Altura (height)

    Puedes hacer uso de una modal o mostrar los detalles debajo de la propia tabla.



INFO DE LA API:

URL de la API: http://pokeapi.co/api/v2/pokemon
URL de la API paginada: http://pokeapi.co/api/v2/pokemon/?offset=0

El offset en la API paginada es el número de pokemons que nos "saltamos", 
puesto que esta API devuelve los resultados de 20 en 20 para paginar debemos saltar de 20 en 20

Por ejemplo:

Página 1: http://pokeapi.co/api/v2/pokemon/?offset=0
Página 2: http://pokeapi.co/api/v2/pokemon/?offset=20
Página 3: http://pokeapi.co/api/v2/pokemon/?offset=40
..
..
..
Página n: offset = (n-1)*20


*/


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
}

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
                    	numTotalPokemons : data.count,
                    	pokemons : pokemons
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
                    let detallePokemon = new DetallePokemon(data.name, imagenes, data.weight, data.height) ;
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

    pintar (contenedor) {

        let contenedorImagen = document.createElement("li");
        contenedorImagen.setAttribute("class", "list-group-item imagen");
        if (this.imagenes.length) {
            this.imagenes.forEach(imagenUrl => {
                let imagen = document.createElement("img");
                imagen.setAttribute("src", imagenUrl);
                contenedorImagen.appendChild(imagen);
            });
        } else {
            contenedorImagen.appendChild(document.createTextNode("🚫 No hay imagen disponible."));
        }
        contenedor.appendChild(contenedorImagen);

        let contenedorNombre = document.createElement("li");
        contenedorNombre.setAttribute("class", "list-group-item etiqueta-valor");

        let labelNombre = document.createElement("span");
        labelNombre.setAttribute("class", "etiqueta");
        labelNombre.appendChild(document.createTextNode("Nombre: "));
        contenedorNombre.appendChild(labelNombre);

        let dataNombre = document.createElement("span");
        dataNombre.setAttribute("class", "valor nombre");
        dataNombre.appendChild(document.createTextNode(this.nombre));
        contenedorNombre.appendChild(dataNombre);

        contenedor.appendChild(contenedorNombre);


        let contenedorPeso = document.createElement("li");
        contenedorPeso.setAttribute("class", "list-group-item etiqueta-valor");

        let labelPeso = document.createElement("span");
        labelPeso.setAttribute("class", "etiqueta");
        labelPeso.appendChild(document.createTextNode("Peso: "));
        contenedorPeso.appendChild(labelPeso);

        let dataPeso = document.createElement("span");
        dataPeso.setAttribute("class", "valor");
        dataPeso.appendChild(document.createTextNode(this.peso));
        contenedorPeso.appendChild(dataPeso);

        contenedor.appendChild(contenedorPeso);


        let contenedorAltura = document.createElement("li");
        contenedorAltura.setAttribute("class", "list-group-item etiqueta-valor");

        let labelAltura = document.createElement("span");
        labelAltura.setAttribute("class", "etiqueta");
        labelAltura.appendChild(document.createTextNode("Altura: "));
        contenedorAltura.appendChild(labelAltura);

        let dataAltura = document.createElement("span");
        dataAltura.setAttribute("class", "valor");
        dataAltura.appendChild(document.createTextNode(this.altura));
        contenedorAltura.appendChild(dataAltura);

        contenedor.appendChild(contenedorAltura);

    }
}

class Pokemon {
    constructor(nombre, urlDetalle) {
        this.nombre = nombre;
        this.urlDetalle = urlDetalle;
    }

    pintar(tbody, verDetalle, verDetallePopup) {
        let tr = document.createElement("tr");

        let tdNombre = document.createElement("td");
        tdNombre.setAttribute("class", "nombre");
        tdNombre.appendChild(document.createTextNode(this.nombre));
        tr.appendChild(tdNombre);

        // let tdUrl = document.createElement("td");
        // tdUrl.appendChild(document.createTextNode(this.urlDetalle));
        // tr.appendChild(tdUrl);

        let tdAcciones = document.createElement("td");
        tdAcciones.setAttribute("class", "acciones");
        if (verDetalle) {
            let button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("class", "btn btn-xs btn-primary");
            button.appendChild(document.createTextNode("Ver Detalles"));
            button.addEventListener("click", verDetalle);
            tdAcciones.appendChild(button);
        }
        if (verDetallePopup) {
            let button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("class", "btn btn-xs btn-info");
            button.setAttribute("data-toggle", "modal");
            button.setAttribute("data-target", "#modal-detalle");
            button.appendChild(document.createTextNode("Ver Detalles"));
            button.addEventListener("click", verDetallePopup);
            tdAcciones.appendChild(button);
        }
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
    }

    static pintarCabecera(thead, acciones) {
        let tr = document.createElement("tr");

        let tdNombre = document.createElement("th");
        tdNombre.appendChild(document.createTextNode("Nombre"));
        tr.appendChild(tdNombre);

        // let tdUrl = document.createElement("th");
        // tdUrl.appendChild(document.createTextNode("URL"));
        // tr.appendChild(tdUrl);

        let tdAcciones = document.createElement("th");
        tdAcciones.appendChild(document.createTextNode("Acciones"));
        tr.appendChild(tdAcciones);

        thead.appendChild(tr);
    }
}

class Pokedex {
    constructor() {
        this.pokemons = [];
        this.paginaActual = null;
        this.numTotalPokemons = null;
        this.pokemonClient = new PokemonClient();
        this.contenedorLista = null;
        this.contenedorDetalle = null;
        this.contenedorPaginaActual = null;
        this.buttonAnt = null;
        this.buttonSig = null;
    }

    getPokemons(numeroPagina = 1) {
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
    	this.getPokemons(Math.ceil(pokedex.numTotalPokemons / 20));
    }

    getPokemon(pokemon, contenedorDetalle = this.contenedorDetalle) {
        this.pokemonClient.getPokemonByUrl(pokemon.urlDetalle)
            .then(
                detallePokemon => {
                    console.log(detallePokemon);
                    this.pintarDetalle(detallePokemon, contenedorDetalle);
                }
            );
    }

/*    
    pintarEstructura() debe pintar la estructura básica de la Pokedex:
    
        En la parte superior tendremos un paginador que tendrá:
            - Número de página actual.
            - Botón de página siguiente y página anterior

        En la parte media mostrará una tabla con los pokemons. La tabla tendrá 2 columnas: 
            - Nombre: tendrá el nombre del pokemon
            - Acciones. tendrá un botón ver detalles cuya acción implementaremos más tarde
            */

    pintarEstructura() {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        let contenedor = document.createElement("div");
        contenedor.setAttribute("class", "container theme-showcase")

        /* HEADER */
        let contenedorHead = document.createElement("header");
        contenedorHead.setAttribute("class", "page-header");
        let titulo = document.createElement("h1");
        titulo.appendChild(document.createTextNode("La Pokedex Xanxa!"));
        contenedorHead.appendChild(titulo);
        contenedor.appendChild(contenedorHead);

        /* NAV */
        let contenedorNav = document.createElement("div");
        contenedorNav.setAttribute("class", "controles");

        this.buttonIni = document.createElement("button");
        this.buttonIni.setAttribute("type", "button");
        this.buttonIni.setAttribute("class", "btn btn-primary listar");
        this.buttonIni.appendChild(document.createTextNode("|< Primera"));
        this.buttonIni.onclick = () => this.getPaginaInicial();
        contenedorNav.appendChild(this.buttonIni);

        this.buttonAnt = document.createElement("button");
        this.buttonAnt.setAttribute("type", "button");
        this.buttonAnt.setAttribute("class", "btn btn-primary listar");
        this.buttonAnt.appendChild(document.createTextNode("< Anterior"));
        this.buttonAnt.onclick = () => this.getPaginaAnterior();
        contenedorNav.appendChild(this.buttonAnt);

        let contenedorPag = document.createElement("span");
        contenedorPag.setAttribute("class", "etiqueta-valor");

        let label = document.createElement("span");
        label.setAttribute("class", "etiqueta");
        label.appendChild(document.createTextNode(" Página actual: "));
        contenedorPag.appendChild(label);

        let data = document.createElement("span");
        data.setAttribute("class", "valor");
        data.appendChild(document.createTextNode(this.paginaActual + " "));
        contenedorPag.appendChild(data);

        contenedorNav.appendChild(contenedorPag);
        this.contenedorPaginaActual = data;

        this.buttonSig = document.createElement("button");
        this.buttonSig.setAttribute("type", "button");
        this.buttonSig.setAttribute("class", "btn btn-primary listar");
        this.buttonSig.appendChild(document.createTextNode("Siguiente >"));
        this.buttonSig.onclick = () => this.getPaginaSiguiente();
        contenedorNav.appendChild(this.buttonSig);

        this.buttonUlt = document.createElement("button");
        this.buttonUlt.setAttribute("type", "button");
        this.buttonUlt.setAttribute("class", "btn btn-primary listar");
        this.buttonUlt.appendChild(document.createTextNode("Última >|"));
        this.buttonUlt.onclick = () => this.getPaginaUltima();
        contenedorNav.appendChild(this.buttonUlt);

        contenedorHead.appendChild(contenedorNav);

        /* POKEDEX */
        let contenedorPokedex = document.createElement("div");
        contenedorPokedex.setAttribute("class", "row");

        let contenedorColumna1 = document.createElement("div");
        contenedorColumna1.setAttribute("class", "col-sm-8 col-md-6 col-lg-4");
        let titulo1 = document.createElement("h2");
        titulo1.appendChild(document.createTextNode("Listado de Pokemons"));
        contenedorColumna1.appendChild(titulo1);
        this.contenedorLista = document.createElement("div");
        this.contenedorLista.setAttribute("class", "lista");
        contenedorColumna1.appendChild(this.contenedorLista);
        contenedorPokedex.appendChild(contenedorColumna1);

        let contenedorColumna2 = document.createElement("div");
        contenedorColumna2.setAttribute("class", "col-sm-4 col-md-6 col-lg-8");
        let titulo2 = document.createElement("h2");
        titulo2.appendChild(document.createTextNode("Detalle del Pokemon"));
        contenedorColumna2.appendChild(titulo2);
        this.contenedorDetalle = document.createElement("ul");
        this.contenedorDetalle.setAttribute("class", "list-group detalle");
        contenedorColumna2.appendChild(this.contenedorDetalle);
        contenedorPokedex.appendChild(contenedorColumna2);

        contenedor.appendChild(contenedorPokedex);

        document.body.appendChild(contenedor);

        /* MODAL */
        let modal = document.createElement("div");
        modal.setAttribute("id", "modal-detalle");
        modal.setAttribute("class", "modal fade");
        modal.setAttribute("role", "dialog");
        let modalDialog = document.createElement("div");
        modalDialog.setAttribute("class", "modal-dialog");
        let modalContent = document.createElement("div");
        modalContent.setAttribute("class", "modal-content");

        let modalHeader = document.createElement("div");
        modalHeader.setAttribute("class", "modal-header");
        let modalClose = document.createElement("button");
        modalClose.setAttribute("type", "button");
        modalClose.setAttribute("class", "close");
        modalClose.setAttribute("data-dismiss", "modal");
        modalClose.appendChild(document.createTextNode("×"));
        modalHeader.appendChild(modalClose);
        let tituloModal = document.createElement("h4");
        tituloModal.setAttribute("class", "modal-title");
        tituloModal.appendChild(document.createTextNode("Detalle del Pokemon"));
        modalHeader.appendChild(tituloModal);
        modalContent.appendChild(modalHeader);

        this.modalDetalle = document.createElement("div");
        this.modalDetalle.setAttribute("class", "modal-header");
        modalContent.appendChild(this.modalDetalle);

        let modalFooter = document.createElement("div");
        modalFooter.setAttribute("class", "modal-header");
        let modalBtnClose = document.createElement("button");
        modalBtnClose.setAttribute("type", "button");
        modalBtnClose.setAttribute("class", "btn btn-primary");
        modalBtnClose.setAttribute("data-dismiss", "modal");
        modalBtnClose.appendChild(document.createTextNode("Close"));
        modalFooter.appendChild(modalBtnClose);
        modalContent.appendChild(modalFooter);

        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);

        document.body.appendChild(modal);
    }

    pintarPagina() {
        while (this.contenedorLista.firstChild) {
            this.contenedorLista.removeChild(this.contenedorLista.firstChild);
        }
        let table = document.createElement("table");
        table.setAttribute("class", "table table-condensed table-bordered table-striped pokemons");

        let thead = document.createElement("thead");
        Pokemon.pintarCabecera(thead, "Acciones");
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        this.pokemons.forEach(pokemon => pokemon.pintar(
	            tbody,
                () => this.getPokemon(pokemon, this.contenedorDetalle),
	            () => this.getPokemon(pokemon, this.modalDetalle),
            )
        );
        table.appendChild(tbody);

        this.contenedorLista.appendChild(table);
        this.contenedorPaginaActual.innerText = this.paginaActual + " ";
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
    }

    pintarDetalle(detallePokemon, contenedorDetalle = this.contenedorDetalle) {
        while (contenedorDetalle.firstChild) {
            contenedorDetalle.removeChild(contenedorDetalle.firstChild);
        }

		detallePokemon.pintar(contenedorDetalle);

    }

    pintar() {
        if (!this.contenedorLista) {
            this.pintarEstructura();
        }
        this.pintarPagina();
    }
}


let pokedex = null;

window.onload = () => {
    pokedex = new Pokedex();
    pokedex.getPokemons();
}