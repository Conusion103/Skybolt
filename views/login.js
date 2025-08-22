import { Api } from "../src/scripts/methodsApi";
import bcrypt from "bcryptjs";
import { locaL } from "../src/scripts/LocalStorage";
export let renderLogin = (ul, main) => {
    let $body = document.getElementById('body');
    $body.style.backgroundImage = "";
    $body.classList.remove('bg-cover', 'bg-center', 'bg-no-repeat');
    main.classList.remove('flex', 'justify-center', 'items-center', 'w-full', 'h-[94.570%]');
    ul.innerHTML = `
        <a href="/skybolt/home" data-link>Home</a>
        <a href="/skybolt/register" data-link>Register</a>
        `
    main.classList.add()
    main.innerHTML = `
        <form action="" method="get" class="form-example" id="login-form">
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

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        let $email = document.getElementById('email-login').value.trim();
        let $password = document.getElementById('password-login').value.trim();
        Api.get('/api/users')
        .then(data => {
            // 123546879LUcas@
            let user_login = data.find(d => $email === d.email && (bcrypt.compare($password, d.password_)));
            if(user_login){
                locaL.post('active_user',user_login);
                if(user_login.rol === 'user'){
                    history.pushState(null, null, '/skybolt/dashboarduser')
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }else if(user_login.rol === 'owner'){
                    history.pushState(null, null, '/skybolt/dashboardowner')
                    window.dispatchEvent(new PopStateEvent('popstate'));

                }else if(user_login.rol === 'admin'){
                    history.pushState(null, null, '/skybolt/dashboardadmin')
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
                else{
                    console.log(`This role doesn't exist`)
                }
            }else{



            }
            

        })
        .catch(error => {
            alert(error.message)
        })



    })




}