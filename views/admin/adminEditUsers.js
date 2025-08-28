import { locaL } from "../../src/scripts/LocalStorage";
import { Api } from "../../src/scripts/methodsApi";
import { departamentos } from "../register";
import { generalFormat } from "../../src/scripts/validationMethods";

export let renderDashboardAdminEditUsers = (ul, main) => {

  document.body.style.background = "white";

  // ---------- NAV ----------
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
  <a href="/skybolt/dashboardadmin/fields" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Fields</a>
          <a href="/skybolt/dashboardadmin/owners" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Owners</a>
          <a href="/skybolt/dashboardadmin/users" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Users</a>
          <a href="/skybolt/dashboardadmin/request" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Requests</a>
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

  // ---------- MAIN ----------
  main.innerHTML = `
    <section class="p-6 sm:p-6">
       <h2 class="text-lg sm:text-2xl font-bold text-green-600 mb-4 text-center sm:text-left">
        Hello Admin, you are editing users: ${locaL.get("active_user").full_name}
      </h2>

       <input type="text" id="user-search" placeholder="Search by email..."
        class="w-full max-w-md mb-6 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"/>

      <!-- Tabla -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead class="bg-green-500 text-white">
            <tr>
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left">Name</th>
              <th class="px-4 py-2 text-left">Phone</th>
              <th class="px-4 py-2 text-left">Email</th>
              <th class="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
        <tbody id="user-table-body"></tbody>
        </table>
      </div>

          
      <!-- FORM EDITAR -->
      <div id="edit-user-form-container"
        class="fixed inset-0 bg-black/50 hidden flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div class="bg-white p-4 rounded-lg shadow-md w-full max-w-sm sm:max-w-lg md:max-w-2xl mx-auto
                    max-h-[90vh] overflow-y-auto sm:max-h-none sm:overflow-visible">
          <h3 class="text-2xl sm:text-3xl font-bold text-green-600 mb-4 text-center">
            Edit User
          </h3>

          <form id="edit-user-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
            <input type="hidden" id="edit-user-id" />

            <!-- Columna izquierda / derecha (responsive) -->
            <input type="text" id="edit-full_name" placeholder="Full Name"
              class="col-span-1 sm:col-span-2 w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" />

            <input type="email" id="edit-email" placeholder="Email"
              class="w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" />

            <input type="text" id="edit-phone" placeholder="Phone"
              class="w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" />

            <input type="date" id="edit-birthdate"
              class="w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" />

            <input type="text" id="edit-document_type" placeholder="Document Type"
              class="w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" />

            <input type="text" id="edit-id_document" placeholder="ID Document"
              class="w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" />

            <!-- Departamento -->
            <select id="edit-id_department"
              class="col-span-1 sm:col-span-2 w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300">
              <option value="">--Select a department--</option>
              ${departamentos.map(dep => `<option value="${dep.id}">${dep.name}</option>`).join("")}
            </select>

            <!-- Municipio -->
            <select id="edit-id_municipality"
              class="col-span-1 sm:col-span-2 w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300">
              <option value="">--Select a municipality--</option>
            </select>

            <input type="text" id="edit-rol" placeholder="Role"
              class="col-span-1 sm:col-span-2 w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" />

            <input type="password" id="edit-password_" placeholder="New Password (optional)"
              class="col-span-1 sm:col-span-2 w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" />

            <!-- Botones -->
            <div class="flex flex-col sm:flex-row justify-end gap-3 mt-4 col-span-1 sm:col-span-2">
              <button type="submit"
                class="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                Save
              </button>
              <button type="button" id="cancel-edit"
                class="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- MODAL VER MÁS -->

      <div id="modal-user" class="fixed inset-0  bg-opacity-50 hidden flex items-center justify-center z-40 bg-white/50 backdrop-blur-md p-6 rounded-lg">
        <div class="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
          <h3 class="text-xl font-bold text-green-600 mb-4">User Details</h3>
          <div id="modal-user-content" class="space-y-2 text-gray-700"></div>
          <div class="text-right mt-4">
            <button id="close-modal" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Close
            </button>
          </div>
        </div>
      </div>
    </section>
  `;

  footer.innerHTML = `
    <!-- FOOTER COMPLETO -->
    <footer id="contact" class="bg-[#111827] text-green-100 py-10 px-6 sm:px-10 w-full mt-30">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
        <!-- DESCRIPCIÓN -->
        <div>
          <h3 class="text-xl font-bold text-white mb-4">SKYBOLT</h3>
          <p class="text-sm">
            Your trusted platform to book sports venues in seconds. Technology that connects active communities.
          </p>
        </div>

        <!-- ENLACES -->
        <div>
          <h4 class="text-lg font-semibold text-white mb-3">Useful Links</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/skybolt/login" class="hover:text-yellow-300 transition" data-link>Book Now</a></li>
            <li><a href="/skybolt/home#faq" class="hover:text-yellow-300 transition" data-link>FAQ</a></li>
            <li><a href="/skybolt/home#map" class="hover:text-yellow-300 transition" data-link>Location</a></li>
          </ul>
        </div>

        <!-- REDES -->
        <div>
          <h4 class="text-lg font-semibold text-white mb-3">Follow Us</h4>
          <div class="flex gap-4">
            <a href="#" class="hover:text-yellow-300 transition" data-link>Instagram</a>
            <a href="#" class="hover:text-yellow-300 transition" data-link>Facebook</a>
            <a href="#" class="hover:text-yellow-300 transition" data-link>Twitter</a>
          </div>
        </div>
      </div>
      <!-- COPYRIGHT -->
      <div class="text-center text-sm mt-10 text-green-300">
        © 2025 SKYBOLT. All rights reserved
      </div>
    </footer>
  `;
};