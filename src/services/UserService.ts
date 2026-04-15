import promptSync from "prompt-sync";
import User from "../models/User";
import UserRepository from "../repository/UserRepository";

const prompt = promptSync();

export default class UserService {

    static registerUser(): void {
        const username:string = prompt("Enter Name: ");
        const email:string = prompt("Enter Email: ");
        const phno:string = prompt("Enter Phone: ");
        const password:string = prompt("Enter Password: ");

        if (!username || !email || !phno || !password) {
            console.log("All fields are required. Please try again.");
            return;
        }

        if (UserRepository.getUser(email)) {
            console.log(`User already exists!\n You can login with the same email ${email}`);
            return;
        }

        const user = new User({username, email, phno, password});
        UserRepository.addUser(user);

        console.log("✅ Registration Successful!");
    }

    static loginUser(): User | null {
        const email:string = prompt("Enter Email: ");
        const password:string = prompt("Enter Password: ");

        const user = UserRepository.getUser(email);

        if (!user) {
            console.log("❌ Invalid User!");
            return null;
        }

        if(user.getPassword() !== password){
            console.log("❌ Password Incorrect");
            return null;
        }

        console.log("✅ Login Successful!");
        return user;
    }
}