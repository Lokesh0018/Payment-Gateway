import User from "../models/User";

export default class UserRepository {
    private static users: Map<string, User> = new Map([["1",new User({"username":"1","email":"1","phno":"1", "password":"1"})]]);

    static addUser(user: User): void {
        this.users.set(user.getEmail(), user);
    }

    static getUser(email: string): User | undefined {
        return this.users.get(email);
    }
}