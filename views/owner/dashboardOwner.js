import { Api } from "../../src/scripts/methodsApi.js";
import { locaL } from "../../src/scripts/LocalStorage.js";
import { showSuccess, showError, showConfirm } from "../../src/scripts/alerts.js";

export let renderDashboardOwner = (ul, main) => {
  const activeUser = locaL.get("active_user");
  if (!activeUser) {
    main.innerHTML = `<p>Por favor inicia sesión.</p> <a href="/skybolt/login" data-link class="btn-primary" data-link>Log in</a>`;
    return;
  }
   document.body.style.background = "white";

  // Navbar
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
    <section class="p-6 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold text-blue-600 mb-6">
      Hola Propietario ${activeUser.full_name}
    </h2>

      <!-- Formulario -->
      <section id="form-section" class="mb-8 p-4 bg-gray-100 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4">Agregar / Editar Cancha</h3>
        <form id="field-form" class="grid gap-4 max-w-2xl mx-auto sm:grid-cols-2">
          <input type="hidden" id="field-id" value="" />

          <label class="flex flex-col col-span-2">
            Nombre de la cancha:
            <input
              type="text"
              id="field-name"
              required
              class="border rounded px-4 py-3 text-lg w-full"
            />
          </label>

          <label class="flex flex-col col-span-2 sm:col-span-1">
            Juego:
            <select
              id="field-game"
              required
              class="border rounded px-4 py-3 text-lg w-full"
            ></select>
          </label>

          <label class="flex flex-col col-span-2 sm:col-span-1">
            Municipio:
            <select
              id="field-municipality"
              required
              class="border rounded px-4 py-3 text-lg w-full"
            ></select>
          </label>

          <label class="flex flex-col col-span-2">
            Disponibilidad:
            <select
              id="field-availability"
              required
              class="border rounded px-4 py-3 text-lg w-full"
            ></select>
          </label>

          <div class="flex gap-4 col-span-2 flex-wrap justify-center sm:justify-start">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-3 text-lg rounded hover:bg-blue-700"
            >
              Guardar cancha
            </button>
            <button
              type="button"
              id="cancel-edit"
              class="hidden bg-gray-400 text-white px-6 py-3 text-lg rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>

      </section>

      <!-- Tabla responsive -->
      <section id="fields-list-section">
        <h3 class="text-xl font-semibold mb-4">Dashboard Registradas</h3>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse min-w-[600px]">
            <thead>
              <tr class="bg-blue-600 text-white text-sm sm:text-base">
                <th class="p-2 border">Nombre</th>
                <th class="p-2 border">Juego</th>
                <th class="p-2 border">Municipio</th>
                <th class="p-2 border">Disponibilidad</th>
                <th class="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody id="fields-tbody" class="text-sm sm:text-base"></tbody>
          </table>
        </div>
      </section>
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

  // Referencias DOM
  const fieldForm = main.querySelector("#field-form");
  const fieldIdInput = main.querySelector("#field-id");
  const fieldNameInput = main.querySelector("#field-name");
  const fieldGameSelect = main.querySelector("#field-game");
  const fieldMunicipalitySelect = main.querySelector("#field-municipality");
  const fieldAvailabilitySelect = main.querySelector("#field-availability");
  const cancelEditBtn = main.querySelector("#cancel-edit");
  const tbody = main.querySelector("#fields-tbody");

  // Variables para guardar datos traídos del backend
  let games = [];
  let municipalities = [];
  let availabilityStates = [];

  // Formato de hora legible
  const formatTime = time => time?.slice(0, 5);

  // Estados legibles
  const availabilityLabels = {
    available: "Disponible",
    not_available: "No disponible"
  };

  // Función para llenar selects
  function loadSelectOptions(select, items, valueKey, textKey) {
    select.innerHTML = items.map(item => `<option value="${item[valueKey]}">${item[textKey]}</option>`).join("");
  }

  // Cargar datos de juegos, municipios y disponibilidad desde API
  async function loadSelectData() {
    try {
      games = await Api.get("/api/games");
      municipalities = await Api.get("/api/municipalities");
      availabilityStates = await Api.get("/api/availability");

      availabilityStates = availabilityStates.map(a => ({
        id_availability: a.id_availability,
        estado: `${availabilityLabels[a.estado] || a.estado} - ${a.day_of_week} ${formatTime(a.hora_inicio)} - ${formatTime(a.hora_final)}`
      }));

      loadSelectOptions(fieldGameSelect, games, "id_game", "name_game");
      loadSelectOptions(fieldMunicipalitySelect, municipalities, "id_municipality", "name_municipality");
      loadSelectOptions(fieldAvailabilitySelect, availabilityStates, "id_availability", "estado");
    } catch (error) {
      showError("Error cargando datos para los selects");
      console.error("Error al cargar selects:", error);
    }
  }

  // Cargar canchas del propietario
  function loadFields() {
    Api.get("/api/fields_")
      .then(fields => {
        const ownerId = Number(activeUser.id_user);
        const myFields = fields.filter(f => Number(f.id_owner) === ownerId);
        renderFields(myFields);
      })
      .catch(() => {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-600">Error cargando canchas</td></tr>`;
      });
  }

  function renderFields(fields) {
    if (!fields.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center p-4">No tienes canchas registradas.</td></tr>`;
      return;
    }

    tbody.innerHTML = fields.map(field => {
      const gameName = games.find(g => g.id_game === field.id_game)?.name_game || "N/A";
      const municipalityName = municipalities.find(m => m.id_municipality === field.id_municipality)?.name_municipality || "N/A";
      const availabilityName = availabilityStates.find(a => a.id_availability === field.id_availability)?.estado || "N/A";

      return `
        <tr data-id="${field.id_field}" class="border-b hover:bg-gray-100 cursor-pointer">
          <td class="p-2 border">${field.name_field}</td>
          <td class="p-2 border">${gameName}</td>
          <td class="p-2 border">${municipalityName}</td>
          <td class="p-2 border">${availabilityName}</td>
          <td class="p-2 border text-center">
            <button class="edit-btn text-blue-600 hover:underline mr-2">Editar</button>
            <button class="delete-btn text-red-600 hover:underline">Eliminar</button>
          </td>
        </tr>
      `;
    }).join("");

    // Eventos editar
    tbody.querySelectorAll(".edit-btn").forEach(btn => {
      btn.onclick = e => {
        const id = +e.target.closest("tr").dataset.id;
        Api.get(`/api/fields_/${id}`)
          .then(field => {
            fieldIdInput.value = field.id_field;
            fieldNameInput.value = field.name_field;
            fieldGameSelect.value = field.id_game;
            fieldMunicipalitySelect.value = field.id_municipality;
            fieldAvailabilitySelect.value = field.id_availability;
            cancelEditBtn.classList.remove("hidden");
          })
          .catch(() => showError("Error al cargar cancha para editar"));
      };
    });

    // Eventos eliminar
    tbody.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = e => {
        const id = +e.target.closest("tr").dataset.id;
        if (!showConfirm("¿Eliminar esta cancha?")) return;
        Api.delete(`/api/fields_/${id}`)
          .then(res => {
            if (res.success) {
              showSuccess("Cancha eliminada");
              loadFields();
              if (fieldIdInput.value == id) cancelEditBtn.click();
            }
          })
          .catch(() => showError("Error al eliminar cancha"));
      };
    });
  }

  // Submit form (crear o actualizar)
  fieldForm.onsubmit = e => {
    e.preventDefault();

    const id = fieldIdInput.value.trim();
    const payload = {
      name_field: fieldNameInput.value.trim(),
      id_game: +fieldGameSelect.value,
      id_municipality: +fieldMunicipalitySelect.value,
      id_availability: +fieldAvailabilitySelect.value,
      id_owner: activeUser.id_user
    };

    if (!payload.name_field) {
      showError("El nombre de la cancha es obligatorio");
      return;
    }

    if (id) {
      Api.put(`/api/fields_/${id}`, payload)
        .then(res => {
          if (res.success) {
            showSuccess("Cancha actualizada");
            fieldForm.reset();
            fieldIdInput.value = "";
            cancelEditBtn.classList.add("hidden");
            loadFields();
          }
        })
        .catch(() => showError("Error al actualizar cancha"));
    } else {
      Api.post("/api/fields_", payload)
        .then(res => {
          if (res.id_field) {
            showSuccess("Cancha creada");
            fieldForm.reset();
            loadFields();
          }
        })
        .catch(() => showError("Error al crear cancha"));
    }
  };

  // Cancelar edición
  cancelEditBtn.onclick = () => {
    fieldForm.reset();
    fieldIdInput.value = "";
    cancelEditBtn.classList.add("hidden");
  };

  // Logout
  document.getElementById("log-out-user").addEventListener("click", e => {
    e.preventDefault();
    locaL.delete("active_user");
  });

  // Cargar datos iniciales
  loadSelectData().then(loadFields);
};
