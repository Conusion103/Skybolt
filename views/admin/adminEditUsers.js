import { locaL } from "../../src/scripts/LocalStorage";
import { Api } from "../../src/scripts/methodsApi";
import { departamentos } from "../register";
import { generalFormat } from "../../src/scripts/validationMethods";

export let renderDashboardAdminEditUsers = (ul, main) => {
    // Menu
    ul.innerHTML = `
        
        <a href="/skybolt/dashboardadmin/fields" data-link class="text-green-600 hover:text-green-800 font-semibold">Fields</a>
        <a href="/skybolt/dashboardadmin/owners" data-link class="text-green-600 hover:text-green-800 font-semibold">Owners</a>
        <a href="/skybolt/dashboardadmin/request" data-link class="text-green-600 hover:text-green-800 font-semibold">Requests</a>
        <a href="/skybolt/login" id="log-out-user" data-link class="text-red-500 hover:text-red-700 font-semibold">Log out</a>
    `;

    main.innerHTML = `
        <section class="p-6">
            <h2 class="text-2xl font-bold text-green-600 mb-4">
                Hola Admin, estás editando usuarios: ${locaL.get('active_user').full_name}
            </h2>

            <input type="text" id="user-search" placeholder="Buscar por correo..."
                class="w-full max-w-md mb-6 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"/>

            <div id="edit-user-form-container" style="display:none;" class="bg-white border border-gray-200 shadow-md p-6 mb-6 rounded-xl max-w-xl">
                <h3 class="text-xl font-semibold text-green-500 mb-4">Editar Usuario</h3>
                <form id="edit-user-form" class="space-y-4">
                    <input type="hidden" id="edit-user-id" />
                    <input type="text" id="edit-full_name" placeholder="Full Name" class="input" />
                    <input type="email" id="edit-email" placeholder="Email" class="input" />
                    <input type="text" id="edit-phone" placeholder="Phone" class="input" />
                    <input type="date" id="edit-birthdate" class="input" />
                    <input type="text" id="edit-document_type" placeholder="Document Type" class="input" />
                    <input type="text" id="edit-id_document" placeholder="ID Document" class="input" />
                    <select id="edit-id_department" class="input">
                        <option value="">Selecciona un departamento</option>
                        ${departamentos.map(dep => `<option value="${dep.id}">${dep.name}</option>`).join('')}
                    </select>
                    <select id="edit-id_municipality" class="input">
                        <option value="">Selecciona un municipio</option>
                    </select>
                    <input type="text" id="edit-rol" placeholder="Role" class="input" />
                    <input type="password" id="edit-password_" placeholder="New Password (optional)" class="input" />
                    <div class="flex gap-4">
                        <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Guardar</button>
                        <button type="button" id="cancel-edit" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">Cancelar</button>
                    </div>
                </form>
            </div>

            <section id="user-section" class="grid gap-4"></section>
        </section>
    `;

    // Log out
    document.getElementById("log-out-user").addEventListener("click", (e) => {
        e.preventDefault();
        locaL.delete("active_user");
    });

    let usersList = [];

    // Cargar usuarios
    Api.get("/api/users").then((data) => {
        usersList = data;
        renderUsers(data);
    });

    const renderUsers = (data) => {
        const section = document.getElementById("user-section");
        section.innerHTML = "";

        data.forEach((user) => {
            if (user.rol === "user") {
                const depName = getDepartmentName(user.id_department);
                const munName = getMunicipalityName(user.id_department, user.id_municipality);

                const $article = document.createElement("article");
                $article.classList.add(
                    "bg-white", "rounded-xl", "shadow-md", "p-4", "border", "border-gray-200", "space-y-2"
                );
                $article.innerHTML = `
                    <h2 class="text-lg font-bold text-gray-800">Nombre: ${user.full_name} <span class="text-sm text-gray-500">ID: ${user.id_user}</span></h2>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Teléfono:</strong> ${user.phone}</p>
                    <p><strong>Cumpleaños:</strong> ${formatDateForDisplay(user.birthdate)}</p>
                    <p><strong>${user.document_type}:</strong> ${user.id_document}</p>
                    <p><strong>Ubicación:</strong> ${depName} - ${munName}</p>
                    <p><strong>Rol:</strong> ${user.rol}</p>
                    <div class="flex gap-3 pt-2">
                        <button class="btn-delete px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition" data-id="${user.id_user}">Eliminar</button>
                        <button class="btn-edit px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition" data-id="${user.id_user}">Editar</button>
                    </div>
                `;
                section.appendChild($article);
            }
        });
    };

    // Filtro por correo
    document.getElementById("user-search").addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = usersList.filter(u => u.email.toLowerCase().includes(searchTerm));
        renderUsers(filtered);
    });

    // Cambiar departamento -> cargar municipios
    document.getElementById("edit-id_department").addEventListener("change", (e) => {
        loadMunicipalities(Number(e.target.value));
    });

    // Click en usuario: editar o eliminar
    document.getElementById("user-section").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-delete")) {
            const userID = Number(e.target.getAttribute("data-id"));
            if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

            Api.delete(`/api/users/${userID}`)
                .then(() => {
                    usersList = usersList.filter(u => u.id_user !== userID);
                    renderUsers(usersList);
                    alert("Usuario eliminado exitosamente");
                })
                .catch(err => alert(err.message));
        }

        if (e.target.classList.contains("btn-edit")) {
            const userID = Number(e.target.getAttribute("data-id"));
            const userData = usersList.find(u => u.id_user === userID);
            if (!userData) return;

            // Llenar formulario
            document.getElementById("edit-user-id").value = userData.id_user;
            document.getElementById("edit-full_name").value = userData.full_name;
            document.getElementById("edit-email").value = userData.email;
            document.getElementById("edit-phone").value = userData.phone || "";
            document.getElementById("edit-birthdate").value = formatDateForInput(formatDateForDisplay(userData.birthdate));
            document.getElementById("edit-document_type").value = userData.document_type;
            document.getElementById("edit-id_document").value = userData.id_document;
            document.getElementById("edit-id_department").value = userData.id_department;
            loadMunicipalities(userData.id_department);
            document.getElementById("edit-id_municipality").value = userData.id_municipality;
            document.getElementById("edit-rol").value = userData.rol;
            document.getElementById("edit-password_").value = userData.password_;

            document.getElementById("edit-user-form-container").style.display = "block";
        }
    });

    // Cancelar edición
    document.getElementById("cancel-edit").addEventListener("click", () => {
        document.getElementById("edit-user-form").reset();
        document.getElementById("edit-user-id").value = "";
        document.getElementById("edit-user-form-container").style.display = "none";
    });

    // Submit edición
    document.getElementById("edit-user-form").addEventListener("submit", (e) => {
        e.preventDefault();

        try {
            const userID = Number(document.getElementById("edit-user-id").value);
            const id_department = Number(document.getElementById("edit-id_department").value);
            const id_municipality = Number(document.getElementById("edit-id_municipality").value);

            const dep = departamentos.find(d => d.id === id_department);
            if (!dep || !dep.municipios.some(m => m.id === id_municipality)) {
                alert("Departamento o municipio inválido");
                return;
            }

            const updatedUser = {
                full_name: generalFormat.nameFormat(document.getElementById("edit-full_name").value.trim()),
                email: generalFormat.hotmailFormat(document.getElementById("edit-email").value.trim()),
                phone: generalFormat.phoneNumber(document.getElementById("edit-phone").value.trim()),
                birthdate: generalFormat.birthdate(document.getElementById("edit-birthdate").value),
                document_type: generalFormat.documenttypeFormat(document.getElementById("edit-document_type").value.trim()),
                id_document: generalFormat.identicationFormat(document.getElementById("edit-id_document").value.trim()),
                id_department: generalFormat.departamentFormat(id_department),
                id_municipality: generalFormat.townFormat(id_municipality),
                rol: document.getElementById("edit-rol").value.trim()
            };

            const newPassword = document.getElementById("edit-password_").value;
            if (newPassword && newPassword !== usersList.find(u => u.id_user === userID).password_) {
                updatedUser.password_ = newPassword; // Solo cambiar si es distinto
            }
            console.table(updatedUser);

            Api.put(`/api/users/${userID}`, updatedUser)
                .then(() => {
                    alert("Usuario actualizado correctamente");
                    document.getElementById("edit-user-form-container").style.display = "none";
                    Api.get("/api/users").then((data) => {
                        usersList = data;
                        renderUsers(usersList);
                    });
                })
                .catch(err => alert(err.message));
        } catch (err) {
            alert(err.message);
        }
    });

    // Helpers
    const getDepartmentName = (id) => {
        const dep = departamentos.find(d => d.id === Number(id));
        return dep ? dep.name : "Desconocido";
    };
    const getMunicipalityName = (depId, muniId) => {
        const dep = departamentos.find(d => d.id === Number(depId));
        if (!dep) return "Desconocido";
        const muni = dep.municipios.find(m => m.id === Number(muniId));
        return muni ? muni.name : "Desconocido";
    };
    const loadMunicipalities = (depId) => {
        const select = document.getElementById("edit-id_municipality");
        select.innerHTML = '<option value="">Selecciona un municipio</option>';
        const dep = departamentos.find(d => d.id === Number(depId));
        if (!dep) return;
        dep.municipios.forEach(m => {
            const option = document.createElement("option");
            option.value = m.id;
            option.textContent = m.name;
            select.appendChild(option);
        });
    };
    const formatDateForDisplay = (isoDate) => {
        if (!isoDate) return "Desconocido";
        const d = new Date(isoDate);
        if (isNaN(d)) return isoDate;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("/");
        if (parts.length !== 3) return "";
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };
};











