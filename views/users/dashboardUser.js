import { showConfirm, showError, showSuccess } from "../../src/scripts/alerts";
import { locaL } from "../../src/scripts/LocalStorage";
import { Api } from "../../src/scripts/methodsApi";

export async function renderDashboardUser(nav, main) {
  const activeUser = locaL.get("active_user");
  if (!activeUser) {
    main.innerHTML = `<p>Please log in.</p> <a href="/skybolt/login" data-link class="btn-primary" data-link>Log in</a>`;
    return;
  }
   document.body.style.background = "white";
 // Navigation
  nav.innerHTML = `
    <header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <h1 class="text-3xl font-bold text-gray-800">
              <a href="/skybolt/home#top" class="hover:text-sky-600 transition-colors duration-200" data-link>SkyBolt</a>
            </h1>

            <nav class="hidden md:flex space-x-6">
              <a href="/skybolt/dashboarduser/profile" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Profile</a>
              <a href="/skybolt/login" id="log-out-user" data-link class="block sm:inline text-red-500 hover:text-red-700 font-semibold px-2">Log out</a>       
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
          <a href="/skybolt/dashboarduser/profile" data-link class="block sm:inline text-green-600 hover:text-green-800 font-semibold px-2">Profile</a>
          <a href="/skybolt/login" id="log-out-user" data-link class="block sm:inline text-red-500 hover:text-red-700 font-semibold px-2">Log out</a>
        </div>
      </div>
    </header>
    <!-- SPACE SO THE HEADER DOESN'T COVER THE CONTENT -->
    <div id="top" class="h-16"></div>

    `;
    document.getElementById("menu-btn").addEventListener("click", () => {
        const menu = document.getElementById("mobile-menu");
        menu.classList.toggle("hidden");
    })

// Main content
     main.innerHTML = `
    <div class="max-w-6xl ml-10">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">
        Hello, <span class="text-green-600">${activeUser.full_name}</span>
      </h2>

      <!-- Filter button -->
      <button id="openFilterBtn"
        class="mb-6 flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl shadow hover:bg-green-600 transition">
        Filter
      </button>

      <!-- Filters panel -->
      <div id="filterPanel" class="hidden bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">
        <h3 class="text-lg font-semibold mb-5 text-gray-700">Filter Fields</h3>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="block mb-2 font-medium text-gray-600">Place</label>
            <input type="text" id="placeInput" placeholder="Current address"
              class="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-600">Category</label>
            <select id="categorySelect"
              class="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Select</option>
            </select>
          </div>
        </div>

        <div class="mt-5">
          <label class="block mb-2 font-medium text-gray-600">Best time to play</label>
          <div class="flex gap-3">
            <button type="button" class="time-btn flex-1 bg-gray-100 rounded-xl py-2.5 hover:bg-green-500 hover:text-white transition" data-value="morning">Morning</button>
            <button type="button" class="time-btn flex-1 bg-gray-100 rounded-xl py-2.5 hover:bg-green-500 hover:text-white transition" data-value="afternoon">Afternoon</button>
            <button type="button" class="time-btn flex-1 bg-gray-100 rounded-xl py-2.5 hover:bg-green-500 hover:text-white transition" data-value="night">Night</button>
          </div>
        </div>

        <div class="mt-5">
          <label class="flex items-center gap-2 font-medium text-gray-600">
            <input type="checkbox" id="availabilityToggle" class="rounded" checked />
            Show only available
          </label>
        </div>

        <div class="flex gap-4 mt-6">
          <button id="cleanBtn"
            class="flex-1 bg-gray-100 text-gray-700 rounded-xl py-2.5 hover:bg-gray-200 transition">Clean</button>
          <button id="applyFilterBtn"
            class="flex-1 bg-green-500 text-white rounded-xl py-2.5 hover:bg-green-600 transition">Apply</button>
        </div>
      </div>

      <h3 class="text-2xl font-bold mb-6 text-gray-800">Fields available</h3>
      <div id="fieldsContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    </div>
  `;
  footer.innerHTML = `
      <!-- FULL FOOTER -->
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
        </div>
        <!-- COPYRIGHT -->
        <div class="text-center text-sm mt-10 text-green-300">
           © 2025 SKYBOLT. All rights reserved
        </div>
      </footer>
    `;

  let selectedTime = "";

 // SELECTABLE TIME BUTTONS
  document.querySelectorAll(".time-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
       // REMOVE ACTIVE STYLES FROM ALL TIME BUTTONS
      document.querySelectorAll(".time-btn").forEach((b) =>
        b.classList.remove("bg-green-400", "text-white")
      );
      // ADD ACTIVE STYLES TO THE CLICKED BUTTON
      btn.classList.add("bg-green-400", "text-white");
      // STORE SELECTED TIME VALUE
      selectedTime = btn.dataset.value;
    });
  });

  // LOAD DYNAMIC CATEGORIES
  const filterPanel = document.getElementById("filterPanel");
  document.getElementById("openFilterBtn").addEventListener("click", () => {
    filterPanel.classList.toggle("hidden");
  });

  // LOAD DYNAMIC CATEGORIES
  try {
    const games = await Api.get("/api/games");
    const select = document.getElementById("categorySelect");
    select.innerHTML += games
      .map((g) => `<option value="${g.id_game}">${g.name_game}</option>`)
      .join("");
  } catch (err) {
    console.error("Error loading categories:", err);
  }

  // FUNCTION TO LOAD ACTIVE USER RESERVATIONS
  async function loadUserReservations() {
    const user = locaL.get("active_user");
    try {
      const reservations = await Api.get("/api/reservations/full");
       // FILTER RESERVATIONS BELONGING TO ACTIVE USER
      return reservations.filter(r => r.id_user === user.id_user);
    } catch (err) {
      console.error("Error loading user reservations:", err);
      return [];
    }
  }

 // RENDER FIELDS WITH RESERVE/CANCEL LOGIC
  async function renderFields(fields) {
    const userReservations = await loadUserReservations();
    
// get all user reservations
  let allReservations = [];
  try {
    allReservations = await Api.get("/api/reservations/full");
  } catch (err) {
    console.error("Error cargando todas las reservas:", err);
  }
    // GAME NAME MAPPING DEPENDS ON ITS IMAGE
    const gameImages = {
    "Fútbol 5": "../img/fields/soccer.jpg",
    Basketball: "../img/fields/basket.jpeg",
    Voleibol: "../img/fields/volley.jpg",
  };

    const container = document.getElementById("fieldsContainer");
    container.innerHTML = fields.length
      ? fields
          .map((f) => {
            const imageUrl = gameImages[f.name_game] || "../img/fields/default.jpg";

            // Check if this court already has a reservation
            const existingReservation = allReservations.find(r => r.id_field === f.id_field);
            // CHECK IF USER HAS A RESERVATION ON THIS FIELD
            const reservation = userReservations.find(r => r.id_field === f.id_field);
            if (reservation) {
              // RENDER FIELD WITH CANCEL RESERVATION BUTTON
              return `
                <article class="bg-white shadow rounded-lg p-4">
                  <img src="${imageUrl}" 
                     alt="${f.name_game}" 
                     class="w-full h-40 object-cover rounded-lg mb-3"/>
                  <h3 class="font-bold text-green-600">${f.name_field}</h3>
                  <p class="text-sm text-gray-600">${f.name_game}</p>
                  <p class="text-sm text-gray-600">${f.name_municipality}, ${f.name_department}</p>
                  <p class="text-sm">Day: ${f.day_of_week} - ${f.hora_inicio} to ${f.hora_final}</p>
                  <p class="text-sm">State: ${f.estado}</p>
                  <button data-id-reserve="${reservation.id_reserve}" class="cancel-btn mt-2 w-full bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition">Cancel reservation</button>
                </article>

              `;
            } else if (existingReservation) {
            // If reserved by another user button grey and disabled
            return `
              <article class="bg-white shadow rounded-lg p-4">
                <img src="${imageUrl}" alt="${f.name_game}" class="w-full h-40 object-cover rounded-lg mb-3"/>
                <h3 class="font-bold text-gray-500">${f.name_field}</h3>
                <p class="text-sm text-gray-500">${f.name_game}</p>
                <p class="text-sm text-gray-500">${f.name_municipality}, ${f.name_department}</p>
                <p class="text-sm">Day: ${f.day_of_week} - ${f.hora_inicio} to ${f.hora_final}</p>
                <p class="text-sm">State: Reserved</p>
                <button disabled 
                        class="mt-2 w-full bg-gray-400 text-white py-1 rounded-lg cursor-not-allowed">
                  Reserved
                </button>
              </article>
            `;
            } else {
              // RENDER FIELD WITH RESERVE BUTTON
              return `
                <article class="bg-white shadow rounded-lg p-4">
                <img src="${imageUrl}" 
                     alt="${f.name_game}" 
                     class="w-full h-40 object-cover rounded-lg mb-3"/>
                  <h3 class="font-bold text-green-600">${f.name_field}</h3>
                  <p class="text-sm text-gray-600">${f.name_game}</p>
                  <p class="text-sm text-gray-600">${f.name_municipality}, ${f.name_department}</p>
                  <p class="text-sm">Day: ${f.day_of_week} - ${f.hora_inicio} to ${f.hora_final}</p>
                  <p class="text-sm">State: ${f.estado}</p>
                  <button data-id-field="${f.id_field}" data-hour-start="${f.hora_inicio}" class="reserve-btn mt-2 w-full bg-green-500 text-white py-1 rounded-lg hover:bg-green-600 transition">Reserve</button>
                </article>
              `;
            }
          })
          .join("")
      : "<p>No results found</p>";

    // RESERVE BUTTON EVENTS
    document.querySelectorAll(".reserve-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const idField = e.target.dataset.idField;
        const horaInicio = e.target.dataset.hourStart;
        const user = locaL.get("active_user");

         // BUILD CURRENT DATE + START TIME FOR reserve_schedule
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");

         // FORMAT 'YYYY-MM-DD HH:mm:ss'
        const reserve_schedule = `${yyyy}-${mm}-${dd} ${horaInicio}`;

        const payload = {
          reserve_schedule,
          id_user: user.id_user,
          id_field: idField,
        };

        try {
          // SEND RESERVATION POST REQUEST
          await Api.post("/api/reservations", payload);
          showSuccess("RESERVATION CREATED SUCCESSFULLY");
          await loadAvailableFields(); 
        } catch (err) {
          console.error("ERROR MAKING RESERVATION:", err.message);
          showError("ERROR MAKING RESERVATION ❌");
        }
      });
    });
    

    // CANCEL RESERVATION BUTTON EVENTS
    document.querySelectorAll(".cancel-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const idReserve = e.target.dataset.idReserve;
        if (!idReserve) {
          console.error("Reservation ID not found");
          return;
        }

        /*  We had to wait for the promise with the await
        /* if (!showConfirm("Are you sure you want to cancel the reservation?")) return; */
        const confirmed = await showConfirm("ARE YOU SURE YOU WANT TO CANCEL THE RESERVATION?");
        if (!confirmed) {
          console.log("The user did not want to cancel his reservation.");
          return;
        }

        try {
           // SEND DELETE REQUEST TO CANCEL RESERVATION
          await Api.delete(`/api/reservations/${idReserve}`);
          console.log("Reservation canceled ");
           // RELOAD AVAILABLE FIELDS TO UPDATE BUTTONS

          await loadAvailableFields(); 
          showSuccess("THE RESERVATION WAS SUCCESSFULLY CANCELLED");
        } catch (err) {
          console.error("Error canceling reservation:", err.message || err);
          console.log("Error canceling reservation ");
        }
        
      });
    });
  }

 // FUNCTION TO LOAD AVAILABLE FIELDS ON START AND AFTER FILTERS
  async function loadAvailableFields() {
    try {
      const fields = await Api.get("/api/availability/fields/detailed");
      // FILTER ONLY AVAILABLE FIELDS
      const availableFields = fields.filter((f) => f.estado === "available");
      await renderFields(availableFields);
    } catch (err) {
      console.error("ERROR LOADING AVAILABLE FIELDSs:", err);
      document.getElementById("fieldsContainer").innerHTML = `<p>ERROR LOADING RESULTS</p>`;
    }
  }

 // When starting the view we load the available courts
  await loadAvailableFields();

