import { renderRoute } from "../../routers/router";

// Event listener para los clics en los enlaces
window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        const isLink = e.target.matches('[data-link]');
        if (isLink) {
            e.preventDefault();  // Prevenir la acción por defecto (recarga de página)
            
            const targetUrl = e.target.href; // Obtener la URL de destino
            history.pushState(null, null, targetUrl);  // Cambiar la URL sin recargar la página

            renderRoute();  // Llamar a renderRoute() para actualizar el contenido según la nueva URL
        }
    });
});

// Event listener para cuando cambie el historial de navegación
window.addEventListener('popstate', renderRoute);

// Event listener para cuando la página se carga inicialmente
window.addEventListener('load', renderRoute);
