/* ***** APIS GENERICAS ***** */

class APIClientError extends Error {
    constructor(data) {
        if (!data) {
            data = {
                message: "Error desconocido"
            }
        }
        super(data.errmsg || data.message || data);
        this.name = data.name || "APIClientError";
    }
}

class APIClient {

    _send(
        url, {
            method = "GET",
            headers = new Headers(),
            data = null,
            requestType = "json",
            reponseType = "json"
        } = {}
    ) {
        console.log(`${method} ${url} ––> ${reponseType}`);

        let init = {
            method: method,
            headers: headers,
            mode: 'cors'
        };

        if (data) {
            if (requestType == "json") {
                headers.append('Content-Type', 'application/json');
                let jsonData = JSON.stringify(data);
                init.body = jsonData;
            } else {
                let formData = new FormData();
                for (let key in data) {
                    console.log(key + ": " + data[key]);
                    formData.append(key, data[key]);
                }
                init.body = formData;
            }
        }

        return fetch(url, init)
            .then(response => {
                console.log(response.status + " " + response.statusText);
                let responsePromise = null;
                switch (reponseType) {
                    case "json":
                        responsePromise = response.json();
                        break;
                    case "text":
                        responsePromise = response.text();
                        break;
                    default:
                        responsePromise = response.text();
                }
                return new Promise((resolve, reject) => {
                    responsePromise.then(data => {
                        if (response.ok) {
                            resolve(data);
                        } else {
                            reject(data);
                        }
                    });
                });
            })
            .catch(error => {
                console.log(error);
                throw new APIClientError(error);
            })
    }

    get(url, reponseType) {
        return this._send(url, {
            reponseType: reponseType
        });
    }

    post(url, data, requestType, reponseType) {
        return this._send(url, {
            method: "POST",
            data: data,
            requestType: requestType,
            reponseType: reponseType
        });
    }

    delete(url, data, reponseType) {
        return this._send(url, {
            method: 'DELETE',
            data: data,
            reponseType: "text",
            reponseType: reponseType
        });
    }

    put(url, data, requestType, reponseType) {
        return this._send(url, {
            method: "PUT",
            data: data,
            requestType: requestType,
            reponseType: reponseType
        });
    }
}

class StorageListAPI {

    constructor(itemName, storage = localStorage) {
        this._storage = storage;
        this.itemName = itemName;
    }

    _save(lista) {
        return new Promise((resolve, reject) => {
            let listaString = JSON.stringify(lista);
            this._storage.setItem(this.itemName, listaString);
            resolve();
        });
    }

    clear() {
        return new Promise((resolve, reject) => {
            let listaString = this._storage.removeItem(this.itemName);
            resolve();
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {
            let listaString = this._storage.getItem(this.itemName);
            let lista = listaString !== null ? JSON.parse(listaString) : [];
            if (id) {
                resolve(lista.find(registro => registro._id == id));
            } else {
                resolve(lista);
            }
        });
    }

    post(data) {
        return this.get().then(
            lista => {
                data._id = lista.reduce((max, registro) => Math.max(max, registro._id), 0) + 1;
                lista.push(data);
                return this._save(lista).then(() => data);
            });
    }

    delete(id) {
        return this.get().then(
            lista => {
                let index = lista.findIndex(registro => registro._id == id);
                let borrado = null;
                let promise = null;
                if (index !== -1) {
                    [borrado] = lista.splice(index, 1);
                    promise = this._save(lista);
                } else {
                    let error = new Error("Registro no encontrado");
                    console.error(error);
                    promise = new Promise((resolve, reject) => reject(error));
                }
                return promise.then(() => borrado);
            });
    }

    put(data) {
        return this.get().then(
            lista => {
                let index = lista.findIndex(registro => registro._id == data._id);
                let actualizado = null;
                let promise = null;
                if (index !== -1) {
                    lista[index] = data;
                    actualizado = data;
                    promise = this._save(lista);
                } else {
                    let error = new Error("Registro no encontrado");
                    console.error(error);
                    promise = new Promise((resolve, reject) => reject(error));
                }
                return promise.then(() => actualizado);
            });
    }
}

class SessionAPI {

    static getUser() {
        let json = sessionStorage.getItem("user");
        let data = JSON.parse(json);
        return data !== null ? new User(
            data._id,
            data.username,
            data.nombre,
            data.rol
        ) : null;
    }

    static setUser(user) {
        let data = {
            _id: user._id,
            username: user.username,
            nombre: user.nombre,
            rol: user.rol
        };
        let json = JSON.stringify(data);
        sessionStorage.setItem("user", json);
    }

    static getItem(key, defaultValue) {
        let value = sessionStorage.getItem(key);
        return value !== null ? value : defaultValue;
    }

    static setItem(key, value) {
        if (key == "user") {
            throw new Error("Para modificar usuario de la sesión debe usar setUser");
        }
        sessionStorage.setItem(key, value);
    }

    static removeItem(key) {
        if (key == "user") {
            throw new Error("No está permitido eliminar el usuario de la sesión");
        }
        sessionStorage.removeItem(key);
    }

    static clear() {
        sessionStorage.clear();
    }
}