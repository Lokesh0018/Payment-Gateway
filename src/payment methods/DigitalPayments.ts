import { PaymentType, UPI, Wallet } from "../types/enum";
import PaymentMethod from "./PaymentMethod";

export default abstract class DigitalPayments extends PaymentMethod {
    private paymentType:Extract<PaymentType,"UPI" | "Wallet">
    private digitalPaymentDetails:UPI | Wallet;

    constructor(paymentType:"UPI" | "Wallet",paymentDetails:UPI | Wallet,dailyLimit:number,transaactionFee:number) {
        super(dailyLimit,transaactionFee,paymentDetails);
        this.paymentType = paymentType;
        this.digitalPaymentDetails = paymentDetails;
    }

    getPaymentType(): "UPI" | "Wallet" {
        return this.paymentType;
    }

    getDigitalPaymentDetails():UPI | Wallet {
        return this.digitalPaymentDetails;
    }

    requireOtp(): boolean {
        return false;
    }

    isSavable(): boolean {
        return true;
    }

}
