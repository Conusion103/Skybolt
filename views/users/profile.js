import { locaL } from "../../src/scripts/LocalStorage";
export let renderDashboardUserProfile = (ul, main) => {
    ul.innerHTML = `
    <a href="/skybolt/dashboarduser/profile" data-link>Back</a>
    <a href="/skybolt/login" id="log-out-user" data-link>Log out</a>
    `
    main.innerHTML = `
    <h2>Hola ${locaL.get('active_user').full_name}</h2>
    `
    document.getElementById('log-out-user').addEventListener('click', (e) => {
        e.preventDefault();
        locaL.delete('active_user');
    })

}