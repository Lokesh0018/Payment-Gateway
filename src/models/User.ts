import { UserType } from "../types/Types";

export default class User {
    private username: string;
    private email:string;
    private phno:string;
    private password:string;

    constructor(user:UserType) {
        this.username = user.username;
        this.email = user.email;
        this.phno = user.phno;
        this.password = user.password;
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }

    getPhno(): string {
        return this.phno;
    }

    getPassword():string {
        return this.password;
    }

}