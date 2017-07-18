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

const config = {};


/* ********** Funciones Utilitarias ********** */

const Util = function() {
    var secuence = 0;
    class Util {
        static getRandomInt(min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        static getSecuentialId() {
            return ++secuence;
        }
    }
    return Util;
}();


/* ********** Clase Producto ********** */

class Producto {
    constructor(id, nombre, precio, descripcion, urlImagen) {
        this.id = id || Util.getSecuentialId();
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.urlImagen = urlImagen;
    }
    pintarFilaProducto(currencyFormatter) {
        var precio = currencyFormatter.format(this.precio);
        return `<tr>
                <td class="posicion"><img class="imagen" src="${this.urlImagen}"/></td>
                <td>${this.nombre}</td><td class="numero">${precio}</td>
                <td>${this.descripcion}</td>
                <td class="acciones">
                    <button class="del-button" id="del-button-${this.id}" onclick="manager.borrarProducto(${this.id})">Borrar</button>
                    <button class="del-button" id="add-carrito-button-${this.id}" onclick="manager.agregarAlCarrito(${this.id})">Carrito</button>
                </td>
            </tr>`;
    }
}


/* ********** Clase Tienda ********** */

class Tienda {
    constructor(id, nombre, direccion, url, currencyFormatter) {
        this.id = id || Util.getSecuentialId();
        this.nombre = nombre;
        this.direccion = direccion;
        this.url = url;
        this.productos = new Map();
        this.currencyFormatter = currencyFormatter;
    }
    addProducto(producto) {
        this.productos.set(producto.id, producto);
    }
    findProductoById(id) {
        return this.productos.get(id);
    }
    removeProductoById(id) {
        return this.productos.delete(id);
    }
    removeProducto(producto) {
        return this.removeProductoById(producto.id);
    }
    pintarTienda(divProductos, currencyFormatter) {
        let html = "<table>";
        html += '<thead><tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Descripción</th><th>Acciones</th></tr></thead>';
        html += '<tbody>';
        this.productos.forEach(producto => html += producto.pintarFilaProducto(this.currencyFormatter));
        html += "</tbody></table>";
        divProductos.innerHTML = html;
    }
}

class ItemCarrito {
    constructor(producto, cantidad = 1) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.total = 0;
        this.calcularTotal();
    }
    setCandidad(cantidad) {
        this.cantidad = cantidad;
        this.calcularTotal();
    }
    incrementarCandidad(incremento = 1) {
        this.cantidad += incremento;
        this.calcularTotal();
    }
    calcularTotal() {
        this.total = this.producto.precio * this.cantidad;
    }
    pintarFilaItem(currencyFormatter) {
        var id = this.producto.id;
        var precio = currencyFormatter.format(this.producto.precio);
        var total = currencyFormatter.format(this.total);
        return `<tr>
                <td class="posicion"><img class="imagen" src="${this.producto.urlImagen}"/></td>
                <td>${this.producto.nombre}</td><td class="numero">${precio}</td>
                <td class="entrada"><input type="number" id="item-carrito-cantidad-${id}" name="cantidad" value="${this.cantidad}" class="numero" onchange="manager.actualizarCantidadCarrito(${id}, this)" min="0" max="100" size="4" required /></td>
                <td id="item-carrito-total-${id}" class="numero">${total}</td>
                <td class="acciones">
                    <button class="del-button" id="del-carrito-button-${id}" onclick="manager.borrarDelCarrito(${id})">Borrar</button>
                </td>
            </tr>`;
    }
    actualizarFilaItemPintado(currencyFormatter) {
        document.getElementById("item-carrito-cantidad-" + this.producto.id).value = this.cantidad;
        document.getElementById("item-carrito-total-" + this.producto.id).innerHTML = currencyFormatter.format(this.total);

    }
}

