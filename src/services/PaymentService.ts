import promptSync from "prompt-sync"; import Transaction from "../models/Transaction";
import User from "../models/User";
import PaymentMethod from "../payment methods/PaymentMethod";
import TransactionRepository from "../repository/TransactionRepository";
import { Credit, Debit } from "../types/enum";
import PaymentRepository from "../repository/PaymentRepository";

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

        const expiry = cardDetails.expiry.split("/");
        const expiryMonth = parseInt(expiry[0]);
        const expiryYear = parseInt(expiry[1]);

        if (!expiryMonth || !expiryYear || expiryMonth < 1 || expiryMonth > 12) {
            console.log("❌ Invalid Expiry Date");
            return false;
        }

        const date = new Date();
        const year = date.getFullYear() % 100;
        const month = date.getMonth() + 1;

        if (year > expiryYear || (year === expiryYear && month > expiryMonth)) {
            console.log("❌ Card Expired");
            return false;
        }
        return true;
    }

    static processPayment(user: User, paymentMethod: PaymentMethod, amount: number): void {
        console.log("\nProcessing Payment...");
        const tax = paymentMethod.calculateFee(amount);
        const totalAmount = amount + tax;

        const transaction = new Transaction(user.getEmail(), paymentMethod.getPaymentType(), totalAmount, new Date(), "Failed");

        if (!paymentMethod.checkLimit(totalAmount)) {
            console.log("❌ Error Daily limit exceeded!");
            TransactionRepository.addTransaction(transaction);
            return;
        }

        if (paymentMethod.requireOtp()) {
            console.log("\n🔐 OTP Required")
            const otp: number = paymentMethod.generateOtp();
            let enteredOtp = parseInt(prompt("Enter OTP: "));

            while (!paymentMethod.verifyOtp(enteredOtp)) {
                console.log("\n❌ Payment Failed: Invalid OTP\n");
                console.log("\n1. Try Again\n2. Cancle Payment\n");
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
        }

        paymentMethod.setDailyLimit(paymentMethod.getDailyLimit() - totalAmount);

        console.log("\n✅ Payment Successful!");
        transaction.transactionStatus = "Success";
        TransactionRepository.addTransaction(transaction);
        console.log(`\nTransaction Id: ${transaction.transactionId}`)
    }

    static refund(email: User["email"]) {
        const transactionId: string = prompt("Enter Transaction Id: ");
        console.log("\nChecking Refund Eligibility...\n");
        const transactions = TransactionRepository.getTransactions(email);
        const transaction = transactions.find(
            (t) => t.transactionId === transactionId
        );

        if (!transaction) {
            console.log("\n❌ Refund Failed: Transaction not found");
            return;
        }

        if (transaction.transactionStatus === "Refunded") {
            console.log("\nAlready Refunded !");
            return;
        }

        if(transaction.transactionStatus === "Failed") {
            console.log("\n❌ It was a Failed Transaction !");
            return;
        }

        const paymentType = transaction.paymentMethod;
        const paymentMethod = PaymentRepository.getPaymentMethod(paymentType,email); 
        let amount = transaction.transactionAmount;
        amount -= paymentMethod?.calculateFee(amount) ?? 0;
        paymentMethod!.setDailyLimit(paymentMethod!.getDailyLimit() + amount);
        transaction.transactionStatus = "Refunded";
        console.log("\n✅ Refund Initiated Successfully!");
    }
}