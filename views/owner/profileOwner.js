import { locaL } from "../../src/scripts/LocalStorage";
import { Api } from "../../src/scripts/methodsApi";
import { renderDashboardOwner } from "./dashboardOwner";
import { showConfirm, showError, showSuccess } from "../../src/scripts/alerts";

export let renderDashboardOwnerProfile = (ul, main) => {
  const activeUser = locaL.get("active_user");
  if (!activeUser) {
    main.innerHTML = `<p>Por favor inicia sesión.</p> <a href="/skybolt/login" data-link class="btn-primary" data-link>Log in</a>`;
    return;
  }

  const image =
    (activeUser.image && activeUser.image.trim() !== "" && activeUser.image) ||
    (activeUser.image_path && activeUser.image_path.trim() !== "" && activeUser.image_path) ||
    "../../img/profiledefault.png";

  document.body.style.background = "white";

  ul.innerHTML = `
    <header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-3xl font-bold text-gray-800">
            <a href="/skybolt/home#top" class="hover:text-sky-600 transition-colors duration-200" data-link>SkyBolt</a>
          </h1>

          <nav class="hidden md:flex space-x-6">
            <a href="/skybolt/dashboardowner" data-link class="block sm:inline text-blue-600 hover:text-blue-800 font-semibold px-2">Dashboard</a>
            <a href="/skybolt/dashboardowner/profile" data-link class="block sm:inline text-blue-600 hover:text-blue-800 font-semibold px-2">Profile</a>
            <a href="/skybolt/login" id="log-out-user" data-link class="block sm:inline text-red-500 hover:text-red-700 font-semibold px-2">Log out</a>
          </nav>

          <button id="menu-btn" class="md:hidden flex flex-col space-y-1">
            <span class="w-6 h-0.5 bg-gray-800"></span>
            <span class="w-6 h-0.5 bg-gray-800"></span>
            <span class="w-6 h-0.5 bg-gray-800"></span>
          </button>
        </div>
      </div>

      <!-- MENÚ MÓVIL -->
      <div id="mobile-menu" class="hidden md:hidden w-full bg-white px-6 pb-6 flex flex-col items-center space-y-4 text-center">
        <a href="/skybolt/dashboardowner" data-link class="block sm:inline text-blue-600 hover:text-blue-800 font-semibold px-2">Dashboard</a>
        <a href="/skybolt/dashboardowner/profile" data-link class="block sm:inline text-blue-600 hover:text-blue-800 font-semibold px-2">Profile</a>
        <a href="/skybolt/login" id="log-out-user" data-link class="block sm:inline text-red-500 hover:text-red-700 font-semibold px-2">Log out</a>
      </div>
    </header>

    <!-- ESPACIO PARA QUE EL HEADER NO TAPE EL CONTENIDO -->
    <div id="top" class="h-16"></div>
  `;

  document.getElementById("menu-btn").addEventListener("click", () => {
    const menu = document.getElementById("mobile-menu");
    menu.classList.toggle("hidden");
  });

  main.innerHTML = `
    <section class="p-4 sm:p-6 max-w-full sm:max-w-md mx-auto">
      <h1 class="text-2xl font-semibold mb-6 text-center sm:text-left">Owner Profile</h1>

      <div class="flex flex-col items-center text-center">
        <img src="${image}" alt="Avatar" class="w-24 h-24 rounded-full mb-3 shadow-md" />
        <h2 class="text-lg font-bold break-words">${activeUser.full_name}</h2>
        <p class="text-gray-600 text-sm break-words">${activeUser.email}</p>
        <p class="text-gray-600 text-sm">CR: ${activeUser.id_user}</p>
        <p class="text-gray-500 text-sm">User: ${activeUser.roles?.[0]?.name_role || activeUser.rol}</p>
      </div>

      <div class="flex flex-row justify-around items-center gap-6 mt-6">
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 flex items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50 shadow-inner mb-2">
            <img src="../../img/bookings.png" alt="Reservations Icon" class="w-8 h-8" />
          </div>
          <span id="countReservas" class="font-semibold text-lg">00</span>
          <span class="text-gray-500 text-xs">reservations</span>
        </div>

        <div class="flex flex-col items-center">
          <div class="w-16 h-16 flex items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50 shadow-inner mb-2">
            <img src="../../img/reviews.png" alt="Reviews Icon" class="w-8 h-8" />
          </div>
          <span id="countReviews" class="font-semibold text-lg">00</span>
          <span class="text-gray-500 text-xs">reviews</span>
        </div>
      </div>

      <div class="w-full bg-blue-600 rounded-2xl shadow-md mt-6 divide-y divide-blue-500 overflow-hidden">
        <button id="dashboard" class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium hover:bg-blue-500 transition-colors">
          Dashboard <span>›</span>
        </button>
        <button class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium hover:bg-blue-500 transition-colors">
          Send Notifications <span>›</span>
        </button>
        <button class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium hover:bg-blue-500 transition-colors">
          Payments <span>›</span>
        </button>
        <button class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium hover:bg-blue-500 transition-colors">
          Contact us <span>›</span>
        </button>
        <button id="delete-account" class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors hover:bg-blue-500 transition-colors">
          Delete Account <span>›</span>
        </button>
      </div>
    </section>
  `;

Api.get(`/api/users/${activeUser.id_user}/reservationsowners`)
  .then((res) => {
    console.log("Respuesta reservas:", res);

    // Si usas Axios, la data viene en res.data
    let count = res[0].total_reservations || 0;

    document.getElementById("countReservas").textContent =
      count.toString().padStart(2, "0");
  })
  .catch((err) => {
    console.error("Error cargando reservas:", err);
    document.getElementById("countReservas").textContent = "00";
  });


  // Contador de reseñas
  Api.get(`/api/users/${activeUser.id_user}/reviewsowners`)
    .then((res) => {
     console.log("Respuesta reservas:", res);

    // Si usas Axios, la data viene en res.data
    let count = res[0].total_reviews || 0;

    document.getElementById("countReservas").textContent =
      count.toString().padStart(2, "0");
  })
  .catch((err) => {
    console.error("Error cargando reservas:", err);
    document.getElementById("countReservas").textContent = "00";
  });

  // Delete Account (opcional)
  const deleteAccountBtn = document.getElementById("delete-account");
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!showConfirm("Delete this user?")) return;
      try {
        await Api.delete(`/api/users/${activeUser.id_user}`);
        locaL.delete("active_user");
        window.location.href = "/skybolt/login";
        showSuccess("User successfully deleted");
      } catch (err) {
        showError(err?.message || "Error deleting user");
      }
    });
  }

  // Logout (header)
  const logoutHeader = document.getElementById("log-out-user");
  if (logoutHeader) {
    logoutHeader.addEventListener("click", (e) => {
      e.preventDefault();
      locaL.delete("active_user");
    });
  }

  // Atajo de back al dashboardOwner si lo necesitas en algún lugar:
  const backBtn = main.querySelector("#back-dashboard");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      renderDashboardOwner(ul, main);
    });
  }
};
