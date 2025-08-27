import { locaL } from "../../src/scripts/LocalStorage"

export let renderDashboardAdminFields = (ul, main) => {

    // nav.innerHTML = `
    // <img src="./img/skybolt.webp" alt="Skybolt Logo">
    // `
    ul.innerHTML = `
    <a href="/skybolt/dashboardadmin/users" data-link class="text-green-600 hover:text-green-800 font-semibold">Users</a>
    <a href="/skybolt/dashboardadmin/owners" data-link class="text-green-600 hover:text-green-800 font-semibold">Owners</a>
    <a href="/skybolt/dashboardadmin/request" data-link class="text-green-600 hover:text-green-800 font-semibold">Requests</a>
    <a href="/skybolt/login" id="log-out-user" data-link class="text-red-500 hover:text-red-700 font-semibold">Log out</a>
    `

    main.innerHTML = `
    <h2>Hola Admin ${locaL.get('active_user').full_name}</h2>
    `

    document.getElementById('log-out-user').addEventListener('click', (e) => {
        e.preventDefault();
        locaL.delete('active_user');
    })
}
