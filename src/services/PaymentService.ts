import promptSync from "prompt-sync"; import Transaction from "../models/Transaction";
import User from "../models/User";
import PaymentMethod from "../payment methods/PaymentMethod";
import TransactionRepository from "../repository/TransactionRepository";
import { Credit, Debit } from "../types/enum";

const prompt = promptSync();

export default class PaymentService {

    static validateCardDetails(cardDetails: Credit | Debit) {
        if (!cardDetails.cardNumber || typeof cardDetails.cardNumber !== "number" || Math.ceil(Math.log10(cardDetails.cardNumber)) !== 16) {
            console.log("❌ Invalid Card Number")
            return false;
        }

        if (!cardDetails.cvv || typeof cardDetails.cvv !== "number" || Math.ceil(Math.log10(cardDetails.cvv)) !== 3) {
            console.log("❌ Invalid CVV");
            return false;
        }
        const date = new Date();
        const expiry = cardDetails.expiry.split("/");
        if (!expiry || expiry.length !== 2 || date.getFullYear() < parseInt(expiry[1]) || (date.getFullYear() === parseInt(expiry[1]) && date.getMonth() > parseInt(expiry[0]))) {
            console.log("❌ Card Expired");
            return false;
        }
        return true;
    }

    static processPayment(user: User, paymentMethod: PaymentMethod, amount: number):void {
        console.log("Processing Payment...");
        const tax = paymentMethod.calculateFee(amount);
        const totalAmount = amount + tax;

        const transaction = new Transaction(user.getEmail(), paymentMethod.getPaymentType(), totalAmount, new Date(), "Failed");

        if (!paymentMethod.checkLimit(totalAmount)) {
            console.log("❌ Error Daily limit exceeded!");
            TransactionRepository.addTransaction(transaction);
            return;
        }

        if (paymentMethod.requireOtp()) {
            console.log("🔐 OTP Required")
            const otp: number = paymentMethod.generateOtp();
            let enteredOtp = parseInt(prompt("Enter OTP: "));

            while (!paymentMethod.verifyOtp(enteredOtp)) {
                console.log("❌ Payment Failed: Invalid OTP");
                console.log("1. Try Again\n2. Cancle Payment");
                const choice = parseInt(prompt("Enter choice: "));
                switch (choice) {
                    case 1:
                        enteredOtp = parseInt(prompt("Enter OTP: "));
                        break;
                    case 2:
                        TransactionRepository.addTransaction(transaction);
                        return;
                    default:
                        console.log("❌ Invalid Choice");
                }
            }
            TransactionRepository.addTransaction(transaction);
        }

        paymentMethod.setDailyLimit(paymentMethod.getDailyLimit() - totalAmount) ;

        console.log("✅ Payment Successful!");
        transaction.transactionStatus = "Success";
        TransactionRepository.addTransaction(transaction);
        console.log(`Transaction Id: ${transaction.transactionId}`)
    }

    refund(user:User,transactionId: string, paymentMethod: PaymentMethod, amount: number): boolean {
        console.log("Refund Processing");
        const transactions = TransactionRepository.getTransactions(user.getEmail());
        const transaction = transactions.find(
            (t) => t.transactionId === transactionId
        );
        if (!transaction) {
            console.log("Refund Failed: Transaction not found");
            return false;
        }
        if (transaction.transactionStatus !== "Success") {
            console.log("Refund Failed: Not a successful transaction");
            return false;
        }
        paymentMethod.setDailyLimit(paymentMethod.getDailyLimit() + amount);
        transaction.transactionStatus = "Refunded";
        console.log("Refund Success");
        return true;
    }
}