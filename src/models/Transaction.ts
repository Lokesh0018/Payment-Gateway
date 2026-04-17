import TransactionService from "../services/TransactionService";
import { PaymentType, TransactionStatus } from "../types/Types";

export default class Transaction {

    private email: string;
    private transactionId: string;
    private paymentMethod:PaymentType;
    private transactionAmount: number;
    private transactionTimeStamp:Date;
    private transactionStatus: TransactionStatus;

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

    getTransactionId():string {
        return this.transactionId;
    }

    getEmail():string{
        return this.email;
    }

    getTransactionAmount():number {
        return this.transactionAmount;
    }

    getPaymentMethod():PaymentType {
        return this.paymentMethod;
    }

    getTransactionStatus():TransactionStatus {
        return this.transactionStatus;
    }

    setTransactionStatus(status:TransactionStatus):void{
        this.transactionStatus = status;
    }

}