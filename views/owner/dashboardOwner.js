import { locaL } from "../../src/scripts/LocalStorage"
export let renderDashboardOwner = (ul, main) => {

    // nav.innerHTML = `
    // <img src="./img/skybolt.webp" alt="Skybolt Logo">
    // `
    ul.innerHTML = `
    <a href="/skybolt/dashboardowner/profile" data-link>Profile</a>
    <a href="/skybolt/login" id="log-out-user" data-link>Log out</a>
    `
    main.innerHTML = `
    <h2>Hola Owner ${locaL.get('active_user').full_name}
        
    
    </h2>
    `
    document.getElementById('log-out-user').addEventListener('click', (e) => {
        e.preventDefault();
        locaL.delete('active_user');
    })


}