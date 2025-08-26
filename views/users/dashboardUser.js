import { locaL } from "../../src/scripts/LocalStorage"
import { Api } from "../../src/scripts/methodsApi";
export let renderDashboardUser = (ul, main) => {

    // nav.innerHTML = `
    // <img src="./img/skybolt.webp" alt="Skybolt Logo">
    // `
    ul.innerHTML = `
    <a href="/skybolt/dashboarduser/profile" data-link>Profile</a>

    <a href="/skybolt/login" id="log-out-user" data-link>Log out</a>

    `
    main.innerHTML = `
    <h2>Hola ${locaL.get('active_user').full_name}</h2>
        <div class="header">
        <img src="logo.png" class="logo"/>
        <input type="text" placeholder="Label"/>
        </div>
        <div class="referees-section">
            <span>Do you want professional referees?</span>
            <div class="avatars">

            <!-- Avatares aquí -->
            <img src="avatar1.png" class="avatar"/>
            <img src="avatar2.png" class="avatar"/>
            </div>
        </div>
        <h3>Available Fields</h3><div id="fieldsContainer"></div>`;

    Api.get('/api/fields/availability')
        .then((res) => {
            if (!res.ok) throw new Error("Error al obtener las canchas");
            return res.json();
        })
        .then((fields) => {
            const container = document.getElementById("fieldsContainer");
            container.innerHTML = fields
                .map(
                    (f) => `
                    <article class="field-card">
                      <h3>${f.field_name}</h3>
                      <p>${f.municipality_name}, ${f.department_name}</p>
                      <p>Día: ${f.day_of_week} - ${f.hora_inicio} a ${f.hora_final}</p>
                      <p>Estado: ${f.estado}</p>
                      <p>Reservas: ${f.num_reservations}</p>
                      <button data-id="${f.id_field || ""}">Book</button>
                    </article>
                  `
                ).join("");
        })
        .catch((err) => {
            console.error(err);
            main.innerHTML += `<p>Error cargando canchas</p>`;
        });
    document.getElementById("log-out-user").addEventListener("click", (e) => {
        e.preventDefault();
        locaL.delete("active_user");
        history.pushState(null, null, "/skybolt/login");
    });
}