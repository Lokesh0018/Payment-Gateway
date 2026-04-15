import User from "../models/User";

export default class UserRepository {
    private static users: Map<string, User> = new Map;

    static addUser(user: User): void {
        this.users.set(user.getUsername(), user);
    }

    static getUser(username: string): User | undefined {
        return this.users.get(username);
    }
}