import { OtpMethods, RequireOtp } from "../interfaces/OtpVerifiable";
import Refundable from "../interfaces/Refundable";
import Savable from "../interfaces/Savable";
import { PaymentType } from "../types/enum";

export default abstract class PaymentMethod implements RequireOtp,Refundable,Savable,OtpMethods {
    
    private dailyLimit:number;
    private transactionFee:number;

    constructor(dailyLimit:number,transactionFee:number){
        this.dailyLimit = dailyLimit;
        this.transactionFee = transactionFee;
    }

    getDailyLimit():number {
        return this.dailyLimit;
    }

    setDailyLimit(dailyLimit:number):void {
        this.dailyLimit = dailyLimit;
    }

    calculateFee(amount: number): number {
        return (this.transactionFee / 100) * amount;
    }

    checkLimit(amount: number): boolean {
        return amount <= this.dailyLimit;
    }

    abstract requireOtp(): boolean;
    abstract isRefundable(): boolean;
    abstract isSavable(): boolean;
    abstract getPaymentType(): PaymentType;
    abstract verifyOtp(otp: number): boolean;
    abstract generateOtp(): number;

}