// Importación de las vistas que serán renderizadas en función de la ruta
import { renderHome } from "../views/home";
import { renderRegister } from "../views/register";
import { renderLogin } from "../views/login";
import { renderDashboardUser } from "../views/users/dashboardUser";
import { renderDashboardAdminFields } from "../views/admin/dashboardAdmin";
import { renderDashboardAdminEditUsers } from "../views/admin/adminEditUsers";
import { renderDashboardUserProfile } from "../views/users/profileUser";
import { renderDashboardAdminEditOwners } from "../views/admin/adminEditOwner";
import { renderResgiterRequestOwner } from "../views/users/requestOwner";
import { renderDashboardOwnerProfile } from "../views/owner/profileOwner";
import { renderDashboardAdminRequest } from "../views/admin/requestOwner";
import { renderDashboardOwner } from "../views/owner/dashboardOwner";
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
    '/skybolt/dashboarduser/profile/request': () => renderResgiterRequestOwner($nav, $main),
    '/skybolt/dashboardowner': () => renderDashboardOwner($nav, $main), // Ruta para el Dashboard del propietario
    '/skybolt/dashboardowner/profile': () => renderDashboardOwnerProfile($nav, $main),
    '/skybolt/dashboardowner/edit': () => renderDashboardOwnerEdit($nav, $main),
    '/skybolt/dashboardadmin/fields': () => renderDashboardAdminFields($nav, $main),
    '/skybolt/dashboardadmin/users': () => renderDashboardAdminEditUsers($nav, $main),
    '/skybolt/dashboardadmin/owners': () => renderDashboardAdminEditOwners($nav, $main),
    '/skybolt/dashboardadmin/request': () => renderDashboardAdminRequest($nav, $main),
};

// Función para renderizar la ruta actual
export let renderRoute = () => {
    let path = window.location.pathname; // Obtiene el path de la URL actual
    let user = locaL.get('active_user')
    console.log(user)
    if(user){
        switch (user.roles[0].name_role) {
            case 'user':
                path = window.location.pathname;
                if (!['/skybolt/dashboarduser',
                    '/skybolt/dashboarduser/profile',
                    '/skybolt/dashboarduser/profile/request']
                    .includes(path)) {
                    history.pushState(null, null, '/skybolt/dashboarduser');
                } else {
                    history.pushState(null, null, path);
                }
                break;
        
            case 'owner':
                path = window.location.pathname;
                if (!['/skybolt/dashboardowner', '/skybolt/dashboardowner/edit', '/skybolt/dashboardowner/profile'].includes(path)) {
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
                    '/skybolt/dashboardadmin/owners',
                    '/skybolt/dashboardadmin/request'

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
        document.body.style.background = "white";
        // Si la ruta no es válida, muestra un mensaje de error
        $nav.innerHTML = `
        <header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <h1 class="text-3xl font-bold text-gray-800">
                        <a href="/skybolt/home#top" class="hover:text-sky-600 transition-colors duration-200" data-link>SkyBolt</a>
                    </h1>
                    <nav class="hidden md:flex space-x-6">
                        <a href="/skybolt/home" data-link class="btn-primary" data-link>Home</a>
                        <a href="/skybolt/login" data-link class="btn-primary" data-link>Log in</a>
                        <a href="/skybolt/register" data-link class="btn-primary" data-link>Sign up</a>

                    </nav>
                    <button id="menu-btn" class="md:hidden flex flex-col space-y-1">
                        <span class="w-6 h-0.5 bg-gray-800"></span>
                        <span class="w-6 h-0.5 bg-gray-800"></span>
                        <span class="w-6 h-0.5 bg-gray-800"></span>
                    </button>
                </div>
            </div>
            <div id="mobile-menu" class="hidden md:hidden w-full bg-white px-6 pb-6 flex flex-col items-center space-y-4 text-center">
                <a href="/skybolt/home" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Home</a>
                <a href="/skybolt/login" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Log in</a>
                <a href="/skybolt/register" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Sign up</a>
            </div>
        </header>
        <div id="top" class="h-16"></div>
        `;
        $main.innerHTML = `
        <section class="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 class="text-6xl font-bold text-red-500 mb-4">404</h2>
            <p class="text-2xl text-gray-700 mb-6">Página no encontrada</p>
            <a href="/skybolt/home#top" data-link class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Volver al inicio</a>
        </section>
        `;
          document.getElementById("menu-btn").addEventListener("click", () => {
            const menu = document.getElementById("mobile-menu");
            menu.classList.toggle("hidden");
        });
    }

    // Si la url tiene #faq o #map, hace scroll suave hasta ese elemento
    if (window.location.hash === "#faq") {
        document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
    }
    if (window.location.hash === "#map") {
        document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
    }

}
