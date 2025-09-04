
import { Api } from "../../src/scripts/methodsApi.js";
import { locaL } from "../../src/scripts/LocalStorage.js";
import { showSuccess, showError, showConfirm } from "../../src/scripts/alerts.js";

export let renderDashboardOwner = (ul, main) => {
  const activeUser = locaL.get("active_user");
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
        <a href="/skybolt/dashboardowner" data-link class="block sm:inline text-blue-600 hover:text-blue-800 font-semibold px-2">Dashboard</a>
        <a href="/skybolt/dashboardowner/profile" data-link class="block sm:inline text-blue-600 hover:text-blue-800 font-semibold px-2">Profile</a>
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

  main.innerHTML = `
    <section class="p-6 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold text-blue-600 mb-6">
      Hello Owner ${activeUser.full_name}
    </h2>

      <!-- Form -->
      <section id="form-section" class="mb-8 p-4 bg-gray-100 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4">Add/Edit Court</h3>
        <form id="field-form" class="grid gap-4 max-w-2xl mx-auto sm:grid-cols-2">
          <input type="hidden" id="field-id" value="" />

          <label class="flex flex-col col-span-2">
           Name of the field:
            <input
              type="text"
              id="field-name"
              required
              class="border rounded px-4 py-3 text-lg w-full"
            />
          </label>

          <label class="flex flex-col col-span-2 sm:col-span-1">
            Game:
            <select
              id="field-game"
              required
              class="border rounded px-4 py-3 text-lg w-full"
            ></select>
          </label>

          <label class="flex flex-col col-span-2 sm:col-span-1">
            Municipality:
            <select
              id="field-municipality"
              required
              class="border rounded px-4 py-3 text-lg w-full"
            ></select>
          </label>

          <label class="flex flex-col col-span-2">
           Availability:
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
             Save field
            </button>
            <button
              type="button"
              id="cancel-edit"
              class="hidden bg-gray-400 text-white px-6 py-3 text-lg rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>

      </section>

      <!-- Responsive table -->
      <section id="fields-list-section">
        <h3 class="text-xl font-semibold mb-4">Registered Dashboard</h3>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse min-w-[600px]">
            <thead>
              <tr class="bg-blue-600 text-white text-sm sm:text-base">
                <th class="p-2 border">Name</th>
                <th class="p-2 border">Game</th>
                <th class="p-2 border">Municipality</th>
                <th class="p-2 border">Availability</th>
                <th class="p-2 border">State</th>
                <th class="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody id="fields-tbody" class="text-sm sm:text-base"></tbody>
          </table>
        </div>
      </section>
    </section>

  `;
  footer.innerHTML = `
    <!-- FULL FOOTER -->
    <footer id="contact" class="bg-[#111827] text-green-100 py-10 px-6 sm:px-10 w-full mt-30">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
        <!-- DESCRIPCIÓN -->
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
      </div>
      <!-- COPYRIGHT -->
      <div class="text-center text-sm mt-10 text-green-300">
        © 2025 SKYBOLT. All rights reserved
      </div>
    </footer>
  `;

  // DOM REFERENCES
  const fieldForm = main.querySelector("#field-form");
  const fieldIdInput = main.querySelector("#field-id");
  const fieldNameInput = main.querySelector("#field-name");
  const fieldGameSelect = main.querySelector("#field-game");
  const fieldMunicipalitySelect = main.querySelector("#field-municipality");
  const fieldAvailabilitySelect = main.querySelector("#field-availability");
  const cancelEditBtn = main.querySelector("#cancel-edit");
  const tbody = main.querySelector("#fields-tbody");

  // VARIABLES TO STORE DATA FETCHED FROM BACKEND
  let games = [];
  let municipalities = [];
  let availabilityStates = [];

  // FUNCTION TO FORMAT TIME TO A READABLE FORMAT
  const formatTime = time => time?.slice(0, 5);

  // READABLE LABELS FOR AVAILABILITY STATES
  const availabilityLabels = {
    available: "Available",
    not_available: "Not available"
  };

  // ASYNC FUNCTION TO LOAD DATA FOR GAMES, MUNICIPALITIES AND AVAILABILITY FROM API
  function loadSelectOptions(select, items, valueKey, textKey) {
    select.innerHTML = items.map(item => `<option value="${item[valueKey]}">${item[textKey]}</option>`).join("");
  }

// ASYNC FUNCTION TO LOAD DATA FOR GAMES, MUNICIPALITIES AND AVAILABILITY FROM API
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
      showError("Error loading data for selects");
      console.error("Error loading selects:", error);
    }
  }

  // FUNCTION TO LOAD OWNER'S FIELDS FROM API
  function loadFields() {
   // Make two requests simultaneously
    Promise.all([
      Api.get("/api/fields_"),
      Api.get("/api/reservations/full")
    ])
      .then(([fields, reservations]) => {
        const ownerId = Number(activeUser.id_user); // Get the current owner's ID
        const myFields = fields.filter(f => Number(f.id_owner) === ownerId); // Filter only the courts that belong to this owner
        renderFields(myFields, reservations); // Call renderFields with the filtered courts and all reservations
      })
      .catch(() => {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-600">Error loading fields</td></tr>`;
      });
  }

  // FUNCTION TO RENDER THE FIELDS TABLE
  function renderFields(fields, reservations) {
  if (!fields.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center p-4">You have no registered fields</td></tr>`;
    return;
  }

  tbody.innerHTML = fields.map(field => {
    const gameName = games.find(g => g.id_game === field.id_game)?.name_game || "N/A"; // Find and get the name of the associated game
    const municipalityName = municipalities.find(m => m.id_municipality === field.id_municipality)?.name_municipality || "N/A"; // search and get the name of the municipality
    const availabilityName = availabilityStates.find(a => a.id_availability === field.id_availability)?.estado || "N/A"; // Search and get the availability status

    const isReserved = reservations.some(r => r.id_field === field.id_field); 
    const estado = isReserved ? "Reserved" : "Unreserved"; // Defines the state text ("Reserved" or "Unreserved")

    const estadoClass = isReserved ? "text-red-600" : "text-green-600";

    return `
      <tr data-id="${field.id_field}" class="border-b hover:bg-gray-100 cursor-pointer">
        <td class="p-2 border">${field.name_field}</td>
        <td class="p-2 border">${gameName}</td>
        <td class="p-2 border">${municipalityName}</td>
        <td class="p-2 border">${availabilityName} </td>
        <td class="p-2 border ${estadoClass}">${estado}</td>
        <td class="p-2 border text-center">
          <button class="edit-btn text-blue-600 hover:underline mr-2">✏️</button>
          <button class="delete-btn text-red-600 hover:underline">🗑️</button>
        </td>
      </tr>
    `;
  }).join("");


    // ADD EVENT LISTENERS FOR EDIT BUTTONS
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
          .catch(() => showError("Error loading field for editing"));
      };
    });

     // ADD EVENT LISTENERS FOR DELETE BUTTONS
    tbody.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = async e => {
        const id = +e.target.closest("tr").dataset.id;

        // Wait for user confirmation
        const confirmed = await showConfirm("Delete this field?");
        if (!confirmed) return;

        try {
          const res = await Api.delete(`/api/fields_/${id}`);
          if (res.success) {
            showSuccess("Field eliminated");
            loadFields();
            if (fieldIdInput.value == id) cancelEditBtn.click();
          }
        } catch (err) {
          showError("Error deleting field");
        }
      };
    });

  }

 // FORM SUBMIT HANDLER FOR CREATING OR UPDATING A FIELD
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
      showError("The name of the field is mandatory");
      return;
    }

    if (id) {
      Api.put(`/api/fields_/${id}`, payload)
        .then(res => {
          if (res.success) {
            showSuccess("Updated field");
            fieldForm.reset();
            fieldIdInput.value = "";
            cancelEditBtn.classList.add("hidden");
            loadFields();
          }
        })
        .catch(() => showError("Error updating field"));
    } else {
      Api.post("/api/fields_", payload)
        .then(res => {
          if (res.id_field) {
            showSuccess("Field created");
            fieldForm.reset();
            loadFields();
          }
        })
        .catch(() => showError("Error creating field"));
    }
  };

  // CANCEL EDIT BUTTON HANDLER TO RESET FORM AND HIDE BUTTON
  cancelEditBtn.onclick = () => {
    fieldForm.reset();
    fieldIdInput.value = "";
    cancelEditBtn.classList.add("hidden");
  };

  // LOGOUT BUTTON HANDLER TO DELETE ACTIVE USER AND REDIRECT TO LOGIN
  document.querySelectorAll(".log-out-user").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      locaL.delete("active_user");

      // Redirect manually
      window.history.pushState(null, null, "/skybolt/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  });


  // INITIAL LOAD OF SELECT DATA AND FIELDS
  loadSelectData().then(loadFields);
};
