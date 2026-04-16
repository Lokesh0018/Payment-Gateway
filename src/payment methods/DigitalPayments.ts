import { UPI, Wallet } from "../types/Types";
import PaymentMethod from "./PaymentMethod";

export default abstract class DigitalPayments extends PaymentMethod {
    
    private paymentType:"UPI" | "Wallet";

    constructor(paymentType:"UPI" | "Wallet",paymentDetails:UPI | Wallet,dailyLimit:number,transaactionFee:number) {
        super(dailyLimit,transaactionFee,paymentDetails);
        this.paymentType = paymentType;
    }

    getPaymentType(): "UPI" | "Wallet" {
        return this.paymentType;
    }

    requireOtp(): boolean {
        return false;
    }

    isSavable(): boolean {
        return true;
    }

}
