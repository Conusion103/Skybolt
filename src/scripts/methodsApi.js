// API methods for CRUD operations
export let Api = {
    // Base URL for the API in production and development
    base: 'https://skybolt-production.up.railway.app',
    // base: 'http://localhost:3000',

    // Function to handle repeated logic
    request: (method, param, pack = null) => {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: pack ? JSON.stringify(pack) : null
        };

        return fetch(`${Api.base}${param}`, options)
            .then(res => {
                if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
                return res.json(); 
            })
            .catch(error => {
                console.error(error.message);
                throw error;
            });
    },

    // Methods for HTTP requests
    get: (param) => {
        return Api.request('GET', param);  // Call request with GET method
    },

    post: (param, pack) => {
        return Api.request('POST', param, pack);  // Call request with POST method
    },

    put: (param, pack) => {
        return Api.request('PUT', param, pack);  // Call request with PUT method
    },

    delete: (param) => {
        return Api.request('DELETE', param);  // Call request with DELETE method
    }
};