// APPLY FILTERS BUTTON EVENT
  document.getElementById("applyFilterBtn").addEventListener("click", async () => {
    const category = document.getElementById("categorySelect").value;
    const availableOnly = document.getElementById("availabilityToggle").checked;

    try {
      let fields = await Api.get("/api/availability/fields/detailed");
      // FILTER BY CATEGORY IF SELECTED
      if (category) {
        fields = fields.filter((f) => f.id_game == category);
      }
       // FILTER BY AVAILABILITY IF TOGGLED ON
      if (availableOnly) {
        fields = fields.filter((f) => f.estado === "available");
      }
      // FILTER BY SELECTED TIME IF APPLIED
      if (selectedTime) {
        const timeRanges = {
          morning: { start: "06:00:00", end: "12:00:00" },
          afternoon: { start: "12:00:01", end: "18:00:00" },
          night: { start: "18:00:01", end: "23:59:59" },
        };
        const { start, end } = timeRanges[selectedTime];
        fields = fields.filter(
          (f) => f.hora_inicio >= start && f.hora_final <= end
        );
      }
       // RENDER FILTERED FIELDS
      await renderFields(fields);
       // HIDE FILTER PANEL AFTER APPLYING FILTERS
      filterPanel.classList.add("hidden");
    } catch (err) {
      console.error(err);
      document.getElementById("fieldsContainer").innerHTML = `<p>Error loading results</p>`;
    }
  });

 // CLEAR FILTERS BUTTON EVENT
  document.getElementById("cleanBtn").addEventListener("click", () => {
     // RESET FILTER INPUTS TO DEFAULT
    document.getElementById("placeInput").value = "";
    document.getElementById("categorySelect").value = "";
    document.getElementById("availabilityToggle").checked = true;
    selectedTime = "";
    // REMOVE ACTIVE STYLES FROM TIME BUTTONS
    document.querySelectorAll(".time-btn").forEach((b) =>
      b.classList.remove("bg-green-400", "text-white")
    );
    // RELOAD AVAILABLE FIELDS WITHOUT FILTERS
    loadAvailableFields();
  });

 // LOGOUT BUTTON EVENT
  document.getElementById("log-out-user").addEventListener("click", (e) => {
  e.preventDefault();
  locaL.delete("active_user");

});

}
