import { generalFormat } from "../src/scripts/validationMethods";
import { Api } from "../src/scripts/methodsApi";

// Datos de departamentos con sus municipios y IDs
const departamentos = [
  {
    id: 1,
    name: "Antioquia",
    municipios: [
      { id: 1, name: "Medellín" },
      { id: 2, name: "Envigado" },
      { id: 3, name: "Bello" },
      { id: 4, name: "Itagüí" },
      { id: 5, name: "Rionegro" },
      { id: 6, name: "Apartadó" },
    ],
  },
  {
    id: 2,
    name: "Cundinamarca",
    municipios: [
      { id: 7, name: "Bogotá" },
      { id: 8, name: "Soacha" },
      { id: 9, name: "Chía" },
      { id: 10, name: "Zipaquirá" },
      { id: 11, name: "Girardot" },
      { id: 12, name: "Fusagasugá" },
    ],
  },
  {
    id: 3,
    name: "Valle del Cauca",
    municipios: [
      { id: 13, name: "Cali" },
      { id: 14, name: "Palmira" },
      { id: 15, name: "Buenaventura" },
      { id: 16, name: "Tuluá" },
      { id: 17, name: "Cartago" },
      { id: 18, name: "Yumbo" },
    ],
  },
  {
    id: 4,
    name: "Atlántico",
    municipios: [
      { id: 19, name: "Barranquilla" },
      { id: 20, name: "Soledad" },
      { id: 21, name: "Malambo" },
      { id: 22, name: "Sabanalarga" },
      { id: 23, name: "Puerto Colombia" },
    ],
  },
  {
    id: 5,
    name: "Santander",
    municipios: [
      { id: 24, name: "Bucaramanga" },
      { id: 25, name: "Floridablanca" },
      { id: 26, name: "Girón" },
      { id: 27, name: "Piedecuesta" },
      { id: 28, name: "Barrancabermeja" },
    ],
  },
  {
    id: 6,
    name: "Bolívar",
    municipios: [
      { id: 29, name: "Cartagena" },
      { id: 30, name: "Magangué" },
      { id: 31, name: "Turbaco" },
      { id: 32, name: "Arjona" },
      { id: 33, name: "El Carmen de Bolívar" },
    ],
  },
];

// Función para renderizar el formulario de registro
export let renderRegister = (ul, main) => {
  // Cambiar fondo y clases del body y main
  let $body = document.getElementById("body");
  $body.style.backgroundImage = "";
  $body.classList.remove("bg-cover", "bg-center", "bg-no-repeat");
  main.classList.remove(
    "flex",
    "justify-center",
    "items-center",
    "w-full",
    "h-[94.570%]"
  );

  // Menú de navegación
  ul.innerHTML = `
    <a href="/skybolt/home" data-link>Home</a>
    <a href="/skybolt/login" data-link>Log in</a>
  `;

  // Formulario de registro
  main.innerHTML = `
    <form class="form-example">
      <section><input type="text" id="name-register" placeholder="Full Name" required /></section>
      <section><input type="email" id="email-register" placeholder="Email" required /></section>
      <section><input type="number" id="phone-register" placeholder="Phone number" required /></section>
      <section><input type="date" id="birthday-register" required /></section>
      <section>
        <select id="documents-select" required>
          <option value="">--Type of document--</option>
          <option value="CC">Cédula de ciudadanía</option>
          <option value="CE">Cédula de extranjería</option>
          <option value="PEP">Permiso especial de permanencia</option>
        </select>
      </section>
      <section><input type="number" id="document-register" placeholder="Document" required /></section>
      <section>
        <select id="departament-register" required>
          <option value="">--Selecciona un departamento--</option>
        </select>
      </section>
      <section>
        <select id="town-register" required>
          <option value="">--Selecciona un municipio--</option>
        </select>
      </section>
      <section><input type="password" id="password-register" placeholder="Password" required /></section>
      <section><input type="password" id="password-register_" placeholder="Confirm Password" required /></section>
      <section><button type="submit" id="button-register">Register</button></section>
    </form>
  `;

  // Referencias a selects
  const departamentoSelect = document.getElementById("departament-register");
  const municipioSelect = document.getElementById("town-register");

  // Llenar select de departamentos con IDs como value
  departamentos.forEach((dep) => {
    const option = document.createElement("option");
    option.value = dep.id; // valor es el ID
    option.textContent = dep.name; // texto visible es el nombre
    departamentoSelect.appendChild(option);
  });

  // Evento para actualizar municipios cuando se selecciona un departamento
  departamentoSelect.addEventListener("change", (e) => {
    const selectedDepId = Number(e.target.value);
    municipioSelect.innerHTML =
      '<option value="">--Selecciona un municipio--</option>';

    if (!selectedDepId) return; // No seleccionado

    const departamento = departamentos.find((dep) => dep.id === selectedDepId);
    if (!departamento) return;

    departamento.municipios.forEach((muni) => {
      const option = document.createElement("option");
      option.value = muni.id; // valor es el id del municipio
      option.textContent = muni.name; // texto visible es el nombre
      municipioSelect.appendChild(option);
    });
  });

  // Evento para el botón de registro
  document.getElementById("button-register").addEventListener("click", (e) => {
    e.preventDefault();

    try {
      let $name = document.getElementById("name-register").value.trim();
      let $email = document.getElementById("email-register").value.trim();
      let $phone = document.getElementById("phone-register").value.trim();
      let $birthdate = document
        .getElementById("birthday-register")
        .value.trim();
      let $type = document.getElementById("documents-select").value;
      let $identification = document
        .getElementById("document-register")
        .value.trim();
      let $departament = document
        .getElementById("departament-register")
        .value.trim();
      let $town = document.getElementById("town-register").value.trim();
      let $password = document.getElementById("password-register").value.trim();
      let $confirmPassword = document
        .getElementById("password-register_")
        .value.trim();

      // Validaciones (ajusta para aceptar números como string si es necesario)
      generalFormat.nameFormat($name);
      generalFormat.hotmailFormat($email);
      generalFormat.phoneNumber($phone);
      generalFormat.birthdate($birthdate);
      generalFormat.documenttypeFormat($type);
      generalFormat.identicationFormat($identification);
      generalFormat.departamentFormat($departament);
      generalFormat.townFormat($town);
      generalFormat.passwordFormat($password, $confirmPassword);

      // Armar el usuario con IDs numéricos para departamento y municipio
      let user = {
        full_name: $name,
        email: $email,
        phone: $phone,
        birthdate: $birthdate,
        document_type: $type,
        id_document: $identification,
        id_department: Number($departament),
        id_municipality: Number($town),
        password_: $password,
        rol: "admin",
      };

      // Validar si usuario ya existe consultando usuarios
      Api.get("/api/users")
        .then((users) => {
          let user_exist = users.some(
            (d) =>
              d.email === user.email ||
              (d.document_type === user.document_type &&
                d.id_document === user.id_document)
          );

          if (user_exist) throw new Error("User already exists");

          return Api.post("/api/users", user);
        })
        .then((res) => {
          // En tu método Api.request ya devuelves json, no res.ok
          alert("Usuario registrado correctamente");
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  });
};
