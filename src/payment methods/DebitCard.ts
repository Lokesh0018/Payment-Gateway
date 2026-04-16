import { Debit } from "../types/Types";
import CardPayments from "./CardPayments";

export default class DebitCard extends CardPayments {

    private cardDetails: Debit;

    constructor(cardDetails: Debit) {
        super("Credit Card", cardDetails, 200000, 2);
        this.cardDetails = cardDetails;
    }

    getCardNumber(): number {
        return this.cardDetails.cardNumber;
    }

    getCvv(): number {
        return this.cardDetails.cvv;
    }

}