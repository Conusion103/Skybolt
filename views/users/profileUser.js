import { locaL } from "../../src/scripts/LocalStorage";
import { renderDashboardUser } from "./dashboardUser"; // función que renderiza el dashboard principal
import { Api } from "../../src/scripts/methodsApi";


export let renderDashboardUserProfile = (ul, main) => {
    const activeUser = locaL.get('active_user');
    if (!activeUser) {
        history.pushState(null, null, "/skybolt/login");
        return;
    }
    // Render del menú y saludo
    ul.innerHTML = `
        <a href="/skybolt/dashboarduser" data-link id="back-dashboard" >Fields</a>
        <a href="/skybolt/dashboarduser/profile/request" data-link>Be owner</a>
        <a data-link><button>Payments</button></a>
        <a data-link><button>Contacts</button></a>
        <a href="/skybolt/login" data-link id="log-out-user" >Log out</a>
    `;

    main.innerHTML = `
    <section class="profile-section">
      <div class="profile-header">
        <img src="avatar-default.png" alt="Avatar" class="profile-avatar"/>
        <h2>${activeUser.full_name}</h2>
        <p>${activeUser.email || "No email"}</p>
        <p>CR: ${activeUser.id_user}</p>
        <p>Rol: ${activeUser.roles[0].name_role}</p>
      </div>

      <div class="profile-stats">
        <div><strong id="countReservas">00</strong><span>reservations</span></div>
        <div><strong id="countReviews">00</strong><span>reviews</span></div>
      </div>
    </section>
  `;

    // Cargar reservas
    Api.get(`/api/users/${user.id_user}/reservas`)
        .then((reservas) => {
            document.getElementById("countReservas").textContent = reservas.length
                .toString()
                .padStart(2, "0");
        })
        .catch(console.error);

    // Para reviews no hay endpoint específico, solo muestra 00
    document.getElementById("countReviews").textContent = "00";

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        locaL.delete("active_user");
        history.pushState(null, null, "/skybolt/login");
    });

    // Logout dinámico
    document.getElementById('log-out-user').addEventListener('click', (e) => {
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