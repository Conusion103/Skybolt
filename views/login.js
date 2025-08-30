import { Api } from "../src/scripts/methodsApi";
import bcrypt from "bcryptjs";
import { locaL } from "../src/scripts/LocalStorage";
import { showError } from "../src/scripts/alerts";
export let renderLogin = (ul, main) => {
  let $body = document.getElementById("body");
  $body.style.backgroundImage = "";
  $body.classList.remove("bg-cover", "bg-center", "bg-no-repeat");
  $body.classList.add("bg-gray-100", "min-h-screen");
  main.classList.remove(
    "flex",
    "justify-center",
    "items-center",
    "w-full",
    "h-[94.570%]"
  );



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
          <a href="#contact" class="nav-link" data-link>Contact Us</a>
          <a href="/skybolt/register" data-link class="btn-primary" data-link>Sign up</a>
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
      <a href="#about-us" class="nav-link" data-link>About us</a>
      <a href="#testimonials" class="nav-link" data-link>Testimonials</a>
      <a href="#faq" class="nav-link" data-link>FAQ</a>
      <a href="#map" class="nav-link" data-link>Find Us</a>
      <a href="#contact" class="nav-link" data-link>Contact Us</a>
      <a href="/skybolt/register" data-link class="btn-primary" data-link>Sign up</a>
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

main.innerHTML = `
  <section class="flex flex-col items-center justify-center min-h-screen">
  
    <!-- Card -->
    <div class="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-8 space-y-8">
      
      <!-- Header -->
      <header class="text-center">
        <h1 class="text-4xl font-bold text-green-400">Welcome back</h1>
        <p class="text-gray-500">sign in to access your account</p> 
      </header>

      <!-- Formulario -->
      <form class="space-y-5" id="login-form">
        
        <!-- Email -->
        <div class="relative">
          <input 
            type="email" 
            name="email-login"
            id="email-login"
            placeholder="Enter your email "
            required
            class="w-full px-4 py-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
        
        <!-- Password -->
        <div class="relative">
          <input 
            type="password" 
            name="password-login"
            id="password-login"
            placeholder="Password"
            required
            class="w-full px-4 py-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <!-- Remember me + Forgot -->
        <div class="flex justify-between items-center text-sm">
          <label class="flex items-center gap-2">
            <input type="checkbox" class="rounded border-gray-300">
            <span>Remember me</span>
          </label>
          <a href="#" class="text-blue-500 hover:underline">Forget password?</a>
        </div>

        <!-- Submit -->
        <button 
          type="submit" 
          id="button-login"
          class="w-full py-3 bg-green-400 text-white font-bold rounded-full hover:bg-green-500 transition"
        >
          NEXT
        </button>

        <!-- Register -->
        <p class="text-center text-sm text-gray-600">
          New Member? <a href="/skybolt/register" class="text-blue-500 font-semibold" data-link>Register now</a>
        </p>
      </form>
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
            <li><a href="/skybolt/home#faq" data-link class="hover:text-yellow-300 transition">FAQ</a></li>
            <li><a href="/skybolt/home#map" class="hover:text-yellow-300 transition">Location</a></li>
          </ul>
        </div>

            
        <!-- REDES -->
        <div>
          <h4 class="text-lg font-semibold text-white mb-3">Follow Us</h4>
          <div class="flex gap-4">
            <a href="#" class="hover:text-yellow-300 transition">Instagram</a>
            <a href="#" class="hover:text-yellow-300 transition">Facebook</a>
            <a href="#" class="hover:text-yellow-300 transition">Twitter</a>
          </div>
        </div>

      </div>

      <!-- COPYRIGHT -->
      <div class="text-center text-sm mt-10 text-green-300">
            © 2025 SKYBOLT. All rights reserved
      </div>
  </footer>
`;


document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        let $email = document.getElementById('email-login').value.trim();
        let $password = document.getElementById('password-login').value.trim();
        Api.get('/api/users')
            .then(async data => {
                // Buscar usuario por email
                let user = data.find(d => $email === d.email);
                // 123456789LUcas@
                if (user) {
                    // Verificar contraseña de forma segura
                    const isPasswordCorrect = await bcrypt.compare($password, user.password_);

                    if (isPasswordCorrect) {
                        locaL.post('active_user', user);

                        switch (user.roles[0].name_role) {
                            case 'user':
                                history.pushState(null, null, '/skybolt/dashboarduser');
                                break;
                            case 'owner':
                                history.pushState(null, null, '/skybolt/dashboardowner');
                                break;
                            case 'admin':
                                history.pushState(null, null, '/skybolt/dashboardadmin/fields');
                                break;
                            default:
                                console.log(`This role doesn't exist`);
                                return;
                        }

                        window.dispatchEvent(new PopStateEvent('popstate'));
                    } else {
                        showError("Contraseña incorrecta");
                    }
                } else {
                    showError("Usuario no encontrado");
                }
            })
            .catch(error => {
                showError("Error al iniciar sesión: " + error.message);
            });




    })
};
