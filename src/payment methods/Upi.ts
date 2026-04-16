import { UPI } from "../types/enum";
import DigitalPayments from "./DigitalPayments";

export default class Upi extends DigitalPayments {
    
    private upiDetails:UPI;

    constructor(upiDetails:UPI){
        super("UPI",upiDetails,100000,0);
        this.upiDetails = upiDetails;
    }

    getUpiId():string{
        return this.upiDetails.upiId;
    }

    getUpiPin():number {
        return this.upiDetails.pin;
    }

    isRefundable(): boolean {
        return false;
    }

}