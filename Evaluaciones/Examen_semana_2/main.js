/*
Examen semana 2

Vamos a hacer una tienda On-Line:



1) (2 Puntos) - Realiza una clase Tienda y una clase Producto que tenga las propiedades que consideres. 

Como mínimo deberán tener:



Tienda:

    - Un array de productos

    - Nombre

    - URL 

Producto:

    - Nombre 

    - Precio

    - Descripción

    - Url de imagen



2) (2 Puntos) - Realiza el HTML de una página que tenga en su lado izquierdo un formulario para introducir productos.

EL formulario deberá tener todos los campos necesarios para crear un producto. Y un botón de "Añadir". Realiza solo la maqueta HTML y CSS (sin funcionalidad).



3) (2 Puntos)  - Haz que al pulsar en el botón "Añadir" se recojan los datos del formulario y se cree un nuevo producto. El producto deberá ser añadido al array de productos de la tienda. (Sólo programación JavaScript, sin pintado de productos)



4) (2 Puntos) - Haz una función pintarTienda en Tienda que pinte el HTMl de todos los productos de la tienda. Cada vez que se cree o se elimine un producto deberás pintar todos los productos.



5) (2 puntos) - Añade en cada producto un botón de borrado, que elimine el producto de la tienda y vuelva a pintar todo el listado de productos.
 */


/* ********** Configuracion ********** */

var config = {};


/* ********** Funciones Utilitarias ********** */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* ********** Clase Producto ********** */

function Producto(id, nombre, precio, descripcion, urlImagen) {
    this.initProducto(id, nombre, precio, descripcion, urlImagen);
}
Producto.prototype.initProducto = function(id, nombre, precio, descripcion, urlImagen) {
    this.id = id || getRandomInt(1, Number.MAX_SAFE_INTEGER);
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.urlImagen = urlImagen;
};


/* ********** Clase Tienda ********** */

function Tienda(id, nombre, direccion, url) {
    this.initTienda(id, nombre, direccion, url);
}
Tienda.prototype.initTienda = function(id, nombre, direccion, url) {
    this.id = id || getRandomInt(1, Number.MAX_SAFE_INTEGER);
    this.nombre = nombre;
    this.direccion = direccion;
    this.url = url;
    this.productos = [];
};
Tienda.prototype.addProducto = function(producto) {
    return this.productos.push(producto);
};
Tienda.prototype.quitarProducto = function(producto) {
    var indice = this.productos.indiceOf(producto);
    this.productos.splice(indice, 1);
};
Tienda.prototype.quitarProductoByIndice = function(indice) {
    this.productos.splice(indice, 1);
};
Tienda.prototype.pintarTienda = function(divProductos) {
    var html = "<table>";
    html += '<tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Descripción</th><th>Acciones</th></tr>';
    for (var i = 0; i < this.productos.length; i++) {
        var producto = this.productos[i];
        html += '<tr><td class="posicion"><img class="imagen" src="' + producto.urlImagen + '"/></td><td>' + producto.nombre + '</td><td class="numero">' + producto.precio + '$</td><td>' + producto.descripcion + '</td><td class="acciones"><button class="del-button" id="del-button-' + i + '" onclick="borrarProducto(' + i + ')">Borrar</button></td></tr>';
    }
    html += "</table>";
    divProductos.innerHTML = html;
};


/* ********** Funciones para Controles ********** */

function initControles(tienda) {

    var form = document.getElementById("form-add-producto");
    var inputNombre = document.getElementById("nombre");
    var inputUrlImagen = document.getElementById("url-imagen");
    var inputPrecio = document.getElementById("precio");
    var inputDescripcion = document.getElementById("descripcion");
    var addButton = document.getElementById("add-button");
    var divMensajes = document.getElementById("mensajes");
    var divProductos = document.getElementById("productos");

    var mostrarMensajes = function(mensajes) {
        divMensajes.innerHTML = mensajes.join("<br>");
        divMensajes.style = "display: block;";
    };

    var ocultarMensajes = function() {
        divMensajes.style = "";
    };

    addButton.onclick = function() {
        ocultarMensajes();
        var mensajes = [];

        var id = null; //lo dejanos en null para que lo calcule aleatoriamente
        var nombre = inputNombre.value.trim();
        var urlImagen = inputUrlImagen.value.trim();
        var precio = parseInt(inputPrecio.value.trim(), 10);
        var descripcion = inputDescripcion.value.trim();

        if (nombre === "") {
            mensajes.push("Nombre es un atributo obligatorio");
        }
        if (Number.isNaN(precio)) {
            mensajes.push("Precio debe ser un número");
        }

        if (!form.checkValidity()) {
            mensajes.push("Hay errores en los datos que impiden agregar el producto");
        }

        if (mensajes.length) {
            form.className = "validado";
            mostrarMensajes(mensajes);
        } else {
            var producto = new Producto(id, nombre, precio, descripcion, urlImagen);
            tienda.addProducto(producto);
            tienda.pintarTienda(divProductos);

            form.className = "";
            inputNombre.value = "";
            inputUrlImagen.value = "";
            inputPrecio.value = "";
            inputDescripcion.value = "";
        }
    };

    window.borrarProducto = function(indice) {
        tienda.quitarProductoByIndice(indice);
        tienda.pintarTienda(divProductos);
    };

    tienda.pintarTienda(divProductos);

}

window.onload = function() {

    var tienda = new Tienda(null, "La tiendita de Esteban", "Calzada General Mariano Escobedo 303", "https://www.latienditadeesteban.com/");

    tienda.addProducto(new Producto(null, "Camisa Azul", 1200, "Una linda camisa de color azul", "http://chevignon.vteximg.com.br/arquivos/ids/251250-366-451/63_6126000_020010_0.jpg"));
    tienda.addProducto(new Producto(null, "Vaquero", 2300, "El cásico pantalon de mezclilla azul", "http://media.mayoral.com/wcsstore/mayoral/images/catalog/mayoral/27-00056-011-390-1.JPG"));

    document.getElementById("nombre-tienda").innerHTML = tienda.nombre;
    document.getElementById("direccion-tienda").innerHTML = tienda.direccion;

    initControles(tienda);

};