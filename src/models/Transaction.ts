import { PaymentType } from "../types/enums";

export default class Transaction {

    userId: string;
    transactionId: string;
    paymentMethod:PaymentType;
    transactionAmount: number;
    transactionTimeStamp:Date;
    transactionStatus: "Success" | "Failed" | "Refunded";

    constructor(userId: string, paymentMethod:PaymentType, transactionAmount: number,transactionTimeStamp:Date, transactionStatus: "Success" | "Failed" | "Refunded") {
        this.userId = userId;
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