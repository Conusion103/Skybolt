// Importación de las vistas que serán renderizadas en función de la ruta
import { renderHome } from "../views/home";
import { renderRegister } from "../views/register";
import { renderLogin } from "../views/login";

// Se seleccionan los elementos HTML donde se van a renderizar las vistas
let $nav = document.getElementById('nav'); // Barra de navegación
let $main = document.getElementById('main'); // Área principal de contenido

// Definición de las rutas y las vistas correspondientes
let routes = {
    '/skybolt/home': () => renderHome($nav, $main),        // Ruta para la vista Home
    '/skybolt/login': () => renderLogin($nav, $main),      // Ruta para la vista Login
    '/skybolt/register': () => renderRegister($nav, $main),// Ruta para la vista Register
    '/skybolt/dashboarduser': () => renderDashboardUser($nav, $main),  // Ruta para el Dashboard del usuario
    '/skybolt/dashboardowner': () => renderDashboardOwner($nav, $main) // Ruta para el Dashboard del propietario
};

// Función para renderizar la ruta actual
export let renderRoute = () => {
    let path = window.location.pathname; // Obtiene el path de la URL actual

    // Si el path es raíz ('/') o está vacío, se redirige a '/skybolt/home'
    if (path === '/' || !path) {
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
}
