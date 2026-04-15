import { Credit, Debit } from "../types/enum";

export default class PaymentService {

    static validateCardDetails(cardDetails:Credit | Debit) {
        if(!cardDetails.cardNumber || typeof cardDetails.cardNumber !== "number" || Math.ceil(Math.log10(cardDetails.cardNumber)) !== 16){
            console.log("Invalid Card Number")
            return false;
        }
        if(!cardDetails.cvv || typeof cardDetails.cvv !== "number" || Math.ceil(Math.log10(cardDetails.cvv))){
            console.log("Invalid CVV");
            return false;
        }
        return true;
    }

    static processPayment(method: string, details: any): void {
        console.log(`Processing ${method} payment with details:`, details);
        // Here you would add the actual payment processing logic
    }
}