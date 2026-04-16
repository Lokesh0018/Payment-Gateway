import User from "../models/User";
import CreditCard from "../payment methods/CreditCard";
import DebitCard from "../payment methods/DebitCard";
import DigitalWallet from "../payment methods/DigitalWallet";
import PaymentMethod from "../payment methods/PaymentMethod";
import Upi from "../payment methods/Upi";
import { PaymentType } from "../types/enum";

export default class PaymentRepository {
    
    static savedPayments: Map<User["email"], Map<PaymentType, PaymentMethod>> = new Map([
        ["1",new Map([
            ["Credit Card",new CreditCard({cardNumber:1234123412341234,cvv:123,expiry:"1/32"})]
        ])]
    ]);

    static addPaymentMethod(user: User, paymentMethod: PaymentMethod) {
        const email = user.getEmail();
        if (!this.savedPayments.has(email)) {
            this.savedPayments.set(email, new Map<PaymentType, PaymentMethod>());
        }
        const userPayments = this.savedPayments.get(email);
        if (!(userPayments?.has(paymentMethod.getPaymentType()))) {
            userPayments?.set(paymentMethod.getPaymentType(), paymentMethod);
            console.log(`✅ ${paymentMethod.getPaymentType()} Added Successfully`);
        }
    }

    static getPaymentMethod(paymentType: PaymentType, email: User["email"]): PaymentMethod | undefined {
        return this.savedPayments.get(email)?.get(paymentType);
    }

    static getPaymentMethods(email: User["email"]) {
        const saved = this.savedPayments.get(email);
        if (!saved) {
            console.log("Empty Saved Methods!");
            return;
        }
        let idx = 1;
        for (const [k, v] of saved) {
            if (v.getPaymentType() === "Credit Card") {
                const paymentDetails = JSON.parse(JSON.stringify(v.getPaymentDetails()));
                console.log(`${idx++}. ${k} (${paymentDetails["cardNumber"]})`)
            }
        }
    }

}