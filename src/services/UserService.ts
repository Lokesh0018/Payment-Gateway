import promptSync from "prompt-sync";
import User from "../models/User";
import UserRepository from "../repository/UserRepository";

const prompt = promptSync();

export default class UserService {

    static registerUser(): void {
        const username = prompt("Enter username: ");
        const email = prompt("Enter email: ");
        const phno = prompt("Enter phone number: ");

        if (!username || !email || !phno) {
            console.log("All fields are required. Please try again.");
            return;
        }

        if (UserRepository.getUser(username)) {
            console.log("User already exists!\n You can login with the same username.");
            return;
        }

        const user = new User({username, email, phno});
        UserRepository.addUser(user);

        console.log("Registration successful!");
    }

    static loginUser(): string | null {
        const username = prompt("Enter username: ");

        const user = UserRepository.getUser(username);

        if (!user) {
            console.log("Invalid User!");
            return null;
        }

        console.log("Login successful!");
        return username;
    }
}