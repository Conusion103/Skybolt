import { renderRoute } from "../../routers/router";

// Actions for navigation links
window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        const isLink = e.target.matches('[data-link]');
        if (isLink) {
            e.preventDefault();  // Prevent default reload behavior
            
            const targetUrl = e.target.href; // Obtain the target URL from the clicked link
            history.pushState(null, null, targetUrl);  // Change the URL without reloading the page

            renderRoute();  // Call renderRoute to update the view
        }
    });
});

// Event listener for when the navigation history changes
window.addEventListener('popstate', renderRoute);

// Event listener for when the page initially loads
window.addEventListener('load', renderRoute);
