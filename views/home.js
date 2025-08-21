export let renderHome = (ul, main) => {
    let $body = document.getElementById("body");

    // Configuración del menú de navegación
    ul.innerHTML = `
  <!-- HEADER  -->
<header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <h1 class="text-3xl font-bold text-gray-800">
        <a href="#top" class="hover:text-sky-600 transition-colors duration-200">SkyBolt</a>
      </h1>

      <nav class="hidden md:flex space-x-6">
        <a href="#about-us" class="nav-link">About us</a>
        <a href="#testimonials" class="nav-link">Testimonials</a>
        <a href="#faq" class="nav-link">FAQ</a>
        <a href="#map" class="nav-link"">Find Us</a>
        <a href="#contact" class="nav-link">Contact Us</a>
        <a href="/skybolt/login" data-link class="btn-primary">Log in</a>
        <a href="/skybolt/register" data-link class="btn-primary">Sign up</a>

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
        <a href="#about-us" class="nav-link">About us</a>
        <a href="#testimonials" class="nav-link">Testimonials</a>
        <a href="#faq" class="nav-link">FAQ</a>
        <a href="#map" class="nav-link">Find Us</a>
        <a href="#contact" class="nav-link">Contact Us</a>
        <a href="/skybolt/login" data-link class="btn-primary">Log in</a>
        <a href="/skybolt/register" data-link class="btn-primary">Sign up</a>
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

    // Establecer la imagen de fondo en el body
    $body.style.background = "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('../img/image.png') center/cover no-repeat ";
    $body.classList.add("bg-cover", "bg-center", "bg-no-repeat", "min-h-[80vh]", "overflow-x-hidden");
    $body.style.transition = "background-size 0.3s ease-out";

    // Zoom al hacer scroll, adaptado a responsive
    window.addEventListener("scroll", () => {
        // Móvil:
        if (window.innerWidth < 768) {
            $body.style.backgroundSize = "cover";
            return;
        }
        let scroll = Math.min(window.scrollY, 300);
        ;
        const zoomFactor = window.innerWidth >= 1024 ? 0.05 : 0.03; // escritorio/tablet
        let zoom = 100 + scroll * zoomFactor;
        if (zoom > 120) zoom = 120;
        $body.style.backgroundSize = `${zoom}%`;
    });

    // Añadir clases al main para centrar el contenido
    $body.classList.add("bg-cover", "bg-center", "bg-no-repeat", "min-h-[80vh]", "overflow-x-hidden");


    // Establecer el contenido del main

};


