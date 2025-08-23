import { locaL } from "../../src/scripts/LocalStorage"
import { Api } from "../../src/scripts/methodsApi"
export let renderDashboardAdminEditUsers = (ul, main) => {

    // nav.innerHTML = `
    // <img src="./img/skybolt.webp" alt="Skybolt Logo">
    // `
    ul.innerHTML = `
        <a href="/skybolt/dashboardadmin/fields" data-link>Fields</a>
        <a href="/skybolt/dashboardadmin/owners" data-link>Owners</a>
        <a href="/skybolt/login" id="log-out-user" data-link>Log out</a>
    `
    main.innerHTML = `
    <h2>Hola Admin Edit user ${locaL.get('active_user').full_name}</h2>

    <section id="user-section"></section>
    `
    document.getElementById('log-out-user').addEventListener('click', (e) => {
        e.preventDefault();
        locaL.delete('active_user');
    })

    Api.get('/api/users')
    .then(data => {
        data.forEach(user => {
            let $article = document.createElement('article');
            $article.classList.add('user-card')
            $article.innerHTML = `
            <h2>Full name: ${user.full_name} id: ${user.id_user}</h2>
            <p>Email: ${user.email}</p>
            <p>phone: ${user.phone}</p>
            <p>Birthday: ${user.birthdate}</p>
            <p>${user.document_type} ${user.id_document}</p>
            <p>${user.id_department} ${user.id_municipality}</p>
            <p>Rol: ${user.rol}</p>
            <button class="btn-delete" data-id="${user.id_user}">DELETE</button>
            `
            document.getElementById('user-section').appendChild($article)        
        });
        document.getElementById('user-section').addEventListener('click',(e) => {
            e.preventDefault();
            if(e.target.classList.contains('btn-delete')){
                let userID = e.target.getAttribute('data-id')
                Api.delete(`/api/users/${userID}`)
                .then(()=> {
                    e.target.parentElement.remove();
                    alert('User deleted sucessfully');
                })
                .catch(error => alert(error.message))
            }
        })

    })
    .catch(error => {
        alert(error.message)
    })



}