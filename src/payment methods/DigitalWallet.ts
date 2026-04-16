import { Wallet } from "../types/enum";
import DigitalPayments from "./DigitalPayments";

export default class DigitalWallet extends DigitalPayments {
    
    private walletDetails:Wallet;

    constructor(walletDetails:Wallet){
        super("Wallet",walletDetails,50000,1);
        this.walletDetails = walletDetails;
    }

    getWalletId():string {
        return this.walletDetails.walletId;
    }

    getWalletBalance():number {
        return this.walletDetails.balance;
    }

    isRefundable(): boolean {
        return true;
    }

}