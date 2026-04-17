import Transaction from "../models/Transaction";
import User from "../models/User";

export default class TransactionRepository {

    private static TransactionRepo: Map<User["email"], Transaction[]> = new Map();

    static addTransaction(transaction: Transaction): void {
        const email: string = transaction.getEmail();
        if (!this.TransactionRepo.get(email))
            this.TransactionRepo.set(email,[]);
        this.TransactionRepo.get(email)?.push(transaction);
    }

    static getTransactions(email: string): Transaction[] {
        return this.TransactionRepo.get(email) || [];
    }

    static printTransactions(email:string):void {
        const transactions = this.getTransactions(email);
        if(!transactions){
            console.log("Empty Transactions!");
            return;
        }
        for(const t of transactions){
            console.log(`${t.getTransactionId()} ->  ₹${t.getTransactionAmount()} -> ${t.getTransactionStatus()}`);
        }
    }

}