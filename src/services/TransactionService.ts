import Transaction from "../models/Transaction";
import TransactionRepository from "../repository/TransactionRepository";

export default class TransactionService {
    static printTransactions(email: string): void {
        TransactionRepository.printTransactions(email);
    }

    static generateTransaction(): string {
        return `TXN-${Math.floor(Math.random() * 9000000) + 1000000}-${Math.floor(Math.random() * 9000000) + 1000000}`;
    }

    static addTransaction(transaction: Transaction): void {
        TransactionRepository.addTransaction(transaction);
    }

    static getTransactions(email: string): Transaction[] {
        return TransactionRepository.getTransactions(email);
    }
}