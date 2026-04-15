import { UPI, Wallet } from "../types/enum";
import PaymentMethod from "./PaymentMethod";

export default abstract class DigitalPayment extends PaymentMethod {
    #paymentType: "upi" | "wallet";
    #paymentDetails: UPI | Wallet;

    constructor(transactionFee:number, dailyLimit:number, paymentType:"upi" | "wallet",paymentDetails:UPI | Wallet){
        super(transactionFee,dailyLimit);
        this.#paymentType = paymentType;
        this.#paymentDetails = paymentDetails;
    }

    public get paymentType():"upi" | "wallet" {
        return this.#paymentType;
    }
    
    public get paymentDetails() : UPI | Wallet {
        return this.#paymentDetails;
    }
    
}