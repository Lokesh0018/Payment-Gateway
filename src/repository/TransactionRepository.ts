import Transaction from "../models/Transaction";
import User from "../models/User";

export default class TransactionRepository {

    private static TransactionRepo: Record<User["email"], Transaction[]> = {};

    static addTransaction(transaction: Transaction): void {
        const email: string = transaction.email;
        if (!this.TransactionRepo[email])
            this.TransactionRepo[email] = [];
        this.TransactionRepo[email].push(transaction);
    }

    static getTransactions(email: string): Transaction[] {
        return this.TransactionRepo[email] || [];
    }

    static printTransactions(email:string):void {
        const transactions = this.getTransactions(email);
        if(!transactions){
            console.log("Empty Transactions!");
            return;
        }
        for(const t of transactions){
            console.log(`${t.transactionId} ->  ₹${t.transactionAmount} -> ${t.transactionStatus}`);
        }
    }

}