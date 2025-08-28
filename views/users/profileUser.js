import { locaL } from "../../src/scripts/LocalStorage";
//import { renderDashboardUser } from "./dashboardUser"; // función que renderiza el dashboard principal
import { Api } from "../../src/scripts/methodsApi";


export let renderDashboardUserProfile = (ul, main) => {
  const activeUser = locaL.get('active_user');
  if (!activeUser) {
    history.pushState(null, null, "/skybolt/login");
    return;
  }
  // Render del menú y saludo
  ul.innerHTML = `
        <a href="/skybolt/dashboarduser" data-link id="back-dashboard">Fields</a>
        <a href="/skybolt/dashboarduser/profile/request" data-link>Be owner</a>
        <a data-link><button>Payments</button></a>
        <a data-link><button>Contacts</button></a>
        <a href="/skybolt/login" data-link id="log-out-user">Log out</a>
    `;

  main.innerHTML = `
    <section class="p-6 max-w-md mx-auto">
      <h1 class="text-2xl font-semibold mb-6">Profile</h1>
      
      <div class="flex flex-col items-center text-center">
        <img src="avatar-default.png" alt="Avatar" class="w-24 h-24 rounded-full mb-3 shadow-md"/>
        <h2 class="text-lg font-bold">${activeUser.full_name}</h2>
        <p class="text-gray-600 text-sm">${activeUser.email || "No email"}</p>
        <p class="text-gray-600 text-sm">CR: ${activeUser.id_user}</p>
        <p class="text-gray-500 text-sm">User: ${activeUser.roles[0].name_role}</p>
      </div>
      <div class="flex justify-around mt-6">

      
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 flex items-center justify-center border rounded-full mb-1"></div>
          <span id="countReservas" class="font-semibold">00</span>
          <span class="text-gray-500 text-xs">reservations</span>
        </div>

        <div class="flex flex-col items-center">
          <div class="w-12 h-12 flex items-center justify-center border rounded-full mb-1"></div>
          <span id="countReviews" class="font-semibold">00</span>
          <span class="text-gray-500 text-xs">reviews</span>
        </div>
      </div>

      <div class="w-full bg-green-400 rounded-2xl shadow-md mt-6 divide-y divide-green-300">
        <button class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium">
          Send Notifications <span>›</span>
        </button>
        <button class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium">
          Payments <span>›</span>
        </button>
        <button class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium">
          Contact us <span>›</span>
        </button>
        <button id="delete-account" class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium text-red-600">
          Delete Account <span>›</span>
        </button>
      </div>
    </section>
  `;

      // Contador de reservas
  Api.get(`/users/${activeUser.id_user}/reservas`)
    .then((reservas) => {
      const count = Array.isArray(reservas) ? reservas.length : reservas?.data?.length || 0;
      document.getElementById("countReservas").textContent = count.toString().padStart(2, "0");
    })
    .catch((err) => {
      console.error("Error cargando reservas:", err);
      document.getElementById("countReservas").textContent = "00";
    });

  // Contador de reseñas
      Api.get(`/users/${activeUser.id_user}/reviews`)
    .then((reviews) => {
      const count = Array.isArray(reviews) ? reviews.length : reviews?.data?.length || 0;
      document.getElementById("countReviews").textContent = count.toString().padStart(2, "0");
    })
    .catch((err) => {
      console.error("Error cargando reseñas:", err);
      document.getElementById("countReviews").textContent = "00";
    });

// Delete account
  document.getElementById("delete-account").addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await Api.delete(`/users/${activeUser.id_user}`);
      alert("Your account has been deleted successfully.");
      locaL.delete("active_user");
      location.href = "/skybolt/login";
    } catch (err) {
      console.error(err);
      alert("Error deleting account, please try again.");
    }
  });

  // Logout dinámico
  document.getElementById('log-out-user').addEventListener('click', (e) => {
    e.preventDefault();
    locaL.delete('active_user');
  });

  // Back dinámico
  main.querySelector('#back-dashboard').addEventListener('click', (e) => {
    e.preventDefault();
  });
};