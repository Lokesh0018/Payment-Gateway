import { PaymentType } from "../types/enum";

export default class Transaction {

    email: string;
    transactionId: string;
    paymentMethod:PaymentType;
    transactionAmount: number;
    transactionTimeStamp:Date;
    transactionStatus: "Success" | "Failed" | "Refunded";

    constructor(email: string, paymentMethod:PaymentType, transactionAmount: number,transactionTimeStamp:Date, transactionStatus: "Success" | "Failed" | "Refunded") {
        this.email = email;
        this.transactionId = this.generateTransaction();
        this.transactionAmount = transactionAmount;
        this.paymentMethod = paymentMethod;
        const timeStamp:Date = transactionTimeStamp;
        timeStamp.setHours(timeStamp.getHours()+5);
        timeStamp.setMinutes(timeStamp.getMinutes()+30);
        this.transactionTimeStamp = timeStamp;
        this.transactionStatus = transactionStatus;
    }

    generateTransaction(): string {
        return `TXN-${Math.floor(Math.random() * 9000000) + 1000000}-${Math.floor(Math.random() * 9000000) + 1000000}`;
    }
}