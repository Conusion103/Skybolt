import { generalFormat } from "../src/scripts/validationMethods";
import { Api } from "../src/scripts/methodsApi";
import { showError, showSuccess } from "../src/scripts/alerts";

// data constantly burned 
export const departamentos = [
  {
    id: 1,
    name: "Atlantico",
    municipios: [
      { id: 1, name: "Barranquilla" },
    ],
  },
];

// Function to render the registration form
export let renderRegister = (ul, main) => {

  let $body = document.getElementById("body");
  $body.style.backgroundImage = "";
  document.body.style.background = "white";
  $body.classList.remove("bg-cover", "bg-center", "bg-no-repeat");
  $body.classList.add("bg-gray-100", "min-h-screen");
  main.classList.remove(
    "flex",
    "justify-center",
    "items-center",
    "w-full",
    "h-[94.570%]"
  );

  // Navbar
  ul.innerHTML = `
     <!-- HEADER  -->
<header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <h1 class="text-3xl font-bold text-gray-800">
        <a href="/skybolt/home#top" class="hover:text-sky-600 transition-colors duration-200" data-link>SkyBolt</a>
      </h1>

      <nav class="hidden md:flex space-x-6">
        <a href="/skybolt/home#about-us" class="nav-link" data-link>About us</a>
        <a href="/skybolt/home#testimonials" class="nav-link" data-link>Testimonials</a>
        <a href="/skybolt/home#faq" class="nav-link" data-link>FAQ</a>
        <a href="/skybolt/home#map" class="nav-link" data-link>Find Us</a>
        <a href="/skybolt/home#contact" class="nav-link" data-link>Contact Us</a>
        <a href="/skybolt/login" data-link class="btn-primary" data-link>Log in</a>

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
        <a href="/skybolt/home#about-us" class="nav-link">About us</a>
        <a href="/skybolt/home#testimonials" class="nav-link">Testimonials</a>
        <a href="/skybolt/home#faq" class="nav-link">FAQ</a>
        <a href="/skybolt/home#map" class="nav-link">Find Us</a>
        <a href="/skybolt/home#contact" class="nav-link">Contact Us</a>
        <a href="/skybolt/login" data-link class="btn-primary">Log in</a>
    </div>

</header>

<!-- ESPACIO PARA QUE EL HEADER NO TAPE EL CONTENIDO -->
<div id="top" class="h-16"></div>
  `;

  // Toggle menú móvil
    document.getElementById("menu-btn").addEventListener("click", () => {
        const menu = document.getElementById("mobile-menu");
        menu.classList.toggle("hidden");
    });

  // Register Form
  main.innerHTML = `
  <section class="flex flex-col items-center justify-center min-h-screen">
    <div class="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-8 space-y-6">
      
      <!-- Header -->
      <header class="text-center">
        <h1 class="text-4xl font-bold text-green-400">REGISTER</h1>
      </header>

      <!-- Formulario -->
      <form id="form-register" class="space-y-4">

        <input type="text" id="name-register" placeholder="Full Name" required
          class="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"/>

        <input type="email" id="email-register" placeholder="Email" required
          class="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"/>

        <input type="number" id="phone-register" placeholder="Phone number" required
          class="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"/>

        <input type="date" id="birthday-register" required
          class="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"/>

        <select id="documents-select" required
          class="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="">--Type of document--</option>
          <option value="CC">Cédula de ciudadanía</option>
          <option value="CE">Cédula de extranjería</option>
          <option value="PEP">Permiso especial de permanencia</option>
        </select>

        <input type="number" id="document-register" placeholder="Document" required
          class="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"/>

        <select id="departament-register" required
          class="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="">--Select a department--</option>
        </select>

        <select id="town-register" required
          class="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="">--Select a municipality--</option>
        </select>

        <!-- Password with icon -->
        <div class="relative w-full">
          <input type="password" id="password-register" placeholder="Password" required
            class="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 pr-10"/>
          <img id="toggle-password" src="../../img/ojoCerrado.png" alt="Show password"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"/>
        </div>

        <!-- Confirmation with icon -->
        <div class="relative w-full">
          <input type="password" id="password-register_" placeholder="Confirm Password" required
            class="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 pr-10"/>
          <img id="toggle-password-confirm" src="../../img/ojoCerrado.png" alt="Show password"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"/>
        </div>

        <!-- Button -->
        <button type="submit" id="button-register"
          class="w-full py-3 bg-green-400 text-white font-bold rounded-full hover:bg-green-500 transition flex items-center justify-center gap-2">
          REGISTER
        </button>

        <!-- Login redirect -->
        <p class="text-center text-sm text-gray-600">
          Already a member? <a href="/skybolt/login" class="text-blue-500 font-semibold" data-link>Log in</a>
        </p>
      </form>
    </div>
  </section>
  `;

  // --- Show/Hide Passwords ---
  const togglePassword = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("password-register");

  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.src = isHidden ? "../../img/ojo.png" : "../../img/ojoCerrado.png";
  });

  const togglePasswordConfirm = document.getElementById("toggle-password-confirm");
  const confirmInput = document.getElementById("password-register_");

  togglePasswordConfirm.addEventListener("click", () => {
    const isHidden = confirmInput.type === "password";
    confirmInput.type = isHidden ? "text" : "password";
    togglePasswordConfirm.src = isHidden ? "../../img/ojo.png" : "../../img/ojoCerrado.png";
  });


  // footer
    footer.innerHTML = `
    <!-- FOOTER COMPLETO -->
    <footer id="contact" class="bg-[#111827] text-green-100 py-10 px-6 sm:px-10 w-full mt-30">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <!-- DESCRIPTIÓN -->
            <div>
                <h3 class="text-xl font-bold text-white mb-4">SKYBOLT</h3>
                <p class="text-sm">
                    Your trusted platform to book sports venues in seconds. Technology that connects active communities.
                </p>
            </div>

            <!-- LINK -->
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

  // SELECTS
  const departamentoSelect = document.getElementById("departament-register");
  const municipioSelect = document.getElementById("town-register");

  // Fill department selection with IDs as value
  departamentos.forEach((dep) => {
    const option = document.createElement("option");
    option.value = dep.id; 
    option.textContent = dep.name; 
    departamentoSelect.appendChild(option);
  });

  // Event to manage the town
  departamentoSelect.addEventListener("change", (e) => {
    const selectedDepId = Number(e.target.value);
    municipioSelect.innerHTML =
      '<option value="">--Selecciona un municipio--</option>';

    if (!selectedDepId) return;

    const departamento = departamentos.find((dep) => dep.id === selectedDepId);
    if (!departamento) return;

    departamento.municipios.forEach((muni) => {
      const option = document.createElement("option");
      option.value = muni.id; 
      option.textContent = muni.name; 
      municipioSelect.appendChild(option);
    });
  });

  // Event for the registration button
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

      // Validations
      generalFormat.nameFormat($name);
      generalFormat.hotmailFormat($email);
      generalFormat.phoneNumber($phone);
      generalFormat.birthdate($birthdate);
      generalFormat.documenttypeFormat($type);
      generalFormat.identicationFormat($identification);
      generalFormat.departamentFormat($departament);
      generalFormat.townFormat($town);
      generalFormat.passwordFormat($password, $confirmPassword);

      // Create the users
      let user = {
        full_name: $name,
        email: $email,
        phone: $phone,
        birthdate: $birthdate,
        document_type: $type,
        id_document: $identification,
        id_department: Number($departament),
        id_municipality: Number($town),
        password_: $password
      };

      // Validate if user already exists by querying users
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
          window.location.href = "/skybolt/login";
          showSuccess("Usuario registrado correctamente");
        })
        .catch((error) => {
          showError(error.message);
        });
    } catch (error) {
      console.error(error.message);
      showError(error.message);
    }
  });
};
