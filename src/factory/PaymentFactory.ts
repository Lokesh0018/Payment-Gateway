import { UserType, PaymentType, Credit, Debit, UPI, Wallet, Banking } from "../types/enum";
import CreditCard from "../payment methods/CreditCard";
import DebitCard from "../payment methods/DebitCard";
import Upi from "../payment methods/Upi";
import DigitalWallet from "../payment methods/DigitalWallet";
import NetBanking from "../payment methods/NetBanking";

export default class PaymentFactory {

    static createPaymentMethod(paymentType: PaymentType, paymentDetails: Credit | Debit | UPI | Wallet | Banking):CreditCard | DebitCard | Upi | DigitalWallet | NetBanking {
        switch (paymentType) {
            case "Credit Card":
                    return new CreditCard(paymentDetails as Credit);
            case "Debit Card":
                    return new DebitCard(paymentDetails as Debit);
            case "UPI":
                    return new Upi(paymentDetails as UPI);
            case "Wallet":
                    return new DigitalWallet(paymentDetails as Wallet);
            case "Net Banking":
                    return new NetBanking(paymentDetails as Banking);
            default:
                throw new Error("Invalid Payment Type");
        }
    }

}