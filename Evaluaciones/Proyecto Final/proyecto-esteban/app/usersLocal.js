/* ***** CLASES DE DATOS ***** */

// Clase ya declarada en users.js
// class User {
//     constructor(_id, username, password, nombre, apellidos, email, __v) {
//         this._id = _id;
//         this.username = username;
//         this.password = password;
//         this.nombre = nombre;
//         this.apellidos = apellidos;
//         this.email = email;
//         this.__v = __v;
//     }
// }


/* ***** CLIENTES ***** */

class UserLocalClient {
    constructor() {
        this._storage = new StorageListAPI("users");
    }

    _userFromData(data) {
        return data != null ? new User(
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
        return {
            _id: user._id,
            username: user.username,
            password: user.password,
            nombre: user.nombre,
            apellidos: user.apellidos,
            email: user.email,
            __v: user.__v
        };
    }

    find(id) {
        return this._storage.get(id)
            .then(data => {
                return this._userFromData(data);
            })
            .catch(error => {
                error = new Error("Error al buscar usuario: " + error.message);
                console.error(error);
                throw error;
            });
    }

    get() {
        return this._storage.get()
            .then(lista => {
                return lista.map(data => this._userFromData(data));
            })
            .catch(error => {
                error = new Error("Error al listar usuarios: " + error.message);
                console.error(error);
                throw error;
            });
    }

    post(user) {
        return this._storage.post(this._dataFromUser(user))
            .then(data => {
                return this._userFromData(data);
            })
            .catch(error => {
                error = new Error("Error al crear usuario: " + error.message);
                console.error(error);
                throw error;
            });
    }

    delete(user) {
        return this._storage.delete(user instanceof User ? user._id : user)
            .then(data => {
                return this._userFromData(data);
            })
            .catch(error => {
                error = new Error("Error al eliminar usuario: " + error.message);
                console.error(error);
                throw error;
            });
    }

    put(user) {
        return this._storage.put(this._dataFromUser(user))
            .then(data => {
                return this._userFromData(data);
            })
            .catch(error => {
                error = new Error("Error al actualizar usuario: " + error.message);
                console.error(error);
                throw error;
            });
    }
}

class LoginLocalClient extends UserLocalClient {
    constructor() {
        super();
    }

    login(username, password) {
        return this.get()
            .then(lista => {
                let result = null;
                let authUser = lista.find(user => user.username == username && user.password == password);
                if (authUser) {
                    result = authUser;
                }
                return result;
            });

    }
}