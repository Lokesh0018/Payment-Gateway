import { UserType } from "../types/enum";

export default class User {
    private username: string;
    private email:string;
    private phno:string;

    constructor(user:UserType) {
        this.username = user.username;
        this.email = user.email;
        this.phno = user.phno;
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

}