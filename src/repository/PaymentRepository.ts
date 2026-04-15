import User from "../models/User";
import CreditCard from "../payment methods/CreditCard";
import DebitCard from "../payment methods/DebitCard";
import DigitalWallet from "../payment methods/DigitalWallet";
import PaymentMethod from "../payment methods/PaymentMethod";
import Upi from "../payment methods/Upi";
import { PaymentType } from "../types/enum";

export default class PaymentRepository {

    static savedPayments: Map<User["email"], Map<PaymentType,PaymentMethod>> = new Map();

    static addPaymentMethod(user:User,paymentMethod:PaymentMethod) { 
        const email = user.getEmail();
        if(!this.savedPayments.has(email)){
            this.savedPayments.set(email,new Map<PaymentType,PaymentMethod>());
        }
        const userPayments = this.savedPayments.get(email);        
        if(!(userPayments?.has(paymentMethod.getPaymentType()))){
            userPayments?.set(paymentMethod.getPaymentType(),paymentMethod);
            console.log(`✅ ${paymentMethod.getPaymentType()} Added Successfully`);
        }
    }

    static getCreditCard(email:User["email"]):PaymentMethod | undefined {
        return this.savedPayments.get(email)?.get("Credit Card");
    }

}