class Carrito {
    constructor(currencyFormatter) {
        this.items = new Map();
        this.currencyFormatter = currencyFormatter;
    }
    addItem(item) {
        this.items.set(item.producto.id, item);
    }
    findItemById(id) {
        return this.items.get(id);
    }
    removeItemById(id) {
        return this.items.delete(id);
    }
    removeProducto(producto) {
        return this.removeItemById(producto.id);
    }
    addProducto(producto, cantidad) {
        let item = this.findItemById(producto.id);
        if (item) {
            item.incrementarCandidad(cantidad);
        } else {
            this.addItem(new ItemCarrito(producto, cantidad));
        }
    }
    updateProductoById(id, cantidad) {
        if (cantidad >= 0) {
            let item = this.findItemById(id);
            if (item) {
                item.setCandidad(cantidad);
            }
        }
    }
    updateProducto(producto, cantidad) {
        this.updateProductoById(producto.id, cantidad);
    }
    pintarCarrito(divItems) {
        let html = "<table>";
        var total = 0;
        html += '<thead><tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Total</th><th>Acciones</th></tr></thead>';
        html += '<tbody>';
        this.items.forEach(item => {
            html += item.pintarFilaItem(this.currencyFormatter);
            total += item.total;
        });
        total = this.currencyFormatter.format(total);
        html += '<tr><td></td><td></td><td></td><td></td><td class="numero" id="total-carrito">' + total + '</td><td></td></tr>';
        html += "</tbody></table>";
        divItems.innerHTML = html;
    }
    actualizarCarritoPintado() {
        var total = 0;
        this.items.forEach(item => {
            item.actualizarFilaItemPintado(this.currencyFormatter);
            total += item.total;
        });
        document.getElementById("total-carrito").innerHTML = this.currencyFormatter.format(total);
    }
}

/* ********** Funciones para Controles ********** */

window.onload = function() {

    let currencyFormatter = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

    let tienda = new Tienda(null, "La tiendita de Esteban", "Calzada General Mariano Escobedo 303", "https://www.latienditadeesteban.com/", currencyFormatter);

    let carrito = new Carrito(currencyFormatter);

    let form = document.getElementById("form-add-producto");
    let inputNombre = document.getElementById("nombre");
    let inputUrlImagen = document.getElementById("url-imagen");
    let inputPrecio = document.getElementById("precio");
    let inputDescripcion = document.getElementById("descripcion");
    let addButton = document.getElementById("add-button");
    let divMensajes = document.getElementById("mensajes");
    let divProductos = document.getElementById("productos");
    let divCarrito = document.getElementById("carrito");

    let mostrarMensajes = function(mensajes) {
        divMensajes.innerHTML = mensajes.join("<br>");
        divMensajes.style = "display: block;";
    };

    let ocultarMensajes = function() {
        divMensajes.style = "";
    };

    addButton.onclick = function() {
        ocultarMensajes();
        let mensajes = [];

        let id = null; //lo dejanos en null para que lo calcule aleatoriamente
        let nombre = inputNombre.value.trim();
        let urlImagen = inputUrlImagen.value.trim();
        let precio = parseInt(inputPrecio.value.trim(), 10);
        let descripcion = inputDescripcion.value.trim();

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
            let producto = new Producto(id, nombre, precio, descripcion, urlImagen);
            tienda.addProducto(producto);
            tienda.pintarTienda(divProductos);

            form.className = "";
            inputNombre.value = "";
            inputUrlImagen.value = "";
            inputPrecio.value = "";
            inputDescripcion.value = "";
        }
    };

    window.manager = {
        borrarProducto: function(id) {
            tienda.removeProductoById(id);
            tienda.pintarTienda(divProductos);
        },

        agregarAlCarrito: function(id) {
            var producto = tienda.findProductoById(id);
            carrito.addProducto(producto);
            carrito.pintarCarrito(divCarrito);
        },

        actualizarCantidadCarrito: function(id, inputCantidad) {
            let cantidad = parseInt(inputCantidad.value.trim(), 10);
            if (!Number.isNaN(cantidad)) {
                if (cantidad > 0) {
                    carrito.updateProductoById(id, cantidad);
                    carrito.actualizarCarritoPintado();
                } else {
                    manager.borrarDelCarrito(id);
                }
            } else {
                inputCantidad.value = carrito.findItemById(id).cantidad;
            }
        },

        borrarDelCarrito: function(id) {
            carrito.removeItemById(id);
            carrito.pintarCarrito(divCarrito);
        }
    }

    /* Datos de pruebas */
    tienda.addProducto(new Producto(null, "Camisa Azul", 1200, "Una linda camisa de color azul", "http://chevignon.vteximg.com.br/arquivos/ids/251250-366-451/63_6126000_020010_0.jpg"));
    tienda.addProducto(new Producto(null, "Vaquero", 2300, "El cásico pantalon de mezclilla azul", "http://media.mayoral.com/wcsstore/mayoral/images/catalog/mayoral/27-00056-011-390-1.JPG"));
    /* Fin datos de prueba */

    document.getElementById("nombre-tienda").innerHTML = tienda.nombre;
    document.getElementById("direccion-tienda").innerHTML = tienda.direccion;

    tienda.pintarTienda(divProductos);

};