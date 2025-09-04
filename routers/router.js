// Importing views that will be rendered based on the route
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
import { Api } from "../src/scripts/methodsApi";

// Selecting DOM elements where views will be rendered
let $header = document.getElementById('header');
let $nav = document.getElementById('nav');     // Navigation bar
let $main = document.getElementById('main');   // Main content area

// Defining all application routes and their corresponding render functions
let routes = {
    '/skybolt/home': () => renderHome($nav, $main),
    '/skybolt/login': () => renderLogin($nav, $main),
    '/skybolt/register': () => renderRegister($nav, $main),
    '/skybolt/dashboarduser': () => renderDashboardUser($nav, $main),
    '/skybolt/dashboarduser/profile': () => renderDashboardUserProfile($nav, $main),
    '/skybolt/dashboarduser/profile/request': () => renderResgiterRequestOwner($nav, $main),
    '/skybolt/dashboardowner': () => renderDashboardOwner($nav, $main),
    '/skybolt/dashboardowner/profile': () => renderDashboardOwnerProfile($nav, $main),
    '/skybolt/dashboardowner/edit': () => renderDashboardOwnerEdit($nav, $main),
    '/skybolt/dashboardadmin/fields': () => renderDashboardAdminFields($nav, $main),
    '/skybolt/dashboardadmin/users': () => renderDashboardAdminEditUsers($nav, $main),
    '/skybolt/dashboardadmin/owners': () => renderDashboardAdminEditOwners($nav, $main),
    '/skybolt/dashboardadmin/request': () => renderDashboardAdminRequest($nav, $main),
};

// Array of routes that require authentication
export let private_routes = [
    '/skybolt/dashboarduser',
    '/skybolt/dashboarduser/profile',
    '/skybolt/dashboarduser/profile/request',
    '/skybolt/dashboardowner',
    '/skybolt/dashboardowner/edit',
    '/skybolt/dashboardowner/profile',
    '/skybolt/dashboardadmin/fields',
    '/skybolt/dashboardadmin/users',
    '/skybolt/dashboardadmin/owners',
    '/skybolt/dashboardadmin/request'
];

// Main function to render the current route
export let renderRoute = () => {
    let path = window.location.pathname;
    let user = locaL.get('active_user'); // Get the logged-in user from localStorage

    // Redirect to home if path is root or empty
    if (path === '/' || !path) {
        history.pushState(null, null, '/skybolt/home');
        path = '/skybolt/home';
    }

    // If a user is logged in, validate with backend
    if (user) {
        Api.get('/api/users')
            .then(data => {
                const user_found = data.find(d => d.email === user.email); // Check if user exists in DB
                const user_verification = user_found && JSON.stringify(user_found) === JSON.stringify(user);

                // If user verification fails, logout and redirect to login
                if (!user_verification) {
                    locaL.delete('active_user');
                    history.pushState(null, null, '/skybolt/login');
                    window.dispatchEvent(new PopStateEvent("popstate"));
                    return;
                }

                // User is verified, get their role
                const role = user.roles[0]?.name_role;

                // Define allowed paths per role
                const allowedPaths = {
                    user: [
                        '/skybolt/dashboarduser',
                        '/skybolt/dashboarduser/profile',
                        '/skybolt/dashboarduser/profile/request'
                    ],
                    owner: [
                        '/skybolt/dashboardowner',
                        '/skybolt/dashboardowner/edit',
                        '/skybolt/dashboardowner/profile'
                    ],
                    admin: [
                        '/skybolt/dashboardadmin/fields',
                        '/skybolt/dashboardadmin/users',
                        '/skybolt/dashboardadmin/owners',
                        '/skybolt/dashboardadmin/request'
                    ]
                };

                // Define default paths per role
                const defaultPath = {
                    user: '/skybolt/dashboarduser',
                    owner: '/skybolt/dashboardowner',
                    admin: '/skybolt/dashboardadmin/fields'
                };

                // Redirect to default path if current path is not allowed for the role
                if (!allowedPaths[role]?.includes(path)) {
                    history.pushState(null, null, defaultPath[role]);
                    path = defaultPath[role];
                }

                // Finally render the view
                renderView(path);
            })
            .catch(error => {
                // In case of error during validation, logout and redirect
                console.error("Error verifying user:", error);
                locaL.delete('active_user');
                history.pushState(null, null, '/skybolt/login');
                window.dispatchEvent(new PopStateEvent("popstate"));
            });

    } else {
        // If user is not logged in and the route is private, redirect to login
        if (private_routes.includes(path)) {
            renderNotFound();
            return;
        }

        // Otherwise, render the public view
        renderView(path);
    }
};

// Helper function to render a route's view
function renderView(path) {
    if (routes[path]) {
        routes[path]();
    } else {
        renderNotFound();
    }

    // Smooth scroll to anchor if present
    if (window.location.hash === "#faq") {
        document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
    }
    if (window.location.hash === "#map") {
        document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
    }
}

// Renders a 404 Not Found page when path doesn't match any route
function renderNotFound() {
    document.body.style.background = "white";
    $nav.innerHTML = `
        <header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <h1 class="text-3xl font-bold text-gray-800">
                        <a href="/skybolt/home#top" class="hover:text-sky-600 transition-colors duration-200" data-link>SkyBolt</a>
                    </h1>
                    <nav class="hidden md:flex space-x-6">
                        <a href="/skybolt/home" data-link class="btn-primary">Home</a>
                        <a href="/skybolt/login" data-link class="btn-primary">Log in</a>
                        <a href="/skybolt/register" data-link class="btn-primary">Sign up</a>
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
            <p class="text-2xl text-gray-700 mb-6">Page Not Found</p>
            <a href="/skybolt/home#top" data-link class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Go back home</a>
        </section>
    `;

    // Toggle mobile menu on button click
    document.getElementById("menu-btn")?.addEventListener("click", () => {
        const menu = document.getElementById("mobile-menu");
        menu.classList.toggle("hidden");
    });
}















