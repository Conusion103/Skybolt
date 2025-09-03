import { locaL } from "../../src/scripts/LocalStorage";
import { Api } from "../../src/scripts/methodsApi";
import { departamentos } from "../register";
import { generalFormat } from "../../src/scripts/validationMethods";
import { showConfirm, showSuccess, showError } from "../../src/scripts/alerts";

export let renderDashboardAdminEditUsers = (ul, main) => {
  const activeUser = locaL.get("active_user");
  if (!activeUser) {
    main.innerHTML = `<p>Please log in.</p> <a href="/skybolt/login" data-link class="btn-primary" data-link>Log in</a>`;
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
      <div id="mobile-menu" class="hidden md:hidden w-full bg-white px-6 pb-6 flex-col items-center space-y-4 text-center">
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
    <section class="p-6 sm:p-6">
       <h2 class="text-lg sm:text-2xl font-bold text-green-600 mb-4 text-center sm:text-left">
        Hello ${locaL.get("active_user").full_name}, you are editing users
      </h2>

       <input type="text" id="user-search" placeholder="Search by email..."
        class="w-full max-w-md mb-6 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"/>

      <!-- Table -->
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
        <tbody id="user-table-body"></tbody>
        </table>
      </div>

          
      <!-- FORM EDIT -->
      <div id="edit-user-form-container"
        class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50 backdrop-blur-sm p-4">
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

            <!-- Department -->
            <select id="edit-id_department"
              class="col-span-1 sm:col-span-2 w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300">
              <option value="">--Select a department--</option>
              ${departamentos.map(dep => `<option value="${dep.id}">${dep.name}</option>`).join("")}
            </select>

            <!-- Municipality -->
            <select id="edit-id_municipality"
              class="col-span-1 sm:col-span-2 w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300">
              <option value="">--Select a municipality--</option>
            </select>

            <input type="text" id="edit-rol" placeholder="Role"
              class="col-span-1 sm:col-span-2 w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" />

            <input type="password" id="edit-password_" placeholder="New Password (optional)"
              class="col-span-1 sm:col-span-2 w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" />

            <!-- Buttons -->
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
      <!-- MODAL SEE MORE -->
      
      <div id="modal-user" class="fixed inset-0  bg-opacity-50 hidden items-center justify-center z-40 bg-white/50 backdrop-blur-md p-6 rounded-lg">
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
            
      <!-- DESCRIPTION -->
      <div>
        <h3 class="text-xl font-bold text-white mb-4">SKYBOLT</h3>
        <p class="text-sm">
          Your trusted platform to book sports venues in seconds. Technology that connects active communities.
        </p>
      </div>

      <!-- LINKS -->
      <div>
        <h4 class="text-lg font-semibold text-white mb-3">Useful Links</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/skybolt/login" class="hover:text-yellow-300 transition" data-link>Book Now</a></li>
          <li><a href="/skybolt/home#faq" class="hover:text-yellow-300 transition" data-link>FAQ</a></li>
          <li><a href="/skybolt/home#map" class="hover:text-yellow-300 transition" data-link>Location</a></li>
        </ul>
      </div>

     <!-- NETWORKS -->
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
  document.querySelectorAll(".log-out-user").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      locaL.delete("active_user");

      // Redirect manually
      window.history.pushState(null, null, "/skybolt/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  });

  let usersList = [];

  // ---------- Upload users ----------
  Api.get("/api/users").then((data) => {
    usersList = data;
    renderUsers(data);
  });

  // ---------- RENDER USERS ----------
  const renderUsers = (data) => {
  const tbody = document.getElementById("user-table-body");
  tbody.innerHTML = "";

  const onlyUsers = data.filter((u) =>
    u.roles.length > 0 && u.roles[0].name_role === "user"
  );

  if (onlyUsers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">There are no users with role <strong>user</strong>.</td></tr>`;
    return;
  }
  onlyUsers.forEach((user) => {
    const row = document.createElement("tr");
    row.classList.add("border-b", "hover:bg-gray-50");

    row.innerHTML = `
      <td class="px-4 py-2">${user.id_user}</td>
      <td class="px-4 py-2">${user.full_name}</td>
      <td class="px-4 py-2">${user.email}</td>
      <td class="px-4 py-2">${user.phone}</td>
      <td class="px-4 py-2 text-center">
        <button class="btn-view bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition" data-id="${user.id_user}">🔍</button>
        <button class="btn-edit bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition" data-id="${user.id_user}">✏️</button>
        <button class="btn-delete bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" data-id="${user.id_user}">🗑️</button>
      </td>
    `;
    tbody.appendChild(row);
  });
};

  // ---------- SEARCH ----------
  document.getElementById("user-search").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = usersList.filter((u) =>
      u.email.toLowerCase().includes(searchTerm)
    );
    renderUsers(filtered);
  });

  // ---------- Table ----------

  document.getElementById("user-table-body").addEventListener("click", (e) => {
    const userID = Number(e.target.getAttribute("data-id"));
    if (!userID) return;

    // Delete user
if (e.target.classList.contains("btn-delete")) {
  showConfirm("Delete this user?").then((confirmed) => {
    if (!confirmed) return;

    Api.delete(`/api/users/${userID}`)
      .then(() => {
        usersList = usersList.filter((u) => u.id_user !== userID);
        renderUsers(usersList);
        showSuccess("User successfully deleted");
      })
      .catch((err) => {
        showError(err.message);
      });
  });
}

    // Update users
    if (e.target.classList.contains("btn-edit")) {
  const userData = usersList.find((u) => u.id_user === userID);
  if (!userData) return;

  document.getElementById("edit-user-id").value = userData.id_user;
  document.getElementById("edit-full_name").value = userData.full_name;
  document.getElementById("edit-email").value = userData.email;
  document.getElementById("edit-phone").value = userData.phone || "";
  document.getElementById("edit-birthdate").value = userData.birthdate?.split("T")[0] || "";
  document.getElementById("edit-document_type").value = userData.document_type;
  document.getElementById("edit-id_document").value = userData.id_document;
  document.getElementById("edit-id_department").value = userData.id_department;


  loadMunicipalities(userData.id_department, userData.id_municipality);

  document.getElementById("edit-rol").value = userData.roles[0]?.name_role || "";
  document.getElementById("edit-password_").value = "";

  document.getElementById("edit-user-form-container").classList.remove("hidden");
}
    // view detailt of users
    if (e.target.classList.contains("btn-view")) {
  const userData = usersList.find((u) => u.id_user === userID);
  if (!userData) return;

  let depName = "Unknown";
  let munName = "Unknown";

  if (userData.id_municipality) {
    Api.get(`/api/municipalities/${userData.id_municipality}`)
      .then((muni) => {
        munName = muni?.name_municipality || "Unknown";
        if (muni?.id_department) {
          Api.get(`/api/departments/${muni.id_department}`)
            .then(dep => {
              depName = dep?.name_department || "Unknown";
              mostrarModalUser(userData, depName, munName);
            })
            .catch(() => mostrarModalUser(userData, depName, munName));
        } else {
          mostrarModalUser(userData, depName, munName);
        }
      })
      .catch(() => mostrarModalUser(userData, depName, munName));
  } else {
    mostrarModalUser(userData, depName, munName);
  }
}

// Modal
function mostrarModalUser(userData, depName, munName) {
  document.getElementById("modal-user-content").innerHTML = `
    <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>ID:</strong> ${userData.id_user}</p>
    <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Name:</strong> ${userData.full_name}</p>
    <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Email:</strong> ${userData.email}</p>
    <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Phone:</strong> ${userData.phone || "N/A"}</p>
    <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Birthday:</strong> ${userData.birthdate?.split("T")[0] || "N/A"}</p>
    <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>${userData.document_type}:</strong> ${userData.id_document}</p>
    <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Location:</strong> ${depName} - ${munName}</p>
    <p class="w-full px-4 py-3 rounded-md bg-gray-200"><strong>Roles:</strong> ${userData.roles[0]?.name_role || ""}</p>
  `;
  document.getElementById("modal-user").classList.remove("hidden");
  document.getElementById("modal-user").classList.add("flex");
}
  });

  // ---------- CANCEL EDIT ----------
  document.getElementById("cancel-edit").addEventListener("click", () => {
    document.getElementById("edit-user-form").reset();
    document.getElementById("edit-user-id").value = "";
    document.getElementById("edit-user-form-container").classList.add("hidden");
  });

  // ---------- SUBMIT EDIT ----------
  document.getElementById("edit-user-form").addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      const userID = Number(document.getElementById("edit-user-id").value);

      // Validations of generalFormat function
      const full_name = generalFormat.nameFormat(document.getElementById("edit-full_name").value.trim());
      const email = generalFormat.hotmailFormat(document.getElementById("edit-email").value.trim());
      const phone = generalFormat.phoneNumber(document.getElementById("edit-phone").value.trim());
      const birthdate = generalFormat.birthdate(document.getElementById("edit-birthdate").value);
      const document_type = generalFormat.documenttypeFormat(document.getElementById("edit-document_type").value.trim());
      const id_document = generalFormat.identicationFormat(document.getElementById("edit-id_document").value.trim());
      const id_department = generalFormat.departamentFormat(Number(document.getElementById("edit-id_department").value));
      const id_municipality = generalFormat.townFormat(Number(document.getElementById("edit-id_municipality").value));
      const rol = document.getElementById("edit-rol").value.trim();

      const updatedUser = {
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

      // Check edit password
      const newPassword = document.getElementById("edit-password_").value;
      if (newPassword) {
        updatedUser.password_ = generalFormat.passwordFormat(newPassword, newPassword);
      }
       // Api users
      Api.put(`/api/users/${userID}`, updatedUser)
        .then(() => {
          showSuccess("Usuario actualizado correctamente");
          document.getElementById("edit-user-form-container").style.display = "none";
          return Api.get("/api/users");
        })
        .then((data) => {
          usersList = data;
          renderUsers(usersList);
        })
        .catch((err) => showError(err.message));
    } catch (error) {
      showError(error.message);
    }
  });
    

  // ---------- MODAL CLOSE ----------
    document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("modal-user").classList.add("hidden");
    document.getElementById("modal-user").classList.remove("flex");
  });

  // ---------- HELPERS ----------

  const loadMunicipalities = (depId) => {
    const select = document.getElementById("edit-id_municipality");
    select.innerHTML = '<option value="">Select a municipality</option>';
    const dep = departamentos.find((d) => d.id === Number(depId));
    if (!dep) return;
    dep.municipios.forEach((m) => {
      const option = document.createElement("option");
        option.value = m.id;
        option.textContent = m.name;
        select.appendChild(option);
    });
  };

  document.getElementById("edit-id_department").addEventListener("change", (e) => {
    const depId = Number(e.target.value);
    loadMunicipalities(depId);
  });
};