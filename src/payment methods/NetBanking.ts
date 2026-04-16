import { Banking, PaymentType } from "../types/enum";
import PaymentMethod from "./PaymentMethod";

export default class NetBanking extends PaymentMethod {

    constructor(bankingDetails:Banking){
        super(500000,1.5,bankingDetails);
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

}