import { generalFormat } from "../src/scripts/validationMethods";

// Función para renderizar el formulario de registro
export let renderRegister = (ul, main) => {

  // Cambiar fondo y clases del body y main
  let $body = document.getElementById('body');
  $body.style.backgroundImage = "";  // Eliminar imagen de fondo
  $body.classList.remove('bg-cover', 'bg-center', 'bg-no-repeat'); // Eliminar clases de fondo
  main.classList.remove('flex', 'justify-center', 'items-center', 'w-full', 'h-[94.570%]'); // Eliminar clases de centrado

  // Contenido del menú (ul)
  ul.innerHTML = `
      <a href="/skybolt/home" data-link>Home</a>
      <a href="/skybolt/login" data-link>Log in</a>
  `;

  // Contenido del formulario en el main
  main.innerHTML = `
    <form class="form-example">
      <section class="form-example">
        <input type="text" name="name-register" id="name-register" placeholder="Full Name" required />
      </section>
      <section class="form-example">
        <input type="email" name="email-register" id="email-register" placeholder="Email" required />
      </section>
      <section class="form-example">
        <input type="number" name="phone-register" id="phone-register" placeholder="Phone number" required />
      </section>
      <section class="form-example">
        <input type="date" name="birthday-register" id="birthday-register" required />
      </section>
      <section class="form-example">
        <select name="type-of-documents" id="documents-select" required>
          <option value="">--Type of document--</option>
          <option value="CC">Cédula de ciudadanía</option>
          <option value="CE">Cédula de extranjería</option>
          <option value="PEP">Permiso especial de permanencia</option>
        </select>
      </section>
      <section class="form-example">
        <input type="number" name="document-register" id="document-register" placeholder="Document" required />
      </section>

      <!-- Selección de departamento -->
      <section class="form-example">
        <select id="departament-register" required>
          <option value="">--Selecciona un departamento--</option>
        </select>
      </section>

      <!-- Selección de municipio -->
      <section class="form-example">
        <select id="town-register" required>
          <option value="">--Selecciona un municipio--</option>
        </select>
      </section>

      <!-- Campos de contraseñas -->
      <section class="form-example">
        <input type="password" name="password-register" id="password-register" placeholder="Password" required />
      </section>
      <section class="form-example">
        <input type="password" name="password-register_" id="password-register_" placeholder="Confirm Password" required />
      </section>
      
      <!-- Botón de registro -->
      <section class="form-example">
        <button type="submit" id="button-register">Register</button>
      </section>
    </form>
  `;

  // --- Script dinámico para llenar los departamentos y municipios ---

  // Lista de departamentos y sus municipios
  const departamentos = {
    "Antioquia": ["Medellín", "Envigado", "Bello", "Itagüí", "Rionegro", "Apartadó"],
    "Cundinamarca": ["Bogotá", "Soacha", "Chía", "Zipaquirá", "Girardot", "Fusagasugá"],
    "Valle del Cauca": ["Cali", "Palmira", "Buenaventura", "Tuluá", "Cartago", "Yumbo"],
    "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Puerto Colombia"],
    "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja"],
    "Bolívar": ["Cartagena", "Magangué", "Turbaco", "Arjona", "El Carmen de Bolívar"]
  };

  const departamentoSelect = document.getElementById("departament-register");
  const municipioSelect = document.getElementById("town-register");

  // Llenar el select de departamentos
  Object.keys(departamentos).forEach(dep => {
    const option = document.createElement("option");
    option.value = dep;
    option.textContent = dep;
    departamentoSelect.appendChild(option);
  });

  // Evento cuando se cambia el departamento seleccionado
  departamentoSelect.addEventListener("change", (e) => {
    const selectedDep = e.target.value;
    municipioSelect.innerHTML = '<option value="">--Selecciona un municipio--</option>'; // Limpiar municipios previos

    // Si el departamento seleccionado tiene municipios, agregar opciones al select de municipios
    if (selectedDep && departamentos[selectedDep]) {
      departamentos[selectedDep].forEach(muni => {
        const option = document.createElement("option");
        option.value = muni;
        option.textContent = muni;
        municipioSelect.appendChild(option);
      });
    }
  });

  // Evento para el botón de registro
  document.getElementById('button-register').addEventListener('click', (e) => {
    e.preventDefault(); // Prevenir el envío por defecto del formulario

    try {
      // Obtener los valores de los campos del formulario
      let $name = document.getElementById('name-register').value.trim();
      let $email = document.getElementById('email-register').value.trim();
      let $phone = document.getElementById('phone-register').value.trim();
      let $birthday = document.getElementById('birthday-register').value.trim();
      let $type = document.getElementById('documents-select').value;
      let $identification = document.getElementById('document-register').value.trim();
      let $departament = document.getElementById('departament-register').value.trim();
      let $town = document.getElementById('town-register').value.trim();
      let $password = document.getElementById('password-register').value.trim();
      let $confirmPassword = document.getElementById('password-register_').value.trim();

      // Validaciones de los datos usando las funciones del archivo de validación
      generalFormat.nameFormat($name); // Validar nombre
      generalFormat.documenttypeFormat($type); // Validar tipo de documento
      generalFormat.identicationFormat($identification); // Validar identificación
      generalFormat.hotmailFormat($email); // Validar email
      generalFormat.passwordFormat($password, $confirmPassword); // Validar contraseñas

      // Crear un objeto con la información del usuario
      let user = {
        name: $name,
        email: $email,
        phone: $phone,
        bithday: $birthday,
        type_of_document: $type,
        document: $identification,
        departament: $departament,
        town: $town,
        password: $password
      };

      // Imprimir los datos del usuario en la consola para verificación
      console.table(user);
    } catch (error) {
      // Si ocurre algún error en las validaciones, mostrar el mensaje de error en la consola
      console.error(error.message);
    }
  });

}

