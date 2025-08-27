import { Api } from "../../src/scripts/methodsApi.js";

export let renderDashboardAdminRequest = (ul, main) => {
  ul.innerHTML = `
    <a href="/skybolt/dashboardadmin/fields" data-link class="text-green-600 hover:text-green-800 font-semibold">Fields</a>
    <a href="/skybolt/dashboardadmin/users" data-link class="text-green-600 hover:text-green-800 font-semibold">Users</a>
    <a href="/skybolt/dashboardadmin/owners" data-link class="text-green-600 hover:text-green-800 font-semibold">Owners</a>
    <a href="/skybolt/login" id="log-out-user" data-link class="text-red-500 hover:text-red-700 font-semibold">Log out</a>
  `;

  main.innerHTML = `
    <section class="p-6">
      <h2 class="text-2xl font-bold text-green-600 mb-6">
        Owner Requests Panel
      </h2>

      <input type="text" id="owner-search" placeholder="Search by user email..."
        class="w-full max-w-md mb-6 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"/>

      <!-- Contenedor de solicitudes -->
      <div id="owner-requests-container" class="space-y-4"></div>
    </section>
  `;

  const container = document.getElementById("owner-requests-container");

  // Renderizar cada solicitud
  const renderRequestCard = (req) => {
    const statusClass =
      req.status === "pending"
        ? "text-yellow-600"
        : req.status === "approved"
        ? "text-green-600"
        : "text-red-600";

    // Botones solo si está pendiente
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

  // Cargar solicitudes desde API
  Api.get("/api/owner_requests")
    .then((requests) => {
      if (!requests.length) {
        container.innerHTML = `<p class="text-gray-600">No owner requests found.</p>`;
        return;
      }
      container.innerHTML = requests.map(renderRequestCard).join("");

      // Event Listeners - solo en solicitudes pendientes
      document.querySelectorAll(".approve-request").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;

          if (!confirm("✅ Are you sure you want to approve this request?")) return;

          Api.put(`/api/owner_requests/${id}`, { status: "approved" })
            .then(() => {
              const card = btn.closest("div.bg-white");
              const span = card.querySelector("span");
              span.textContent = "approved";
              span.className = "font-medium text-green-600";

              // Quitar botones
              card.querySelectorAll("button").forEach((b) => b.remove());

              alert("✅ Request approved!");
            })
            .catch((err) => console.error("Error approving request:", err));
        });
      });

      document.querySelectorAll(".reject-request").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;

          if (!confirm("❌ Are you sure you want to reject this request?")) return;

          Api.put(`/api/owner_requests/${id}`, { status: "rejected" })
            .then(() => {
              const card = btn.closest("div.bg-white");
              const span = card.querySelector("span");
              span.textContent = "rejected";
              span.className = "font-medium text-red-600";

              // Quitar botones
              card.querySelectorAll("button").forEach((b) => b.remove());

              alert("❌ Request rejected!");
            })
            .catch((err) => console.error("Error rejecting request:", err));
        });
      });
    })
    .catch((err) => console.error("Error loading requests:", err));
};

