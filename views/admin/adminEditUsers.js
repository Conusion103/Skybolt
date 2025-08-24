import { locaL } from "../../src/scripts/LocalStorage"; // mantengo locaL porque asumo que así se llama la exportación
import { Api } from "../../src/scripts/methodsApi";
import { departamentos } from "../register";
import { generalFormat } from "../../src/scripts/validationMethods";

export let renderDashboardAdminEditUsers = (ul, main) => {
    ul.innerHTML = `
    <a href="/skybolt/dashboardadmin/fields" data-link class="text-green-600 hover:text-green-800 font-semibold">Fields</a>
    <a href="/skybolt/dashboardadmin/owners" data-link class="text-green-600 hover:text-green-800 font-semibold">Owners</a>
    <a href="/skybolt/login" id="log-out-user" data-link class="text-red-500 hover:text-red-700 font-semibold">Log out</a>
  `;

    main.innerHTML = `
    <section class="p-6">
      <h2 class="text-2xl font-bold text-green-600 mb-4">
        Hola Admin, estás editando usuarios: ${locaL.get('active_user').full_name}
      </h2>

      <input type="text" id="user-search" placeholder="Buscar por correo..."
        class="w-full max-w-md mb-6 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"/>

      <!-- FORMULARIO DE EDICIÓN -->
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

          <!-- Select departamentos -->
          <select id="edit-id_department" class="input">
            <option value="">Selecciona un departamento</option>
            ${departamentos.map(dep => `<option value="${dep.id}">${dep.name}</option>`).join('')}
          </select>

          <!-- Select municipios -->
          <select id="edit-id_municipality" class="input">
            <option value="">Selecciona un municipio</option>
            <!-- Se llenará dinámicamente -->
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

    // Log out event
    document.getElementById("log-out-user").addEventListener("click", (e) => {
        e.preventDefault();
        locaL.delete("active_user");
    });

    // Load users
    Api.get("/api/users")
        .then((data) => {
            const section = document.getElementById("user-section");
            section.innerHTML = ""; // limpiar por si acaso

            data.forEach((user) => {
                if (user.rol === "user") {
                    const depName = getDepartmentName(user.id_department);
                    const munName = getMunicipalityName(user.id_department, user.id_municipality);

                    let $article = document.createElement("article");
                    $article.classList.add(
                        "bg-white",
                        "rounded-xl",
                        "shadow-md",
                        "p-4",
                        "border",
                        "border-gray-200",
                        "space-y-2"
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

            // Filtro por correo
            document.getElementById("user-search").addEventListener("input", (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const userCards = document.querySelectorAll("article");
                userCards.forEach((card) => {
                    const emailText = card.querySelector("p:nth-child(2)").textContent.toLowerCase();
                    card.style.display = emailText.includes(searchTerm) ? "block" : "none";
                });
            });

            // Evento cambio departamento - cargar municipios
            document.getElementById("edit-id_department").addEventListener("change", (e) => {
                loadMunicipalities(e.target.value);
            });

            // Edición y eliminación
            section.addEventListener("click", (e) => {
                e.preventDefault();

                // Eliminar usuario
                if (e.target.classList.contains("btn-delete")) {
                    const userID = e.target.getAttribute("data-id");
                    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

                    Api.delete(`/api/users/${userID}`)
                        .then(() => {
                            e.target.closest("article").remove();
                            alert("Usuario eliminado exitosamente");
                        })
                        .catch((error) => alert(error.message));
                }

                // Editar usuario
                if (e.target.classList.contains("btn-edit")) {
                    const userID = e.target.getAttribute("data-id");
                    const userCard = e.target.closest("article");

                    document.getElementById("edit-user-id").value = userID;

                    // Nombre
                    document.getElementById("edit-full_name").value = userCard.querySelector("h2").textContent.split(": ")[1].split(" ID")[0];
                    // Email
                    document.getElementById("edit-email").value = userCard.querySelector("p:nth-child(2)").textContent.split(": ")[1];
                    // Teléfono
                    document.getElementById("edit-phone").value = userCard.querySelector("p:nth-child(3)").textContent.split(": ")[1];

                    // Fecha cumpleaños formateada para input date
                    const rawBirthdate = userCard.querySelector("p:nth-child(4)").textContent.split(": ")[1];
                    document.getElementById("edit-birthdate").value = formatDateForInput(rawBirthdate);

                    // Documento tipo e ID
                    document.getElementById("edit-document_type").value = userCard.querySelector("p:nth-child(5)").textContent.split(":")[0].trim();
                    document.getElementById("edit-id_document").value = userCard.querySelector("p:nth-child(5)").textContent.split(":")[1].trim();

                    // Departamento y municipio (por nombre)
                    const depName = userCard.querySelector("p:nth-child(6)").textContent.split(": ")[1].split(" - ")[0].trim();
                    const muniName = userCard.querySelector("p:nth-child(6)").textContent.split(" - ")[1].trim();

                    const depId = getDepartmentIdFromName(depName);
                    document.getElementById("edit-id_department").value = depId;

                    // Cargar municipios para ese departamento
                    loadMunicipalities(depId);

                    const muniId = getMunicipalityIdFromName(depId, muniName);
                    document.getElementById("edit-id_municipality").value = muniId;

                    // Rol
                    document.getElementById("edit-rol").value = userCard.querySelector("p:nth-child(7)").textContent.split(": ")[1];

                    // Limpiar contraseña
                    document.getElementById("edit-password_").value = "";

                    // Mostrar formulario
                    document.getElementById("edit-user-form-container").style.display = "block";
                }

                document.getElementById("cancel-edit").addEventListener("click", () => {
                    // Ocultar el contenedor del formulario
                    document.getElementById("edit-user-form-container").style.display = "none";

                    // Limpiar los campos del formulario
                    const form = document.getElementById("edit-user-form");
                    form.reset();

                    // Opcional: limpiar el id oculto de usuario
                    document.getElementById("edit-user-id").value = "";
                });
            });

            // Submit del formulario editar usuario
            document.getElementById("edit-user-form").addEventListener("submit", (e) => {
                e.preventDefault();

                try {
                    const userID = document.getElementById("edit-user-id").value;

                    const id_department = Number(document.getElementById("edit-id_department").value);
                    const id_municipality = Number(document.getElementById("edit-id_municipality").value);

                    // Validaciones
                    const dep = departamentos.find((d) => d.id === id_department);
                    if (!dep) {
                        alert("Por favor selecciona un departamento válido.");
                        return;
                    }

                    const muniExists = dep.municipios.some((m) => m.id === id_municipality);
                    if (!muniExists) {
                        alert("Por favor selecciona un municipio válido para el departamento seleccionado.");
                        return;
                    }

                    const fullName = generalFormat.nameFormat(document.getElementById("edit-full_name").value.trim());
                    const email = generalFormat.hotmailFormat(document.getElementById("edit-email").value.trim());
                    const phone = generalFormat.phoneNumber(document.getElementById("edit-phone").value.trim());
                    const birthdate = generalFormat.birthdate(document.getElementById("edit-birthdate").value);
                    const documentType = generalFormat.documenttypeFormat(document.getElementById("edit-document_type").value.trim());
                    const idDocument = generalFormat.identicationFormat(document.getElementById("edit-id_document").value.trim());
                    const department = generalFormat.departamentFormat(id_department);
                    const municipality = generalFormat.townFormat(id_municipality);
                    const role = document.getElementById("edit-rol").value.trim();

                    const updatedUser = {
                        full_name: fullName,
                        email: email,
                        phone: phone,
                        birthdate: birthdate,
                        document_type: documentType,
                        id_document: idDocument,
                        id_department: department,
                        id_municipality: municipality,
                        rol: role,
                    };

                    const newPassword = document.getElementById("edit-password_").value;
                    if (newPassword.trim()) updatedUser.password_ = newPassword;

                    Api.put(`/api/users/${userID}`, updatedUser)
                        .then(() => {
                            alert("Usuario actualizado correctamente");
                            document.getElementById("edit-user-form-container").style.display = "none";

                            // Volver a cargar los datos sin recargar la página
                            renderDashboardAdminEditUsers(document.querySelector("ul"), document.querySelector("main"));
                        })
                        .catch((err) => alert(err.message));
                } catch (error) {
                    alert(error.message);
                }
            });

        });

    // Helpers para nombres de departamentos y municipios
    const getDepartmentName = (id) => {
        const dep = departamentos.find((d) => d.id === Number(id));
        return dep ? dep.name : "Desconocido";
    };

    const getMunicipalityName = (depId, muniId) => {
        const dep = departamentos.find((d) => d.id === Number(depId));
        if (!dep) return "Desconocido";
        const muni = dep.municipios.find((m) => m.id === Number(muniId));
        return muni ? muni.name : "Desconocido";
    };

    const getDepartmentIdFromName = (name) => {
        const dep = departamentos.find((d) => d.name === name);
        return dep ? dep.id : 0;
    };

    const getMunicipalityIdFromName = (depId, name) => {
        const dep = departamentos.find((d) => d.id === Number(depId));
        if (!dep) return 0;
        const muni = dep.municipios.find((m) => m.name === name);
        return muni ? muni.id : 0;
    };

    const loadMunicipalities = (depId) => {
        const municipalitySelect = document.getElementById("edit-id_municipality");
        municipalitySelect.innerHTML = '<option value="">Selecciona un municipio</option>';

        if (!depId) return;

        const dep = departamentos.find((d) => d.id === Number(depId));
        if (!dep) return;

        dep.municipios.forEach((mun) => {
            const option = document.createElement("option");
            option.value = mun.id;
            option.textContent = mun.name;
            municipalitySelect.appendChild(option);
        });
    };

    // Formatear fecha para mostrar en lista (DD/MM/YYYY)
    const formatDateForDisplay = (isoDate) => {
        if (!isoDate) return "Desconocido";
        const d = new Date(isoDate);
        if (isNaN(d)) return isoDate;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Formatear fecha de DD/MM/YYYY a YYYY-MM-DD para input date
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("/");
        if (parts.length !== 3) return "";
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };
};










