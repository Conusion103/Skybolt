import { showConfirm, showError, showSuccess } from "../../src/scripts/alerts.js";
import { Api } from "../../src/scripts/methodsApi.js";
import { locaL } from "../../src/scripts/LocalStorage.js";

export let renderDashboardAdminRequest = (ul, main) => {
  document.body.style.background = "white";
  ul.innerHTML = `
    <header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-3xl font-bold text-gray-800">
            <a href="/skybolt/home#top" class="hover:text-sky-600 transition-colors duration-200" data-link>SkyBolt</a>
          </h1>

          <nav class="hidden md:flex space-x-6">
            <a href="/skybolt/dashboardadmin/fields" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Fields</a>
            <a href="/skybolt/dashboardadmin/owners" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Owners</a>
            <a href="/skybolt/dashboardadmin/users" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Users</a>
            <a href="/skybolt/dashboardadmin/request" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Requests</a>
            <a href="/skybolt/login" class="log-out-user block sm:inline text-red-500 hover:text-red-700 font-semibold px-2">Log out</a>
    
          </nav>

          <button id="menu-btn" class="md:hidden flex flex-col space-y-1">
            <span class="w-6 h-0.5 bg-gray-800"></span>
            <span class="w-6 h-0.5 bg-gray-800"></span>
            <span class="w-6 h-0.5 bg-gray-800"></span>
          </button>
        </div>
      </div>

      <!-- MOBILE MENU -->
      <div id="mobile-menu" class="hidden md:hidden w-full bg-white px-6 pb-6  flex-col items-center space-y-4 text-center">
        <a href="/skybolt/dashboardadmin/fields" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Fields</a>
        <a href="/skybolt/dashboardadmin/owners" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Owners</a>
        <a href="/skybolt/dashboardadmin/users" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Users</a>
        <a href="/skybolt/dashboardadmin/request" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Requests</a>
        <a href="/skybolt/login" class="log-out-user block sm:inline text-red-500 hover:text-red-700 font-semibold px-2">Log out</a>
      </div>
    </header>

    <!-- SPACE SO THE HEADER DOESN'T COVER THE CONTENT -->
    <div id="top" class="h-16"></div>
  `;
  document.getElementById("menu-btn").addEventListener("click", () => {
    const menu = document.getElementById("mobile-menu");
    menu.classList.toggle("hidden");
  });

  // ---------- MAIN ----------
  main.innerHTML = `
    <section class="p-6">
      <h2 class="text-2xl font-bold text-green-600 mb-6">
        Owner Requests Panel
      </h2>

      <input type="text" id="owner-search" placeholder="Search by user email..."
        class="w-full max-w-md mb-6 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"/>

      <!-- Request container -->
      <div id="owner-requests-container" class="space-y-4"></div>
    </section>
  `;

  const container = document.getElementById("owner-requests-container");

  // ---------- LOGOUT ----------
  document.querySelectorAll(".log-out-user").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      locaL.delete("active_user");

      // Redirect manually
      window.history.pushState(null, null, "/skybolt/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  });

  // RENDER EACH OWNER REQUEST CARD
  const renderRequestCard = (req) => {
    const statusClass =
      req.status === "pending"
        ? "text-yellow-600"
        : req.status === "approved"
          ? "text-green-600"
          : "text-red-600";

      // ACTION BUTTONS ONLY IF STATUS IS PENDING
    const actionButtons =
      req.status === "pending"
        ? `
        <div class="absolute top-4 right-4 flex gap-3">
          <button data-id="${req.id_request}" class="approve-request text-green-600 hover:text-green-800 text-2xl">✔</button>
          <button data-id="${req.id_request}" class="reject-request text-red-600 hover:text-red-800 text-2xl">✖</button>
        </div>`
        : "";

    return `
      <div class="bg-white border border-gray-200 shadow-md p-6 rounded-xl relative">
        <h3 class="text-xl font-semibold text-green-500 mb-2">${req.cancha_name}</h3>
        <p><strong>User ID:</strong> ${req.id_user}</p>
        <p><strong>Location:</strong> ${req.cancha_location}</p>
        <p><strong>Description:</strong> ${req.cancha_description || "N/A"}</p>
        <p class="mt-2"><strong>Status:</strong> 
          <span class="font-medium ${statusClass}">
            ${req.status}
          </span>
        </p>
        ${actionButtons}
      </div>
    `;
  };

  // LOAD REQUESTS FROM API
  Api.get("/api/owner_requests")
    .then((requests) => {
      if (!requests.length) {
        container.innerHTML = `<p class="text-gray-600">No owner requests found.</p>`;
        return;
      }
      container.innerHTML = requests.map(renderRequestCard).join("");

       // APPROVE HANDLER
      document.querySelectorAll(".approve-request").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;

          showConfirm("Are you sure you want to approve this request?")
            .then((confirmed) => {
              if (!confirmed) return;

              Api.put(`/api/owner_requests/${id}`, { status: "approved" })
                .then(() => {
                  const card = btn.closest("div.bg-white");
                  const span = card.querySelector("span");
                  span.textContent = "approved";
                  span.className = "font-medium text-green-600";

                  // Remove buttons
                  card.querySelectorAll("button").forEach((b) => b.remove());

                  showSuccess("Request approved!");
                })
                .catch((err) => console.error("Error approving request:", err));
            });
        });
      });
      // REJECT HANDLER
      document.querySelectorAll(".reject-request").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;

          showConfirm("Are you sure you want to reject this request?")
            .then((confirmed) => {
              if (!confirmed) return;

              Api.put(`/api/owner_requests/${id}`, { status: "rejected" })
                .then(() => {
                  const card = btn.closest("div.bg-white");
                  const span = card.querySelector("span");
                  span.textContent = "rejected";
                  span.className = "font-medium text-red-600";

                  card.querySelectorAll("button").forEach((b) => b.remove());

                  showSuccess("Request rejected!");
                })
                .catch((err) => console.error("Error rejecting request:", err));
            });
        });
      });
    })
    .catch((err) => console.error("Error loading requests:", err));
};


