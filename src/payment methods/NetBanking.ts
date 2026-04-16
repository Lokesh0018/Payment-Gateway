import { Banking, PaymentType } from "../types/enum";
import PaymentMethod from "./PaymentMethod";

export default class NetBanking extends PaymentMethod {
    private bankingDetails:Banking;

    constructor(bankingDetails:Banking){
        super(500000,1.5,bankingDetails);
        this.bankingDetails = bankingDetails;
    }

    requireOtp(): boolean {
        return false;
    }

    isRefundable(): boolean {
        return false;
    }

    isSavable(): boolean {
        return false;
    }

    getPaymentType(): PaymentType {
        return "Net Banking";
    }

    getBankCode():string {
        return this.bankingDetails.bankCode;
    }

    getAccountNumber():number {
        return this.bankingDetails.accountNumber;
    }

}