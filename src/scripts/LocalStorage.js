// localStorage CRUD operations
export let locaL = {
    post: (nickname, object) => {
        if (object) {
            localStorage.setItem(nickname, JSON.stringify(object));
        }


    },
    get: (nickname) => {
        let user = localStorage.getItem(nickname)
        if (user) {
            user = JSON.parse(user);
            return user
        }
        else if (['/skybolt/dashboarduser',
            '/skybolt/dashboarduser/profile',
            '/skybolt/dashboarduser/profile/request',
            '/skybolt/dashboardowner',
            '/skybolt/dashboardowner/edit',
            '/skybolt/dashboardowner/profile',
            '/skybolt/dashboardadmin/fields',
            '/skybolt/dashboardadmin/users',
            '/skybolt/dashboardadmin/owners',
            '/skybolt/dashboardadmin/request'].includes(window.location.pathname)) {
            console.error("User not found")
        }
    },
    delete: (nickname) => {
        let nick = locaL.get(nickname)
        if (nick) localStorage.removeItem(nickname);
    },

    verification: () => {
        Api.get('/api/users')
            .then(data => {
                let user_found = data.find((d) => user.email === d.email);
                let user_verfication = user_found && JSON.stringify(user_found) === JSON.stringify(user)
                if (user_verfication) {
                    return true;
                }
            })
            .catch(err => {
                console.error("Error, user is not verified")
                return false
            })
    }
}