import { locaL } from "../../src/scripts/LocalStorage";
import { renderDashboardUser } from "./dashboardUser"; // función que renderiza el dashboard principal

export let renderDashboardUserProfile = (ul, main) => {
    const activeUser = locaL.get('active_user');

    // Render del menú y saludo
    ul.innerHTML = `
        <a href="/skybolt/dashboarduser" data-link id="back-dashboard" >Back</a>
        <a href="/skybolt/home" data-link id="log-out-user" >Log out</a>
    `;
    main.innerHTML = `<h2>Hola ${activeUser.full_name}</h2>`;

    // Logout dinámico
    main.querySelector('#log-out-user').addEventListener('click', (e) => {
        e.preventDefault();
        locaL.delete('active_user');
        renderDashboardUser(ul, main); // al cerrar sesión, renderizamos el dashboard general
    });

    // Back dinámico
    main.querySelector('#back-dashboard').addEventListener('click', (e) => {
        e.preventDefault();
        renderDashboardUser(ul, main); // vuelve al dashboard principal sin recargar
    });
};
