import User from "../models/User";
import UserRepository from "../repository/UserRepository";

export default class UserService {

    static registerUser(username: string, email: string, phno: string, password: string): void {

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

    static loginUser(email: string, password: string): User | null {
        
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