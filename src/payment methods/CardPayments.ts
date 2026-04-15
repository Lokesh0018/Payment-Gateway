import { OtpMethods } from "../interfaces/OtpVerifiable";
import { Credit, Debit, PaymentType } from "../types/enum";
import PaymentMethod from "./PaymentMethod";

export default abstract class CardPayments extends PaymentMethod implements OtpMethods {
    private cardType:Extract<PaymentType,"Credit Card" | "Debit Card">
    private cardDetails:Credit | Debit;
    private otp:number;

    constructor(cardType:"Credit Card" | "Debit Card",cardDetails:Credit | Debit,dailyLimit:number,transactionFee:number){
        super(dailyLimit,transactionFee);
        this.cardType = cardType;
        this.cardDetails = cardDetails;
        this.otp = 0;
    }

    getCardType():"Credit Card" | "Debit Card"{
        return this.cardType;
    }

    getCardDetails():Credit | Debit {
        return this.cardDetails;
    }

    setOtp(otp:number):void {
        this.otp = otp; 
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

    generateOtp(): number {
        const otp: number = Math.floor(Math.random() * 9000) + 1000;
        console.log("Your OTP :", otp);
        this.setOtp(otp);
        return otp;
    }

    verifyOtp(otp: number): boolean {
        return this.otp === otp;
    }

}