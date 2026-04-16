import { Debit } from "../types/enum";
import CardPayments from "./CardPayments";

export default class DebitCard extends CardPayments{
    
    constructor(paymentDetails:Debit){
        super("Debit Card",paymentDetails,100000,1);
    }

}