import { Wallet } from "../types/enum";
import DigitalPayments from "./DigitalPayments";

export default class DigitalWallet extends DigitalPayments {
    
    constructor(walletDetails:Wallet){
        super("Wallet",walletDetails,50000,1.5);
    }

    isRefundable(): boolean {
        return true;
    }

}