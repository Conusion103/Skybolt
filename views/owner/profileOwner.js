import { locaL } from "../../src/scripts/LocalStorage";
import { renderDashboardOwner } from "./dashboardOwner"; // función que renderiza el dashboard principal
import { Api } from "../../src/scripts/methodsApi";
import { renderLogin } from "../login";


export let renderDashboardOwnerProfile = (ul, main) => {
    const activeUser = locaL.get('active_user');
    if (!activeUser) {
        history.pushState(null, null, "/skybolt/login");
        return;
    }
    // Render del menú y saludo
    ul.innerHTML = `
        <a href="/skybolt/dashboardowner" data-link id="back-dashboard" >Dashboard</a>
        <a href="/skybolt/home" data-link id="log-out-user" >Log out</a>
    `;

    main.innerHTML = `
    <section class="profile-section">
      <div class="profile-header">
        <img src="avatar-default.png" alt="Avatar" class="profile-avatar"/>
        <h2>${activeUser.full_name}</h2>
        <p>${activeUser.email || "No email"}</p>
        <p>CR: ${activeUser.id_user}</p>
        <p>User: ${activeUser.rol}</p>
      </div>

      <div class="profile-stats">
        <div><strong id="countReservas">00</strong><span>reservations</span></div>
        <div><strong id="countReviews">00</strong><span>reviews</span></div>
      </div>

      <ul class="profile-actions">
        <li><button>Send Notifications</button></li>
        <li><button>Payments</button></li>
        <li><button>Contacts</button></li>
        <li><button id="logoutBtn">Logout</button></li>
      </ul>
    </section>
  `;

    // Cargar reservas
    Api.get(`/api/users/${activeUser.id_user}/reservas`)
        .then((reservas) => {
            document.getElementById("countReservas").textContent = reservas.length
                .toString()
                .padStart(2, "0");
        })
        .catch(console.error);

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        locaL.delete("active_user");
        history.pushState(null, null, "/skybolt/login");
    });

    // Logout dinámico
    main.querySelector('#log-out-user').addEventListener('click', (e) => {
        e.preventDefault();
        locaL.delete('active_user');
        renderLogin(ul, main); // al cerrar sesión, renderizamos el dashboard general
    });

    // Back dinámico
    main.querySelector('#back-dashboard').addEventListener('click', (e) => {
        e.preventDefault();
        renderDashboardOwner(ul, main); // vuelve al dashboard principal sin recargar
    });
};
