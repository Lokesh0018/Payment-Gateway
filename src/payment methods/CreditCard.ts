import { Credit } from "../types/enum";
import CardPayments from "./CardPayments";

export default class CreditCard extends CardPayments{
    
    private cardDetails:Credit;

    constructor(cardDetails:Credit){
        super("Credit Card",cardDetails,200000,2);
        this.cardDetails = cardDetails;
    }

    getCardNumber():number{
        return this.cardDetails.cardNumber;
    }

    getCvv():number {
        return this.cardDetails.cvv;
    }
    
}