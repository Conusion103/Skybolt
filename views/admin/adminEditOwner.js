import { locaL } from "../../src/scripts/LocalStorage";
import { Api } from "../../src/scripts/methodsApi.js";

export let renderDashboardAdminEditOwners = (ul, main) => {
  // 🔹 Navbar
  ul.innerHTML = `
    <a href="/skybolt/dashboardadmin/fields" data-link class="text-green-600 hover:text-green-800 font-semibold">Fields</a>
    <a href="/skybolt/dashboardadmin/users" data-link class="text-green-600 hover:text-green-800 font-semibold">Users</a>
    <a href="/skybolt/dashboardadmin/request" data-link class="text-green-600 hover:text-green-800 font-semibold">Requests</a>
    <a href="/skybolt/login" id="log-out-user" data-link class="text-red-500 hover:text-red-700 font-semibold">Log out</a>
  `;

  // 🔹 Main content
  main.innerHTML = `
    <section class="p-6">
      <h2 class="text-2xl font-bold text-green-600 mb-6">
        👑 Owners Management - Welcome ${locaL.get("active_user").full_name}
      </h2>

      <input type="text" id="owner-search" placeholder="Search by email..."
        class="w-full max-w-md mb-6 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"/>

      <!-- Contenedor de owners -->
      <div id="owners-container" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
    </section>
  `;

  const container = document.getElementById("owners-container");

  // 🔹 Función para renderizar cada Owner
  const renderOwnerCard = (owner) => {
    return `
      <div class="bg-white border border-gray-200 shadow-md p-6 rounded-xl">
        <h3 class="text-xl font-semibold text-green-500 mb-2">${owner.full_name}</h3>
        <p><strong>Email:</strong> ${owner.email}</p>
        <p><strong>Phone:</strong> ${owner.phone || "N/A"}</p>
        <p><strong>Document:</strong> ${owner.document_type || ""} ${owner.id_document || ""}</p>
        <p><strong>Role:</strong> <span class="text-green-600 font-medium">${owner.name_role}</span></p>
      </div>
    `;
  };

  // 🔹 Cargar Owners desde la API
  Api.get("/api/users?role=owner")
    .then((owners) => {
      if (!owners.length) {
        container.innerHTML = `<p class="text-gray-600">No owners found.</p>`;
        return;
      }

      // Guardamos owners en memoria
      let allOwners = owners;

      // Render inicial
      container.innerHTML = allOwners.map(renderOwnerCard).join("");

      // 🔹 Listener para la búsqueda por email
      document.getElementById("owner-search").addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allOwners.filter((o) =>
          o.email.toLowerCase().includes(searchTerm)
        );
        container.innerHTML = filtered.length
          ? filtered.map(renderOwnerCard).join("")
          : `<p class="text-gray-600">No owners match your search.</p>`;
      });
    })
    .catch((err) => {
      console.error("Error loading owners:", err);
      container.innerHTML = `<p class="text-red-500">Error loading owners.</p>`;
    });

  // 🔹 Logout
  document.getElementById("log-out-user").addEventListener("click", (e) => {
    e.preventDefault();
    locaL.delete("active_user");
    window.location.href = "/skybolt/login";
  });
};


