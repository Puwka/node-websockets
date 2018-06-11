export class Users {
    constructor () {
        this.users = []
    }
    addUser ({id, name, room}) {
        const user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser ({id}) {
        const user = this.getUser({id})
        
        if (user) this.users = this.users.filter(user => user.id !== id)

        return user
    }
    getUser ({id}) {
        return this.users.find(user => user.id === id)
    }
    getUserList ({room}) {
        const users = this.users.reduce((prev, curr) => {
            if (curr.room === room) prev.push(curr.name)
            return prev
        }, [])
        return users
    }
}

// class Person {
//     constructor (name, age) {
//         this.name = name;
//         this.age = age;
//     }
//     getUserDescription () {
//         return `The awesome man with name ${this.name} was born ${this.age} years ago`
//     }
// }

// const me = new Person('Alexandr', 22);
// console.log(me.getUserDescription())