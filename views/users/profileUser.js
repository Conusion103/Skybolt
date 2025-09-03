import { locaL } from "../../src/scripts/LocalStorage";
import { Api } from "../../src/scripts/methodsApi";
import { showConfirm, showError, showSuccess } from "../../src/scripts/alerts";


export let renderDashboardUserProfile = (ul, main) => {
  const activeUser = locaL.get("active_user");
  if (!activeUser) {
    main.innerHTML = `<p>Por favor inicia sesión.</p> <a href="/skybolt/login" data-link class="btn-primary" data-link>Log in</a>`;
    return;
  }
   document.body.style.background = "white";

  const image = activeUser.image && activeUser.image.trim() !== ""
    ? activeUser.image : "../../img/profiledefault.png";

  // Render menu and welcome
  document.body.style.background = "white";

  ul.innerHTML = `

    <header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-3xl font-bold text-gray-800">
            <a href="/skybolt/home#top" class="hover:text-sky-600 transition-colors duration-200" data-link>SkyBolt</a>
          </h1>

          <nav class="hidden md:flex space-x-6">
            <a href="/skybolt/dashboarduser" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Fields</a>
            <!--- <a href="" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Payments</a>
            <a href="" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Contact us</a> --->
            <a href="/skybolt/dashboarduser/profile/request" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Be Owners</a>
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
      <div id="mobile-menu" class="hidden md:hidden w-full bg-white px-6 pb-6 flex-col items-center space-y-4 text-center">
        <a href="/skybolt/dashboardadmin/fields" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Fields</a>
        <!--- <a href="" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Payments</a>
        <a href="" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Contact us</a> --->
        <a href="/skybolt/dashboarduser/profile/request" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Be Owners</a>
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
      <h1 class="text-2xl font-semibold mb-6 text-center sm:text-left">Profile</h1>

      <div class="flex flex-col items-center text-center">
        <img src="${image}" alt="Avatar" class="w-24 h-24 rounded-full mb-3 shadow-md" />
        <h2 class="text-lg font-bold break-words">${activeUser.full_name}</h2>
        <p class="text-gray-600 text-sm break-words">${activeUser.email}</p>
        <p class="text-gray-600 text-sm">CR: ${activeUser.id_user}</p>
        <p class="text-gray-500 text-sm">User: ${activeUser.roles?.[0]?.name_role}</p>
      </div>

      <div class="flex flex-row justify-around items-center gap-6 mt-6">
        <!-- Reservas -->
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 flex items-center justify-center rounded-full border-2 border-green-400 bg-green-50 shadow-inner mb-2">
            <img src="../../img/bookings.png" alt="Reservations Icon" class="w-8 h-8" />
          </div>
          <span id="countReservas" class="font-semibold text-lg">00</span>
          <span class="text-gray-500 text-xs">reservations</span>
        </div>

        <!-- Reseñas -->
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 flex items-center justify-center rounded-full border-2 border-green-400 bg-green-50 shadow-inner mb-2">
            <img src="../../img/reviews.png" alt="Reviews Icon" class="w-8 h-8" />
          </div>
          <span id="countReviews" class="font-semibold text-lg">00</span>
          <span class="text-gray-500 text-xs">reviews</span>
        </div>
      </div>

      <div class="w-full bg-green-400 rounded-2xl shadow-md mt-6 divide-y divide-green-300 overflow-hidden">
        <button class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium hover:bg-green-300 transition-colors">
          Send Notifications <span>›</span>
        </button>
        <button class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium hover:bg-green-300 transition-colors">
          Payments <span>›</span>
        </button>
        <button class="w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium hover:bg-green-300 transition-colors">
          Contact us <span>›</span>
        </button>
        <button id="delete-account"
          class="delete-account w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium text-red-600 hover:bg-green-300 transition-colors">
          Delete Account <span>›</span>
        </button>
      </div>
    </section>
  `;


  Api.get(`/api/users/${activeUser.id_user}/reservations`)
    .then((reservations) => {
      console.log("Respuesta reservas:", reservations);


      // count of reserves
      let count = 0;
      if (Array.isArray(reservations) && reservations.length > 0) {
        count = reservations[0].total_reservations || 0;
      } else if (Array.isArray(reservations?.data)) {
        count = reservations.data.length;
      } else if (reservations?.total !== undefined) {
        count = reservations.total;
      }

      document.getElementById("countReservas").textContent = count.toString().padStart(2, "0");
    })
    .catch((err) => {
      console.error("Error cargando reservas:", err);
      document.getElementById("countReservas").textContent = "00";
    });


  // Count of reviews
  Api.get(`/api/users/${activeUser.id_user}/reviews`)
    .then((reviews) => {
      console.log("Respuesta del endpoint:", reviews);

      let count = reviews[0].total_reviews;
      if (Array.isArray(reviews) && reviews.length > 0) {
        count = reviews[0].total || 0;
      } else if (reviews?.data && Array.isArray(reviews.data)) {
        count = reviews.data.length;
      }

      document.getElementById("countReviews").textContent = count.toString().padStart(2, "0");
      console.log("Cantidad de reseñas:", count);
    })
    .catch((err) => {
      console.error("Error cargando reseñas:", err);
      document.getElementById("countReviews").textContent = "00";
    });



  // Delete account
  const deleteAccountBtn = document.getElementById("delete-account");
    deleteAccountBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!showConfirm("Delete this user?")) return;
      Api.delete(`/api/users/${activeUser.id_user}`)
        .then(() => {
          locaL.delete("active_user");
          window.location.href = "/skybolt/login";
          showSuccess("User successfully deleted");
        })
        .catch((err) => showError(err.message));
    });

  // Logout
  const logoutBtn = document.getElementById('log-out-user');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      locaL.remove('active_user');
    });
  }

  document.getElementById("log-out-user").addEventListener("click", (e) => {
    e.preventDefault();
    locaL.delete("active_user");
  });

  //  go Back 
  const backBtn = main.querySelector('#back-dashboard');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, null, "/skybolt/dashboarduser");
    });
  }
};

