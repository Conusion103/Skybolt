export let renderLogin = (ul,main) => {
    let $body = document.getElementById('body');
    $body.style.backgroundImage = "";  
    $body.classList.remove('bg-cover', 'bg-center', 'bg-no-repeat'); 
    main.classList.remove('flex', 'justify-center', 'items-center', 'w-full', 'h-[94.570%]');
    ul.innerHTML=`
        <a href="/skybolt/home" data-link>Home</a>
        <a href="/skybolt/register" data-link>Register</a>
        `
    main.classList.add()
    main.innerHTML=`
        <form action="" method="get" class="form-example">
        <section class="form-example">
            <input type="email" name="email-login" id="email-login" placeholder="Email" required />
        </section>
        <section class="form-example">
            <input type="password" name="password-login" id="password-login" placeholder="Password" required />
        </section>
        <section class="form-example">
            <button type="submit" value="Login" id="button-login">Login</button>
        </section>
    </form>
    `
}