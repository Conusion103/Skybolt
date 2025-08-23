export let locaL = {
    post: (nickname,object) => {
        if(object){
            localStorage.setItem(nickname, JSON.stringify(object));
        }
        
    },
    get: (nickname) => {
        let user = localStorage.getItem(nickname)
        if(user){
            user = JSON.parse(user);
            return user
        }
    },
    delete: (nickname) => {
        let nick = locaL.get(nickname)
        if(nick)localStorage.removeItem(nickname);
    }
}