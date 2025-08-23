// Importación de las vistas que serán renderizadas en función de la ruta
import { renderHome } from "../views/home";
import { renderRegister } from "../views/register";
import { renderLogin } from "../views/login";
import { renderDashboardUser } from "../views/users/dashboardUser";
import { renderDashboardAdminFields } from "../views/admin/dashboardAdmin";
import { renderDashboardAdminEditUsers } from "../views/admin/adminEditUsers";
import { renderDashboardAdminEditOwners } from "../views/admin/adminEditOwner";
import { locaL } from "../src/scripts/LocalStorage";

// Se seleccionan los elementos HTML donde se van a renderizar las vistas
let $header = document.getElementById('header')
let $nav = document.getElementById('nav'); // Barra de navegación
let $main = document.getElementById('main'); // Área principal de contenido

// Definición de las rutas y las vistas correspondientes
let routes = {
    '/skybolt/home': () => renderHome($nav, $main),        // Ruta para la vista Home
    '/skybolt/login': () => renderLogin($nav, $main),      // Ruta para la vista Login
    '/skybolt/register': () => renderRegister($nav, $main),// Ruta para la vista Register
    '/skybolt/dashboarduser': () => renderDashboardUser($nav, $main), // Ruta para el Dashboard del usuario
    '/skybolt/dashboarduser/profile': () => renderDashboardUserProfile($nav, $main), 
    '/skybolt/dashboardowner': () => renderDashboardOwner($nav, $main), // Ruta para el Dashboard del propietario
    '/skybolt/dashboardowner/edit': () => renderDashboardOwnerEdit($nav, $main),
    '/skybolt/dashboardadmin/fields': () => renderDashboardAdminFields($nav, $main),
    '/skybolt/dashboardadmin/users': () => renderDashboardAdminEditUsers($nav, $main),
    '/skybolt/dashboardadmin/owners': () => renderDashboardAdminEditOwners($nav, $main)
};

// Función para renderizar la ruta actual
export let renderRoute = () => {
    let path = window.location.pathname; // Obtiene el path de la URL actual
    let user = locaL.get('active_user')
    console.log(user)
    if(user){
        switch (user.rol) {
            case 'user':
                path = window.location.pathname;
                if (!['/skybolt/dashboarduser'].includes(path)) {
                    history.pushState(null, null, '/skybolt/dashboarduser');
                } else {
                    history.pushState(null, null, path);
                }
                break;
        
            case 'owner':
                path = window.location.pathname;
                if (!['/skybolt/dashboardowner', '/skybolt/dashboardowner/edit'].includes(path)) {
                    history.pushState(null, null, '/skybolt/dashboardowner');
                } else {
                    history.pushState(null, null, path);
                }
                break;
        
            case 'admin':
                path = window.location.pathname;
                if (![
                    '/skybolt/dashboardadmin/fields',
                    '/skybolt/dashboardadmin/users',
                    '/skybolt/dashboardadmin/owners'
                ].includes(path)) {
                    history.pushState(null, null, '/skybolt/dashboardadmin/fields');
                } else {
                    history.pushState(null, null, path);
                }
                break;
        }
        

    }
    // Si el path es raíz ('/') o está vacío, se redirige a '/skybolt/home'
    else if (path === '/' || !path) {
        history.pushState(null, null, '/skybolt/home'); // Modifica la URL sin recargar la página
    }



    // Se obtiene nuevamente el path para asegurarse que se actualizó
    path = window.location.pathname;

    // Si la ruta existe en el objeto `routes`, se ejecuta la función correspondiente
    if (routes[path]) {
        routes[path](); // Llama a la función que renderiza la vista para esta ruta
    }
    else {
        // Si la ruta no es válida, muestra un mensaje de error
        $nav.innerHTML = `
        <a href="/skybolt/home" data-link>Home</a>
        <a href="/skybolt/login" data-link>Log in</a>
        <a href="/skybolt/register" data-link>Sign up</a>
        `;
        $main.innerHTML = `
        <h1>HTTP NOT FOUND</h1> <!-- Error 404 -->
        `;
    }

    // Si la url tiene #faq o #map, hace scroll suave hasta ese elemento
    if (window.location.hash === "#faq") {
        document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
    }
    if (window.location.hash === "#map") {
        document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
    }

}
