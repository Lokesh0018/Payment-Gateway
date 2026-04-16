import { UPI } from "../types/enum";
import DigitalPayments from "./DigitalPayments";

export default class Upi extends DigitalPayments {
    constructor(upiDetails:UPI){
        super("UPI",upiDetails,100000,0);
    }

    isRefundable(): boolean {
        return false;
    }

}