export let Api = {
    base: 'https://skybolt-production.up.railway.app',

    // Función para manejar la lógica repetida
    request: (method, param, pack = null) => {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: pack ? JSON.stringify(pack) : null  // Solo agrega body si pack no es null
        };

        return fetch(`${Api.base}${param}`, options)
            .then(res => {
                if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
                return res.json();  // Retorna el cuerpo de la respuesta parseado como JSON
            })
            .catch(error => {
                console.error(error.message);
                throw error;
            });
    },

    // Métodos HTTP usando la función request común
    get: (param) => {
        return Api.request('GET', param);  // Llama a request con el método GET
    },

    post: (param, pack) => {
        return Api.request('POST', param, pack);  // Llama a request con el método POST
    },

    put: (param, pack) => {
        return Api.request('PUT', param, pack);  // Llama a request con el método PUT
    },

    delete: (param) => {
        return Api.request('DELETE', param);  // Llama a request con el método DELETE
    }
};
