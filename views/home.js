export let renderHome = (ul, main) => {
    let $body = document.getElementById('body');

    // Configuración del menú de navegación
    ul.innerHTML = `
        <a href="/skybolt/login" data-link>Log in</a>
        <a href="/skybolt/register" data-link>Sign up</a>
    `;

    // Establecer la imagen de fondo en el body
    $body.style.backgroundImage = "url('../img/image.png')";
    $body.classList.add('bg-cover', 'bg-center', 'bg-no-repeat');

    // Añadir clases al main para centrar el contenido
    main.classList.add('flex', 'justify-center', 'w-full', 'h-[94.570%]');

    // Establecer el contenido del main
    main.innerHTML = `
        <section class="w-3xl flex flex-col items-center mt-4 2xl:mt-[-20px] p-0 m-0">
            <h1 class="text-4xl font-[roboto] font-bold">SKYBOLT</h1>
            <img src="../img/CapturaFigma.png" alt="Balls of sports" class="w-[400px] max-h-[300px] h-auto m-0 ">
            <a href="/skybolt/login" data-link class="p-2 my-2 rounded-xl bg-[rgb(25,183,77,0.38)] m-0 font-[roboto]">
                Choose your favorite sport and reserve
            </a>
        </section>

        <!-- <section class="flex flex-col items-center mt-6"> -->
        <!--    <button id="about-btn" class="mt-6 rounded-2xl px-3 py-2 font-[roboto] bg-[rgb(254,245,245,0.5)]">-->
        <!--            About us -->
        <!--    </button>-->
        <!--    <article id="about-info" class="hidden mt-4 w-[90%] max-w-2xl bg-white bg-opacity-70 p-4 rounded-xl text-center font-[roboto] text-gray-800">
                At SKYBOLT, we simplify the way you book sports courts. With just a few clicks, you can choose your favorite sport, your ideal court, and the perfect time. Fast, reliable, and hassle-free. Because the game starts from the moment you book.
        <!--    </article> -->
        <!--</section>-->
    `;

    // // Mostrar/ocultar texto de About us
    // const aboutBtn = document.getElementById('about-btn');
    // const aboutInfo = document.getElementById('about-info');

    // aboutBtn.addEventListener('click', () => {
    //     aboutInfo.classList.toggle('hidden');
    // });

};


