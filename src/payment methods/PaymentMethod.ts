import OtpVerifiable from "../interfaces/OtpVerifiable";
import Refundable from "../interfaces/Refundable";
import Savable from "../interfaces/Savable";
import { PaymentDetails, PaymentType } from "../types/Types";

export default abstract class PaymentMethod implements Refundable,Savable,OtpVerifiable {
    
    private dailyLimit:number;
    private transactionFee:number;
    private paymentDetails:PaymentDetails;
    private otp:number;

    constructor(dailyLimit:number,transactionFee:number,paymentDetails:PaymentDetails){
        this.dailyLimit = dailyLimit;
        this.transactionFee = transactionFee;
        this.paymentDetails = paymentDetails;
        this.otp = 0;
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

    getPaymentDetails(): PaymentDetails{
        return this.paymentDetails;
    }

    setOtp(otp:number):void {
        this.otp = otp;
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


    abstract requireOtp(): boolean;
    abstract isRefundable(): boolean;
    abstract isSavable(): boolean;
    abstract getPaymentType(): PaymentType;
}