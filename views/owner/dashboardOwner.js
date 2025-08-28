// import { locaL } from "../../src/scripts/LocalStorage"

// export let renderDashboardOwner = (ul, main) => {

//     // nav.innerHTML = `
//     // <img src="./img/skybolt.webp" alt="Skybolt Logo">
//     // `
//     ul.innerHTML = `
//     <a href="/skybolt/dashboardadmin/users" data-link>Users</a>
//     <a href="/skybolt/dashboardadmin/owners" data-link>Owners</a>
//     <a href="/skybolt/login" id="log-out-user" data-link>Log out</a>
//     `
//     main.innerHTML = `
//     <h2>Hola Admin ${locaL.get('active_user').full_name}</h2>
//     `
//     document.getElementById('log-out-user').addEventListener('click', (e) => {
//         e.preventDefault();
//         locaL.delete('active_user');
//     })
// }

import { Api } from "../../src/scripts/methodsApi.js";
import { locaL } from "../../src/scripts/LocalStorage.js";

export let renderDashboardOwner = (ul, main) => {
  const activeUser = locaL.get("active_user");
  if (!activeUser) {
    main.innerHTML = `<p>Por favor inicia sesión.</p>`;
    return;
  }

  // Navbar
  ul.innerHTML = `
    <a href="/skybolt/dashboardowner/fields" data-link class="text-blue-600 hover:text-blue-800 font-semibold">Mis Canchas</a>
    <a href="/skybolt/dashboardowner/profile" data-link class="text-blue-600 hover:text-blue-800 font-semibold">Perfil</a>
    <a href="/skybolt/login" id="log-out-user" data-link class="text-red-500 hover:text-red-700 font-semibold ml-auto">Cerrar sesión</a>
  `;

  main.innerHTML = `
    <section class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-blue-600 mb-6">Hola Propietario ${activeUser.full_name}</h2>

      <section id="form-section" class="mb-8 p-4 bg-gray-100 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4">Agregar / Editar Cancha</h3>
        <form id="field-form" class="flex flex-col gap-4 max-w-md">
          <input type="hidden" id="field-id" value="" />
          
          <label class="flex flex-col">
            Nombre de la cancha:
            <input type="text" id="field-name" required class="border rounded px-3 py-2" />
          </label>

          <label class="flex flex-col">
            Juego:
            <select id="field-game" required class="border rounded px-3 py-2"></select>
          </label>

          <label class="flex flex-col">
            Municipio:
            <select id="field-municipality" required class="border rounded px-3 py-2"></select>
          </label>

          <label class="flex flex-col">
            Disponibilidad:
            <select id="field-availability" required class="border rounded px-3 py-2"></select>
          </label>

          <div class="flex gap-4">
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar cancha</button>
            <button type="button" id="cancel-edit" class="hidden bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
          </div>
        </form>
      </section>

      <section id="fields-list-section">
        <h3 class="text-xl font-semibold mb-4">Mis Canchas Registradas</h3>
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-blue-600 text-white">
              <th class="p-2 border">Nombre</th>
              <th class="p-2 border">Juego</th>
              <th class="p-2 border">Municipio</th>
              <th class="p-2 border">Disponibilidad</th>
              <th class="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody id="fields-tbody"></tbody>
        </table>
      </section>
    </section>
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

  // Función para llenar selects
  function loadSelectOptions(select, items, valueKey, textKey) {
    select.innerHTML = items.map(item => `<option value="${item[valueKey]}">${item[textKey]}</option>`).join("");
  }

  // Mapeo para mostrar en frontend estados de disponibilidad legibles
  const availabilityLabels = {
    available: "Disponible",
    not_available: "No disponible"
  };

  // Cargar datos de juegos, municipios y disponibilidad desde API
  async function loadSelectData() {
    try {
      // Carga juegos

      console.log("esta cargando la data ")
      games = await Api.get("/api/games");
      console.log("Juegos cargados:", games);

      // Carga municipios
      municipalities = await Api.get("/api/municipalities");
      console.log("Municipios cargados:", municipalities);

      // Carga disponibilidad
      availabilityStates = await Api.get("/api/availability");
      console.log("Disponibilidad cargada:", availabilityStates);

      // Ajustar estados legibles para disponibilidad
      // availabilityStates = availabilityStates.map(a => ({
      //   id_availability: a.id_availability,
      //   estado: availabilityLabels[a.estado] || a.estado
      // }));

      availabilityStates = availabilityStates.map(a => ({
        id_availability: a.id_availability,
        estado: `${availabilityLabels[a.estado] || a.estado} - ${a.day_of_week} ${a.hora_inicio} - ${a.hora_final}`
      }));


      // Cargar selects
      loadSelectOptions(fieldGameSelect, games, "id_game", "name_game");
      loadSelectOptions(fieldMunicipalitySelect, municipalities, "id_municipality", "name_municipality");
      loadSelectOptions(fieldAvailabilitySelect, availabilityStates, "id_availability", "estado");

    } catch (error) {
      alert("Error cargando datos para los selects");
      console.error("Error al cargar selects:", error);
    }
  }

  // Funciones CRUD usando Api para canchas
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

      // Para disponibilidad buscamos el objeto original para obtener el estado "available"/"not_available"
      // y luego mostramos la versión amigable ya en availabilityStates
      const availabilityObj = availabilityStates.find(a => a.id_availability === field.id_availability);
      const availabilityName = availabilityObj ? availabilityObj.estado : "N/A";

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
          .catch(() => alert("Error al cargar cancha para editar"));
      };
    });

    // Eventos eliminar
    tbody.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = e => {
        const id = +e.target.closest("tr").dataset.id;
        if (!confirm("¿Eliminar esta cancha?")) return;
        Api.delete(`/api/fields_/${id}`)
          .then(res => {
            if (res.success) {
              alert("Cancha eliminada");
              loadFields();
              // Limpiar formulario si editando esa cancha
              if (fieldIdInput.value == id) cancelEditBtn.click();
            }
          })
          .catch(() => alert("Error al eliminar cancha"));
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
      alert("El nombre de la cancha es obligatorio");
      return;
    }

    if (id) {
      Api.put(`/api/fields_/${id}`, payload)
        .then(res => {
          if (res.success) {
            alert("Cancha actualizada");
            fieldForm.reset();
            fieldIdInput.value = "";
            cancelEditBtn.classList.add("hidden");
            loadFields();
          }
        })
        .catch(() => alert("Error al actualizar cancha"));
    } else {
      Api.post("/api/fields_", payload)
        .then(res => {
          if (res.id_field) {
            alert("Cancha creada");
            fieldForm.reset();
            loadFields();
          }
        })
        .catch(() => alert("Error al crear cancha"));
    }
  };

  cancelEditBtn.onclick = () => {
    fieldForm.reset();
    fieldIdInput.value = "";
    cancelEditBtn.classList.add("hidden");
  };

  // Logout
  document.getElementById("log-out-user").addEventListener("click", e => {
    e.preventDefault();
    locaL.delete("active_user");
    window.location.href = "/skybolt/login";
  });

  // Cargar selects y canchas
  loadSelectData().then(loadFields);
};
