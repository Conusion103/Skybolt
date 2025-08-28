import { locaL } from "../../src/scripts/LocalStorage";
import { Api } from "../../src/scripts/methodsApi";

export function renderDashboardUser(nav, main) {
    // Navegación
    nav.innerHTML = `
    <a href="/skybolt/dashboarduser/profile" data-link class="text-green-600 font-semibold">Profile</a>
    <a href="/skybolt/login" id="log-out-user" data-link class="ml-4 text-red-500">Log out</a>
  `;

    // Contenido principal
    main.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Hola ${locaL.get("active_user").full_name}</h2>

    <button id="openFilterBtn" class="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Filtrar</button>

    <div id="filterPanel" class="hidden bg-gray-50 p-4 rounded-xl shadow-md mb-6">
      <h3 class="text-lg font-semibold mb-3">Filtrar Canchas</h3>

      <label class="block mb-2 font-medium">Lugar</label>
      <input type="text" id="placeInput" placeholder="Dirección actual"
        class="w-full p-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-400" />

      <label class="block mb-2 font-medium">Categoría</label>
      <select id="categorySelect"
        class="w-full p-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-400">
        <option value="">Seleccione</option>
      </select>

      <label class="block mb-2 font-medium">Mejor hora para jugar</label>
      <div class="flex gap-2 mb-3">
        <button type="button" class="time-btn flex-1 bg-gray-200 rounded-lg py-2 hover:bg-green-400 hover:text-white transition" data-value="morning">Mañana</button>
        <button type="button" class="time-btn flex-1 bg-gray-200 rounded-lg py-2 hover:bg-green-400 hover:text-white transition" data-value="afternoon">Tarde</button>
        <button type="button" class="time-btn flex-1 bg-gray-200 rounded-lg py-2 hover:bg-green-400 hover:text-white transition" data-value="night">Noche</button>
      </div>

      <label class="block mb-2 font-medium">Disponibilidad</label>
      <input type="checkbox" id="availabilityToggle" class="mb-4" checked />

      <div class="flex gap-3">
        <button id="cleanBtn" class="flex-1 bg-gray-200 rounded-lg py-2 hover:bg-gray-300 transition">Limpiar</button>
        <button id="applyFilterBtn" class="flex-1 bg-green-500 text-white rounded-lg py-2 hover:bg-green-600 transition">Aplicar</button>
      </div>
    </div>

    <h3 class="text-lg font-semibold mb-2">Canchas disponibles</h3>
    <div id="fieldsContainer" class="grid gap-4"></div>
  `;

    let selectedTime = "";

    // Botones de hora seleccionable
    document.querySelectorAll(".time-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".time-btn").forEach((b) =>
                b.classList.remove("bg-green-400", "text-white")
            );
            btn.classList.add("bg-green-400", "text-white");
            selectedTime = btn.dataset.value;
        });
    });

    // Mostrar/ocultar panel de filtros
    const filterPanel = document.getElementById("filterPanel");
    document.getElementById("openFilterBtn").addEventListener("click", () => {
        filterPanel.classList.toggle("hidden");
    });

    // Cargar categorías dinámicas
    Api.get("/api/games")
        .then((games) => {
            const select = document.getElementById("categorySelect");
            select.innerHTML += games
                .map((g) => `<option value="${g.id_game}">${g.name_game}</option>`)
                .join("");
        })
        .catch(console.error);

    // Función para renderizar canchas
    function renderFields(fields) {
        const container = document.getElementById("fieldsContainer");
        container.innerHTML = fields.length
            ? fields
                .map(
                    (f) => `
              <article class="bg-white shadow rounded-lg p-4">
                <h3 class="font-bold text-green-600">${f.field_name}</h3>
                <p class="text-sm text-gray-600">${f.municipality_name}, ${f.department_name}</p>
                <p class="text-sm">Día: ${f.day_of_week} - ${f.hora_inicio} a ${f.hora_final}</p>
                <p class="text-sm">Estado: ${f.estado}</p>
                <p class="text-sm">Reservas: ${f.num_reservations}</p>
                <button data-id="${f.id_field || ""}"
                  class="mt-2 w-full bg-green-500 text-white py-1 rounded-lg hover:bg-green-600 transition">Reservar</button>
              </article>
            `
                )
                .join("")
            : "<p>No se encontraron resultados</p>";
    }

    // // Cargar canchas inicialmente
    // Api.get("/api/fields/disponibilidad")
    //     .then((fields) => renderFields(fields))
    //     .catch((err) => {
    //         console.error(err);
    //         main.innerHTML += `<p>Error cargando canchas</p>`;
    //     });

    // Aplicar filtros
    document.getElementById("applyFilterBtn").addEventListener("click", () => {
        const category = document.getElementById("categorySelect").value;
        const availableOnly = document.getElementById("availabilityToggle").checked;

        Api.get("/api/fields/disponibilidad")
            .then((fields) => {
                let filtered = fields;

                if (category) filtered = filtered.filter((f) => f.id_game == category);
                if (availableOnly) filtered = filtered.filter((f) => f.estado === "available");

                if (selectedTime) {
                    const timeRanges = {
                        morning: { start: "06:00:00", end: "12:00:00" },
                        afternoon: { start: "12:00:01", end: "18:00:00" },
                        night: { start: "18:00:01", end: "23:59:59" }
                    };
                    const { start, end } = timeRanges[selectedTime];
                    filtered = filtered.filter(
                        (f) => f.hora_inicio >= start && f.hora_final <= end
                    );
                }

                renderFields(filtered);
                filterPanel.classList.add("hidden");
            })
            .catch((err) => {
                console.error(err);
                document.getElementById("fieldsContainer").innerHTML = `<p>Error cargando resultados</p>`;
            });
    });

    // Limpiar filtros
    document.getElementById("cleanBtn").addEventListener("click", () => {
        document.getElementById("placeInput").value = "";
        document.getElementById("categorySelect").value = "";
        document.getElementById("availabilityToggle").checked = true;
        selectedTime = "";
        document.querySelectorAll(".time-btn").forEach((b) =>
            b.classList.remove("bg-green-400", "text-white")
        );
    });

    // Logout
    document.getElementById("log-out-user").addEventListener("click", (e) => {
        e.preventDefault();
        locaL.delete("active_user");
        history.pushState(null, null, "/skybolt/login");
    });
}
