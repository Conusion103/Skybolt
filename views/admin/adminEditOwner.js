import { showConfirm, showError, showSuccess } from "../../src/scripts/alerts";
import { locaL } from "../../src/scripts/LocalStorage";
import { Api } from "../../src/scripts/methodsApi";
import { generalFormat } from "../../src/scripts/validationMethods";


export let renderDashboardAdminEditOwners = (ul, main) => {
    const activeUser = locaL.get("active_user");
  if (!activeUser) {
    main.innerHTML = `<p>Por favor inicia sesión.</p> <a href="/skybolt/login" data-link class="btn-primary" data-link>Log in</a>`;
    return;
  }
  
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
      <h2 class="text-2xl font-bold text-green-600 mb-4 sm:text-left">
        Hello ${locaL.get("active_user").full_name}, you are editing owners
      </h2>

      <input type="text" id="owner-search" placeholder="Search by email..."
        class="w-full max-w-md mb-6 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"/>

      <!-- Tabla -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead class="bg-green-500 text-white">
            <tr>
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left">Name</th>
              <th class="px-4 py-2 text-left">Email</th>
              <th class="px-4 py-2 text-left">Phone</th>
              <th class="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
        <tbody id="owner-table-body"></tbody>
        </table>
      </div>
          
      <!-- FORM EDITAR -->
      <div id="edit-owner-form-container"
        class="fixed inset-0 bg-black/50 hidden flex items-center justify-center z-50 backdrop-blur-md p-4">
        <div class="bg-white p-4 rounded-lg shadow-md w-full max-w-md mx-auto transform 
                    max-h-[100vh] overflow-y-auto">
          
          <h3 class="text-2xl font-bold text-green-600 mb-4 text-center">Editar Owner</h3>
          
          <form id="edit-owner-form" class="space-y-2 text-sm">
            <input type="hidden" id="edit-owner-id" />
            <input type="text" id="edit-full_name" placeholder="Full Name"
              class="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300" />
            <input type="email" id="edit-email" placeholder="Email"
              class="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300" />
            <input type="text" id="edit-phone" placeholder="Phone"
              class="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"/>
            <input type="date" id="edit-birthdate"
              class="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300" />
            <input type="text" id="edit-document_type" placeholder="Document Type"
              class="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300" />
            <input type="text" id="edit-id_document" placeholder="ID Document"
              class="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"/>

            <!-- Departamento -->
            <select id="edit-id_department"
              class="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300">
              <option value="">--Select a department--</option>
            </select>

            <!-- Municipio -->
            <select id="edit-id_municipality"
              class="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300">
              <option value="">Select a municipality</option>
            </select>

            <input type="text" id="edit-rol" placeholder="Role"
              class="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300">
            <input type="password" id="edit-password_" placeholder="New Password (optional)"
              class="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300" />

            <div class="flex justify-end gap-4 mt-4">
              <button type="submit"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                Guardar
              </button>
              <button type="button" id="cancel-edit"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                Cancelar
              </button>   
            </div>
          </form>
        </div>
      </div>



      <!-- MODAL VER MÁS -->
      <div id="modal-owner" class="fixed inset-0  bg-opacity-50 hidden flex items-center justify-center z-40 bg-white/50 backdrop-blur-md p-6 rounded-lg">
        <div class="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
          <h3 class="text-xl font-bold text-green-600 mb-4">Owner Details</h3>
          <div id="modal-owner-content" class="space-y-2 text-gray-700"></div>
          <div class="text-right mt-4">
            <button id="close-modal" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Cerrar
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
      <!-- COPYRIGHT -->
      <div class="text-center text-sm mt-10 text-green-300">
        © 2025 SKYBOLT. All rights reserved
      </div>
    </footer>
  `;

  // ---------- LOGOUT ----------
  document.getElementById("log-out-user").addEventListener("click", (e) => {
    e.preventDefault();
    locaL.delete("active_user");
  });

  let ownersList = [];
  let departmentsList = [];
  let municipalitiesList = [];

  // ---------- CARGAR DEPARTAMENTOS ----------
  function loadDepartments(callback) {
    const depSelect = document.getElementById("edit-id_department");
    depSelect.innerHTML = `<option value="">--Select a department--</option>`;
    Api.get("/api/departments").then((deps) => {
      departmentsList = deps;
      deps.forEach(dep => {
        const option = document.createElement("option");
        option.value = dep.id_department;
        option.textContent = dep.name_department;
        depSelect.appendChild(option);
      });
      if (callback) callback();
    });
  }

  // ---------- CARGAR MUNICIPIOS POR DEPARTAMENTO ----------
  function loadMunicipalities(depId, selectedMuniId) {
    const muniSelect = document.getElementById("edit-id_municipality");
    muniSelect.innerHTML = `<option value="">Select a municipality</option>`;
    if (!depId) return;
    Api.get(`/api/departments/${depId}/municipalities`).then((res) => {
      municipalitiesList = res.municipalities || [];
      municipalitiesList.forEach(m => {
        const option = document.createElement("option");
        option.value = m.id_municipality;
        option.textContent = m.name_municipality;
        if (selectedMuniId && m.id_municipality == selectedMuniId) {
          option.selected = true;
        }
        muniSelect.appendChild(option);
      });
    });
  }

  // Inicializar departamentos al cargar la vista
  loadDepartments();

  // ---------- CARGAR OWNERS ----------
  Api.get("/api/users").then((data) => {
    ownersList = data;
    renderOwners(data);
  });

  // ---------- RENDER OWNERS ----------
  const renderOwners = (data) => {
    const tbody = document.getElementById("owner-table-body");
    tbody.innerHTML = "";

    const onlyOwners = data.filter((u) =>
      u.roles.some((r) => r.name_role === "owner")
    );

    if (onlyOwners.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">There are no users with role <strong>owner</strong>.</td></tr>`;
      return;
    }

    onlyOwners.forEach((owner) => {
      const row = document.createElement("tr");
      row.classList.add("border-b", "hover:bg-gray-50");

      row.innerHTML = `
        <td class="px-4 py-2">${owner.id_user}</td>
        <td class="px-4 py-2">${owner.full_name}</td>
        <td class="px-4 py-2">${owner.email}</td>
        <td class="px-4 py-2">${owner.phone}</td>
        <td class="px-4 py-2 text-center">
            <button class="btn-view bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition" data-id="${owner.id_user}">🔍</button>
            <button class="btn-edit bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition" data-id="${owner.id_user}">✏️</button>
            <button class="btn-delete bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" data-id="${owner.id_user}">🗑️</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  };

  // ---------- SEARCH ----------
  document.getElementById("owner-search").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = ownersList.filter((u) =>
      u.email.toLowerCase().includes(searchTerm)
    );
    renderOwners(filtered);
  });

  // ---------- EVENTOS TABLA ----------
  document.getElementById("owner-table-body").addEventListener("click", (e) => {
    const ownerID = Number(e.target.getAttribute("data-id"));
    if (!ownerID) return;

    if (e.target.classList.contains("btn-delete")) {
      if (!showConfirm("¿Eliminar este owner?")) return;
      Api.delete(`/api/users/${ownerID}`)
        .then(() => {
          ownersList = ownersList.filter((u) => u.id_user !== ownerID);
          renderOwners(ownersList);
          showSuccess("Owner eliminado correctamente");
        })
        .catch((err) => showError(err.message));
    }

    if (e.target.classList.contains("btn-edit")) {
      const ownerData = ownersList.find((u) => u.id_user === ownerID);
      if (!ownerData) return;

      document.getElementById("edit-owner-id").value = ownerData.id_user;
      document.getElementById("edit-full_name").value = ownerData.full_name;
      document.getElementById("edit-email").value = ownerData.email;
      document.getElementById("edit-phone").value = ownerData.phone || "";
      document.getElementById("edit-birthdate").value = ownerData.birthdate?.split("T")[0] || "";
      document.getElementById("edit-document_type").value = ownerData.document_type;
      document.getElementById("edit-id_document").value = ownerData.id_document;
      document.getElementById("edit-id_department").value = ownerData.id_department;
      loadMunicipalities(ownerData.id_department, ownerData.id_municipality);
      document.getElementById("edit-rol").value = ownerData.roles[0]?.name_role || "";
      document.getElementById("edit-password_").value = "";

      document.getElementById("edit-owner-form-container").style.display = "block";
    }


    if (e.target.classList.contains("btn-view")) {
      const ownerData = ownersList.find((u) => u.id_user === ownerID);
      if (!ownerData) return;

      if (ownerData.id_municipality) {
        Api.get(`/api/municipalities/${ownerData.id_municipality}`)
          .then((muni) => {
            let muniName = muni?.name_municipality || "Desconocido";
            let depName = "Desconocido";
            if (muni?.id_department) {
              Api.get(`/api/departments/${muni.id_department}`)
                .then(dep => {
                  depName = dep?.name_department || "Desconocido";
                  mostrarModalOwner(ownerData, depName, muniName);
                })
                .catch(() => mostrarModalOwner(ownerData, depName, muniName));
            } else {
              mostrarModalOwner(ownerData, depName, muniName);
            }
          })
          .catch(() => mostrarModalOwner(ownerData, depName, muniName));
      } else {
        mostrarModalOwner(ownerData, depName, muniName);
      }
    }
  });

  function mostrarModalOwner(ownerData, depName, muniName) {
    document.getElementById("modal-owner-content").innerHTML = `
      <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>ID:</strong> ${ownerData.id_user}</p>
      <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Nombre:</strong> ${ownerData.full_name}</p>
      <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Email:</strong> ${ownerData.email}</p>
      <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Teléfono:</strong> ${ownerData.phone || "N/A"}</p>
      <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Cumpleaños:</strong> ${ownerData.birthdate?.split("T")[0] || "N/A"}</p>
      <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>${ownerData.document_type}:</strong> ${ownerData.id_document}</p>
      <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Ubicación:</strong> ${depName} - ${muniName}</p>
      <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Roles:</strong> ${ownerData.roles.map(r => r.name_role).join(", ")}</p>
    `;
    document.getElementById("modal-owner").classList.remove("hidden");
    document.getElementById("modal-owner").classList.add("flex");
  }

  document.getElementById("cancel-edit").addEventListener("click", () => {
    document.getElementById("edit-owner-form").reset();
    document.getElementById("edit-owner-id").value = "";
    document.getElementById("edit-owner-form-container").style.display = "none";
  });

  document.getElementById("edit-owner-form").addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      const ownerID = Number(document.getElementById("edit-owner-id").value);

      const full_name = generalFormat.nameFormat(document.getElementById("edit-full_name").value.trim());
      const email = generalFormat.hotmailFormat(document.getElementById("edit-email").value.trim());
      const phone = generalFormat.phoneNumber(document.getElementById("edit-phone").value.trim());
      const birthdate = generalFormat.birthdate(document.getElementById("edit-birthdate").value);
      const document_type = generalFormat.documenttypeFormat(document.getElementById("edit-document_type").value.trim());
      const id_document = generalFormat.identicationFormat(document.getElementById("edit-id_document").value.trim());
      const id_department = generalFormat.departamentFormat(Number(document.getElementById("edit-id_department").value));
      const id_municipality = generalFormat.townFormat(Number(document.getElementById("edit-id_municipality").value));
      const rol = document.getElementById("edit-rol").value.trim();

      const updatedOwner = {
        full_name,
        email,
        phone,
        birthdate,
        document_type,
        id_document,
        id_department,
        id_municipality,
        rol
      };

      const newPassword = document.getElementById("edit-password_").value;
      if (newPassword) {
        updatedOwner.password_ = generalFormat.passwordFormat(newPassword, newPassword);
      }

      Api.put(`/api/users/${ownerID}`, updatedOwner)
        .then(() => {
          showSuccess("Owner actualizado correctamente");
          document.getElementById("edit-owner-form-container").style.display = "none";
          return Api.get("/api/users");
        })
        .then((data) => {
          ownersList = data;
          renderOwners(ownersList);
        })
        .catch((err) => showError(err.message));
    } catch (error) {
      showError(error.message);
    }
  });

  document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("modal-owner").classList.add("hidden");
    document.getElementById("modal-owner").classList.remove("flex");
  });

  document.getElementById("edit-id_department").addEventListener("change", (e) => {
    const depId = Number(e.target.value);
    loadMunicipalities(depId);
  });
};

