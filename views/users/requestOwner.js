import { ownerRequestValidators } from "../../src/scripts/ownerRequestValidation.js";
import { Api } from "../../src/scripts/methodsApi.js";
import { locaL } from "../../src/scripts/LocalStorage.js";
import { showError, showSuccess } from "../../src/scripts/alerts.js";

export let renderResgiterRequestOwner = (ul, main) => {
      const activeUser = locaL.get("active_user");
  if (!activeUser) {
    main.innerHTML = `<p>Please log in</p> <a href="/skybolt/login" data-link class="btn-primary" data-link>Log in</a>`;
    return;
  }
  document.body.style.background = "white";
  ul.innerHTML = `
    <header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <h1 class="text-3xl font-bold text-gray-800">
              <a href="/skybolt/home#top" class="hover:text-sky-600 transition-colors duration-200" data-link>SkyBolt</a>
            </h1>

            <nav class="hidden md:flex space-x-6">
              <a href="/skybolt/dashboarduser/profile" data-link class="block sm:inline text-red-500 hover:text-red-700 font-semibold px-2">Back</a>      
            </nav>

            <button id="menu-btn" class="md:hidden flex flex-col space-y-1">
              <span class="w-6 h-0.5 bg-gray-800"></span>
              <span class="w-6 h-0.5 bg-gray-800"></span>
              <span class="w-6 h-0.5 bg-gray-800"></span>
            </button>
          </div>
        </div>

        <!-- MOBILE MENU -->
        <div id="mobile-menu" class="hidden md:hidden w-full bg-white px-6 pb-6 flex-col items-center space-y-4 text-center">
          <a href="/skybolt/dashboarduser/profile" data-link class="block sm:inline text-red-500 hover:text-red-700 font-semibold px-2">Back</a>
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

  main.innerHTML = `
    <section class="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2 text-center">Owner Request</h2>
      <p class="text-gray-600 text-center mb-6">Fill out the form below to request becoming a field owner</p>
      
      <form id="form-request-owner" class="space-y-5">
        <div>
          <label for="field-name" class="block text-gray-700 font-medium mb-2">Field Name</label>
          <input type="text" id="field-name" placeholder="Enter the field name" required
            class="w-full px-4 py-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300"/>
          <p id="error-field-name" class="text-red-500 text-sm mt-1"></p>
        </div>

        <div>
          <label for="field-location" class="block text-gray-700 font-medium mb-2">Location</label>
          <input type="text" id="field-location" placeholder="Enter the field location" required
            class="w-full px-4 py-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300"/>
          <p id="error-field-location" class="text-red-500 text-sm mt-1"></p>
        </div>

        <div>
          <label for="field-description" class="block text-gray-700 font-medium mb-2">Description</label>
          <textarea id="field-description" placeholder="Enter a short description"
            class="w-full px-4 py-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300"></textarea>
          <p id="error-field-description" class="text-red-500 text-sm mt-1"></p>
        </div>

        <button type="submit"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition">
          Submit Request
        </button>
      </form>
    </section>
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

  // GET THE FORM ELEMENT BY ID
  const form = document.getElementById("form-request-owner");

  // ADD SUBMIT EVENT LISTENER TO THE FORM
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // PREVENT DEFAULT FORM SUBMISSION

     // COLLECT FORM DATA INTO AN OBJECT
    const formData = {
      id_user: locaL.get('active_user').id_user, // GET CURRENT USER ID FROM LOCAL STORAGE
      field_name: document.getElementById("field-name").value.trim(), // GET CURRENT USER ID FROM LOCAL STORAGE
      field_location: document.getElementById("field-location").value.trim(), // GET AND TRIM LOCATION
      field_description: document.getElementById("field-description").value.trim(), // GET AND TRIM DESCRIPTION
    };

    // VALIDATION FLAG
    let hasErrors = false;
    // LOOP THROUGH VALIDATORS FOR EACH FIELD
    for (const field in ownerRequestValidators) {
       // RUN VALIDATOR FUNCTION ON FIELD VALUE
      const errorMessage = ownerRequestValidators[field](formData[field]);
       // RUN VALIDATOR FUNCTION ON FIELD VALUE
      const errorElement = document.getElementById(
        `error-${field.replace("_", "-")}`
      );
      // IF THERE IS AN ERROR MESSAGE, DISPLAY IT AND FLAG ERROR
      if (errorMessage) {
        hasErrors = true;
        if (errorElement) errorElement.textContent = errorMessage;
      } else {
        // IF THERE IS AN ERROR MESSAGE, DISPLAY IT AND FLAG ERROR
        if (errorElement) errorElement.textContent = "";
      }
    }

    // STOP FORM SUBMISSION IF ANY VALIDATION ERROR EXISTS
    if (hasErrors) return; 

    // SEND FORM DATA USING API POST REQUEST
    Api.post("/api/owner_requests", formData)
      .then((response) => {
        showSuccess("Request sent successfully!");
        console.log("Response:", response);
        form.reset(); // RESET THE FORM AFTER SUCCESSFUL SUBMISSION
      })
      .catch((err) => {
        console.error("Error sending request:", err.message);
        showError(" Could not send the request.");
      });
  });
};
