import { locaL } from "../../src/scripts/LocalStorage"
import { Api } from "../../src/scripts/methodsApi"

export let renderDashboardAdminFields = (ul, main) => {
     document.body.style.background = "white";

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

    main.innerHTML = `
        <section class="p-6 sm:p-6">
            <h2 class="text-lg sm:text-2xl font-bold text-green-600 mb-4 text-center sm:text-left">
                Hello ${locaL.get("active_user").full_name}, you are editing fields
            </h2>

            <input type="text" id="field-search" placeholder="Search by field name..."
                class="w-full max-w-xs mb-4 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"/>
            <select id="field-status-filter" class="w-full max-w-xs mb-4 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base ml-2">
                <option value="">All statuses</option>
                <option value="available">Available</option>
                <option value="not_available">Not available</option>
            </select>
            <!-- Tabla -->
            <div id="fields-list-section" class="overflow-x-auto">
                <h3 class="text-xl font-semibold mb-4">Courts of all owners</h3>
                <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead class="bg-green-500 text-white">
                        <tr>
                            <th class="px-4 py-2 text-left">Name</th>
                            <th class="px-4 py-2 text-left">Type of game</th>
                            <th class="px-4 py-2 text-left">Municipality</th>
                            <th class="px-4 py-2 text-left">Availability</th>
                            <th class="px-4 py-2 text-center">Owner</th>
                            <th class="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="fields-tbody"></tbody>
                </table>
            </div>
        



            <div id="edit-field-form-container"
                class="fixed inset-0 bg-black/50 hidden flex items-center justify-center z-50 backdrop-blur-sm p-4">
                <div class="bg-white p-4 rounded-lg shadow-md w-full max-w-sm sm:max-w-lg md:max-w-2xl mx-auto max-h-[90vh] overflow-y-auto sm:max-h-none sm:overflow-visible">
                    <h3 class="text-2xl sm:text-3xl font-bold text-green-600 mb-4 text-center">
                        Edit Field
                    </h3>
                    <form id="admin-edit-field-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                        <input type="hidden" id="edit-field-id" />
                        <input type="text" id="edit-field-name" placeholder="Name"
                            class="col-span-1 sm:col-span-2 w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" required />
                        <select id="edit-field-game"
                            class="w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" required>
                        </select>
                        <select id="edit-field-municipality"
                            class="w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" required>
                        </select>
                        <select id="edit-field-availability"
                            class="col-span-1 sm:col-span-2 w-full px-4 py-3 rounded-md bg-gray-200 focus:ring-2 focus:ring-green-300" required>
                        </select>
                        <div class="flex flex-col sm:flex-row justify-end gap-3 mt-4 col-span-1 sm:col-span-2">
                            <button type="submit"
                                class="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                                Save
                            </button>
                            <button type="button" id="cancel-edit-admin"
                                class="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                                Cancel
                            </button>
                        </div>
                    </form>
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

    const tbody = main.querySelector("#fields-tbody");
    const editFormContainer = main.querySelector("#edit-form-container");

    let games = [];
    let municipalities = [];
    let availabilityStates = [];
    let owners = [];
    let allFields = [];
    let allReservations = [];
    let filterFieldName = "";
    let filterStatus = "";

    const formatTime = time => time?.slice(0, 5);

    const availabilityLabels = {
        available: "Available",
        not_available: "Not available"
    };

    function loadSelectData() {
        return Promise.all([
            Api.get("/api/games"),
            Api.get("/api/municipalities"),
            Api.get("/api/availability"),
            Api.get("/api/users?role=owner") 
        ]).then(([gamesData, municipalitiesData, availabilityData, ownersData]) => {
            games = gamesData;
            municipalities = municipalitiesData;
            availabilityStates = availabilityData.map(a => ({
                id_availability: a.id_availability,
                estado: `${availabilityLabels[a.estado] || a.estado} - ${a.day_of_week} ${formatTime(a.hora_inicio)} - ${formatTime(a.hora_final)}`
            }));
            owners = ownersData;
        });
    }

    function loadFields() {
        Promise.all([
            Api.get("/api/fields_"),
            Api.get("/api/reservations")
        ])
        .then(([fields, reservations]) => {
            allFields = fields;
            allReservations = reservations;
            renderFields(fields, reservations);
        })
        .catch(() => {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center p-4 text-red-600">Error loading fields</td></tr>`;
        });
    }

    function renderFields(fields, reservations) {
        // Filtrado por nombre y estado
        let filteredFields = fields.filter(field => {
            // Filtro por nombre
            const matchesName = filterFieldName === "" || field.name_field.toLowerCase().includes(filterFieldName.toLowerCase());
            // Filtro por estado
            const hasActiveReservation = reservations.some(r => r.id_field === field.id_field && r.estado === "active");
            let status = hasActiveReservation ? "not_available" : "available";
            const matchesStatus = filterStatus === "" || filterStatus === status;
            return matchesName && matchesStatus;
        });

        if (!filteredFields.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">No fields found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filteredFields.map(field => {
            const gameName = games.find(g => g.id_game === field.id_game)?.name_game || "N/A";
            const municipalityName = municipalities.find(m => m.id_municipality === field.id_municipality)?.name_municipality || "N/A";
            const ownerName = owners.find(o => o.id_user === field.id_owner)?.full_name || "N/A";
            const hasActiveReservation = reservations.some(r => r.id_field === field.id_field && r.estado === "active");
            const availabilityName = hasActiveReservation
                ? `<span class="text-red-600 font-bold">Not available</span>`
                : `<span class="text-green-600 font-bold">Available</span>`;

            return `
                <tr data-id="${field.id_field}" class="border-b hover:bg-gray-100 cursor-pointer">
                    <td class="p-2 border">${field.name_field}</td>
                    <td class="p-2 border">${gameName}</td>
                    <td class="p-2 border">${municipalityName}</td>
                    <td class="p-2 border">${availabilityName}</td>
                    <td class="p-2 border">${ownerName}</td>
                    <td class="p-2 border text-center">
                        <button class="btn-edit bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition">✏️</button>
                        <button class="btn-delete bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">🗑️</button>
                    </td>
                </tr>
        `;
        }).join("");

        main.querySelector("#field-search").addEventListener("input", (e) => {
            filterFieldName = e.target.value.trim();
            renderFields(allFields, allReservations);
        });
        main.querySelector("#field-status-filter").addEventListener("change", (e) => {
            filterStatus = e.target.value;
            renderFields(allFields, allReservations);
        });

        // Eventos editar
        tbody.querySelectorAll(".btn-edit").forEach(btn => {
            btn.onclick = e => {
                const id = +e.target.closest("tr").dataset.id;
                Api.get(`/api/fields_/${id}`)
                .then(field => {
                    showEditForm(field);
                })
                .catch(() => alert("Error loading field for editing"));
            };
        });        

    }

    //eliminar canchas
    tbody.onclick = function(e) {
        if (e.target.classList.contains("btn-delete")) {
            const id = +e.target.closest("tr").dataset.id;
            if (!confirm("Delete this field?")) return;
            Api.delete(`/api/fields_/${id}`)
                .then(() => {
                    alert("Field eliminated");
                    loadFields();
                   
                    const modal = document.getElementById("edit-field-form-container");
                    if (modal) {
                        modal.classList.add("hidden");
                        modal.classList.remove("flex");
                    }
                })
                .catch(() => alert("Error deleting field"));
        }
    };

    function showEditForm(field) {
        // Llenamos los selects con las opciones actuales
        const gameOptions = games.map(g => `<option value="${g.id_game}" ${g.id_game === field.id_game ? "selected" : ""}>${g.name_game}</option>`).join("");
        const municipalityOptions = municipalities.map(m => `<option value="${m.id_municipality}" ${m.id_municipality === field.id_municipality ? "selected" : ""}>${m.name_municipality}</option>`).join("");
        const availabilityOptions = availabilityStates.map(a => `<option value="${a.id_availability}" ${a.id_availability === field.id_availability ? "selected" : ""}>${a.estado}</option>`).join("");

        // Muestra el modal
        const modal = document.getElementById("edit-field-form-container");
        modal.classList.remove("hidden");
        modal.classList.add("flex");

        // Llena los campos
        document.getElementById("edit-field-id").value = field.id_field;
        document.getElementById("edit-field-name").value = field.name_field;
        document.getElementById("edit-field-game").innerHTML = gameOptions;
        document.getElementById("edit-field-municipality").innerHTML = municipalityOptions;
        document.getElementById("edit-field-availability").innerHTML = availabilityOptions;

        // Evento submit para editar
        const editForm = document.getElementById("admin-edit-field-form");
        editForm.onsubmit = e => {
            e.preventDefault();
            const payload = {
                name_field: document.getElementById("edit-field-name").value.trim(),
                id_game: +document.getElementById("edit-field-game").value,
                id_municipality: +document.getElementById("edit-field-municipality").value,
                id_availability: +document.getElementById("edit-field-availability").value,
                id_owner: field.id_owner
            };
            Api.put(`/api/fields_/${field.id_field}`, payload)
                .then(res => {
                    if (res.success) {
                        alert("Updated field");
                        modal.classList.add("hidden");
                        modal.classList.remove("flex");
                        loadFields();
                    }
                })
            .catch(() => alert("Error updating field"));
        };

        // Evento cancelar edición
        document.getElementById("cancel-edit-admin").onclick = () => {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        };
    }

    document.getElementById('log-out-user').addEventListener('click', (e) => {
        e.preventDefault();
        locaL.delete('active_user');
        window.location.href = "/skybolt/login";
    });

    loadSelectData().then(loadFields);
}