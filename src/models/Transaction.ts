import TransactionService from "../services/TransactionService";
import { PaymentType, TransactionStatus } from "../types/Types";

export default class Transaction {

    email: string;
    transactionId: string;
    paymentMethod:PaymentType;
    transactionAmount: number;
    transactionTimeStamp:Date;
    transactionStatus: TransactionStatus;

    constructor(email: string, paymentMethod:PaymentType, transactionAmount: number,transactionTimeStamp:Date, transactionStatus: TransactionStatus) {
        this.email = email;
        this.transactionId = TransactionService.generateTransaction();
        this.transactionAmount = transactionAmount;
        this.paymentMethod = paymentMethod;
        const timeStamp:Date = transactionTimeStamp;
        timeStamp.setHours(timeStamp.getHours()+5);
        timeStamp.setMinutes(timeStamp.getMinutes()+30);
        this.transactionTimeStamp = timeStamp;
        this.transactionStatus = transactionStatus;
    }

}