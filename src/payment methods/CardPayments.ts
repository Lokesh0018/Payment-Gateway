import { Credit, Debit, PaymentType } from "../types/enum";
import PaymentMethod from "./PaymentMethod";

export default abstract class CardPayments extends PaymentMethod {
    private cardType:Extract<PaymentType,"Credit Card" | "Debit Card">

    constructor(cardType:"Credit Card" | "Debit Card",cardDetails:Credit | Debit,dailyLimit:number,transactionFee:number){
        super(dailyLimit,transactionFee,cardDetails);
        this.cardType = cardType;
    }

    getCardType():"Credit Card" | "Debit Card"{
        return this.cardType;
    }

    requireOtp(): boolean {
        return true;
    }

    isRefundable(): boolean {
        return true;
    }

    isSavable(): boolean {
        return true;
    }

    getPaymentType(): PaymentType {
        return this.getCardType();
    }

}