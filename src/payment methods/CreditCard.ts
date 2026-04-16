import { Credit } from "../types/enum";
import CardPayments from "./CardPayments";

export default class CreditCard extends CardPayments{
    
    constructor(paymentDetails:Credit){
        super("Credit Card",paymentDetails,200000,2);
    }
    
}