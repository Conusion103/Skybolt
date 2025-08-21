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
main.innerHTML = `
    <div class="flex justify-center w-full min-h-screen relative pt-2 sm:pt-4 md:pt-6 ">
        <section class="w-full max-w-3xl flex flex-col items-center px-4 min-h-[72vh] md:min-h-[85vh]">
            <img src="../img/CapturaFigma.png" alt="Balls of sports"
                class="max-w-full w-[260px] sm:w-[320px] md:w-[400px] h-auto max-h-[100px]">
            <a href="/skybolt/login" data-link
            class="p-2 my-4 rounded-xl bg-white font-[roboto]
                    mt-10 sm:mt-24 md:mt-[350px] lg:mt-[420px] xl:mt-[450px]
                    text-sm sm:text-base md:text-lg">
                Choose your favorite sport and reserve
            </a>
        </section>
        <div class="absolute bottom-14 sm:bottom-16 md:bottom-20 w-full flex justify-center">
            <span class="text-white text-2xl sm:text-3xl md:text-4xl animate-bounce">↓</span>
        </div>
    </div>

    <div class="flex flex-col px-6 py-12 sm:px-10 gap-6 bg-white text-gray-800">

        <!-- ABOUT US  -->
        <section class="max-w-[700px] mx-auto bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:bg-blue-50 transition-all duration-500" id="about-us">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-blue-700 flex items-center gap-2 justify-center text-center">
                <span aria-hidden="true">🏀</span>
                <span>ABOUT US</span>
            </h2>

            <p class="mt-4 text-justify leading-relaxed text-gray-700 text-sm sm:text-base">
                At SKYBOLT, we simplify the way you book sports courts. With just a few clicks, you can choose your favorite sport, your ideal court, and the perfect time. Fast, reliable, and hassle-free. Because the game starts from the moment you book.
            </p>
        </section>


        <!-- MISSION & VISION (bottom row in two columns) -->
        <div class="flex flex-col md:flex-row gap-6 md:gap-8">

            <!-- MISSION -->
            <section class="flex-1 bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:bg-green-50 transition-all duration-500">
                <h2 class="text-2xl sm:text-3xl font-extrabold text-green-700 flex items-center gap-2">
                <span aria-hidden="true">🎯</span>
                <span>MISSION</span>
                </h2>
                <p class="mt-4 text-justify leading-relaxed text-gray-700 text-sm sm:text-base">
                To make sports more accessible through an intuitive and efficient platform that allows users to book sports venues in seconds. At SKYBOLT, we connect players with available courts, optimizing time, organization, and the experience from the moment of booking.
                </p>
            </section>

            <!-- VISION -->
            <section class="flex-1 bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:bg-purple-50 transition-all duration-500">
                <h2 class="text-2xl sm:text-3xl font-extrabold text-purple-700 flex items-center gap-2">
                    <span aria-hidden="true">🌟</span>
                    <span>VISION</span>
                </h2>
                <p class="mt-4 text-justify leading-relaxed text-gray-700 text-sm sm:text-base">
                To become the leading solution for sports booking management in Latin America, transforming how people access sports and fostering active, organized, and connected communities through technology.
                </p>
            </section>
        </div>


        <!-- TESTIMONIALS -->
        <section class="testimonials" id="testimonials">
            <h2>What Our Players Say</h2>
            <div class="testimonials-grid">
                <div class="testimonial-card">
                    <p class="rating">★★★★★</p>
                    <p>“Booking has never been easier—now I can play without worrying about availability!”</p>
                    <h3>Juan Pérez</h3>
                </div>
                <div class="testimonial-card">
                    <p class="rating">★★★★★</p>
                    <p>“The app is super intuitive and fast—I totally recommend it!”</p>
                    <h3>María Gómez</h3>
                </div>
                <div class="testimonial-card">
                    <p class="rating">★★★★★</p>
                    <p>“The whole booking and payment process is super reliable.”</p>
                    <h3>Andrés Torres</h3>
                </div>
            </div>
        </section>



        <!-- FAQ -->
        <section class="faq" id="faq">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-container">
                <details class="faq-item">
                    <summary>📌 How do I book a court?</summary>
                    <p>Choose your sport, court, and time slot. Confirm your booking and you're all set.</p>
                </details>
                    <details class="faq-item">
                    <summary>📌 Can I cancel my booking?</summary>
                    <p>Yes, you can cancel up to 24 hours before your booking without penalty.</p>
                </details>
                <details class="faq-item">
                    <summary>📌 Can I pay in cash?</summary>
                    <p>Currently, we only accept digital payments to ensure security and speed.</p>
                </details>
                <details class="faq-item">
                    <summary>📌 How do I know my booking was confirmed?</summary>
                    <p>You'll receive a notification in the app and an email with the details. You can also check your booking history.</p>
                </details>
            </div>
        </section>


        <!-- MAP -->
        <section class="py-16 bg-white px-6 sm:px-10 text-center" id="map">
            <h2 class="text-3xl font-extrabold text-green-900 mb-6">Find Us</h2>
            <p class="text-gray-700 mb-6">All our courts are located in accessible and safe areas.</p>
            <iframe class="w-full h-64 md:h-96 rounded-xl shadow hover:shadow-2xl transition duration-300 border-2 border-green-400"
                src="https://www.google.com/maps/embed?...">
            </iframe>
        </section>
    </div>`
;
};


