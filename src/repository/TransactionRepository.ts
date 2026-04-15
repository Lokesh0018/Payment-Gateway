import Transaction from "../models/Transaction";
import User from "../models/User";

export default class TransactionRepository {

    static #TransactionRepo: Record<User["email"], Transaction[]> = {};

    static addTransaction(transaction: Transaction): void {
        const userId: string = transaction.email;
        if (!this.#TransactionRepo[userId])
            this.#TransactionRepo[userId] = [];
        this.#TransactionRepo[userId].push(transaction);
    }

    static getTransactions(userId: string): Transaction[] {
        return this.#TransactionRepo[userId] || [];
    }

}