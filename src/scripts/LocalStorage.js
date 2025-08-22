export let locaL = {
    post: (nickname,object) => {
        if(object){
            localStorage.setItem(nickname, JSON.stringify(object));
        }else{
            console.log(`There isn't a user logged`)
        }
        
    },
    get: (nickname) => {
        let user = localStorage.getItem(nickname)
        if(user){
            user = JSON.parse(user);
            return user
        }
        else{
            console.log(`There isn't a user logged`);
        }
    },
    delete: (nickname) => {
        let nick = locaL.get(nickname)
        if(nick)localStorage.removeItem(nickname);
    }
}