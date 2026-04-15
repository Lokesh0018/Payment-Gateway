import User from "../models/User";

export default class UserRepository {
    private static users: Map<string, User> = new Map;

    static addUser(user: User): void {
        this.users.set(user.getEmail(), user);
    }

    static getUser(email: string): User | undefined {
        return this.users.get(email);
    }
}