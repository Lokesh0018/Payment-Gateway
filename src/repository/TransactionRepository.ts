import Transaction from "../models/Transaction";
import User from "../models/user";

export default class TransactionRepository {

    static #TransactionRepo: Record<User["userId"], Transaction[]> = {};

    static addTransaction(transaction: Transaction): void {
        const userId: string = transaction.userId;
        if (!this.#TransactionRepo[userId])
            this.#TransactionRepo[userId] = [];
        this.#TransactionRepo[userId].push(transaction);
    }

    static getTransactions(userId: string): Transaction[] {
        return this.#TransactionRepo[userId] || [];
    }

}