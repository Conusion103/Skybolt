import { ownerRequestValidators } from "../../src/scripts/ownerRequestValidation.js";
import { Api } from "../../src/scripts/methodsApi.js";
import { locaL } from "../../src/scripts/LocalStorage.js";
import { showError, showSuccess } from "../../src/scripts/alerts.js";

export let renderResgiterRequestOwner = (ul, main) => {
      const activeUser = locaL.get("active_user");
  if (!activeUser) {
    main.innerHTML = `<p>Por favor inicia sesión.</p> <a href="/skybolt/login" data-link class="btn-primary" data-link>Log in</a>`;
    return;
  }
  document.body.style.background = "white";
  ul.innerHTML = `
    <a href="/skybolt/dashboarduser/profile" data-link>Back</a>
  `;

  main.innerHTML = `
    <section class="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2 text-center">Owner Request</h2>
      <p class="text-gray-600 text-center mb-6">Fill out the form below to request becoming a field owner</p>
      
      <form id="form-request-owner" class="space-y-5">
        <div>
          <label for="cancha-name" class="block text-gray-700 font-medium mb-2">Field Name</label>
          <input type="text" id="cancha-name" placeholder="Enter the field name" required
            class="w-full px-4 py-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300"/>
          <p id="error-cancha-name" class="text-red-500 text-sm mt-1"></p>
        </div>

        <div>
          <label for="cancha-location" class="block text-gray-700 font-medium mb-2">Location</label>
          <input type="text" id="cancha-location" placeholder="Enter the field location" required
            class="w-full px-4 py-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300"/>
          <p id="error-cancha-location" class="text-red-500 text-sm mt-1"></p>
        </div>

        <div>
          <label for="cancha-description" class="block text-gray-700 font-medium mb-2">Description</label>
          <textarea id="cancha-description" placeholder="Enter a short description"
            class="w-full px-4 py-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300"></textarea>
          <p id="error-cancha-description" class="text-red-500 text-sm mt-1"></p>
        </div>

        <button type="submit"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition">
          Submit Request
        </button>
      </form>
    </section>
  `;

  const form = document.getElementById("form-request-owner");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
      id_user: locaL.get('active_user').id_user,
      cancha_name: document.getElementById("cancha-name").value.trim(),
      cancha_location: document.getElementById("cancha-location").value.trim(),
      cancha_description: document.getElementById("cancha-description").value.trim(),
    };

    //  Validación
    let hasErrors = false;
    for (const field in ownerRequestValidators) {
      const errorMessage = ownerRequestValidators[field](formData[field]);
      const errorElement = document.getElementById(
        `error-${field.replace("_", "-")}`
      );

      if (errorMessage) {
        hasErrors = true;
        if (errorElement) errorElement.textContent = errorMessage;
      } else {
        if (errorElement) errorElement.textContent = "";
      }
    }

    if (hasErrors) return; //  No enviar si hay errores

    //  Enviar usando Api.post con then/catch
    Api.post("/api/owner_requests", formData)
      .then((response) => {
        showSuccess(" Request sent successfully!");
        console.log("Response:", response);
        form.reset();
      })
      .catch((err) => {
        console.error("Error sending request:", err.message);
        showError(" Could not send the request.");
      });
  });
};
