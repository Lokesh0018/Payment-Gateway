import promptSync from "prompt-sync"; import Transaction from "../models/Transaction";
import User from "../models/User";
import PaymentMethod from "../payment methods/PaymentMethod";
import { Banking, Credit, Debit, PaymentType, UPI, Wallet } from "../types/Types";
import PaymentRepository from "../repository/PaymentRepository";
import TransactionService from "./TransactionService";
import PaymentFactory from "../patterns/PaymentFactory";
import CreditCard from "../payment methods/CreditCard";
import DebitCard from "../payment methods/DebitCard";
import Upi from "../payment methods/Upi";
import DigitalWallet from "../payment methods/DigitalWallet";
import NetBanking from "../payment methods/NetBanking";

const prompt = promptSync();

export default class PaymentService {

    static validateCardDetails(cardDetails: Credit | Debit): boolean {
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

    static validateUpi(upiDetails: UPI, phno: string): boolean {
        const upiId = upiDetails.upiId;
        const upiPin = upiDetails.pin;
        const upi = upiId.split("@");
        if (!upiId || upi.length !== 2 || upi[0] !== phno) {
            console.log("\n❌ Invalid UPI Id ");
            return false;
        }

        const pinLength = Math.ceil(Math.log10(upiPin));

        if (!upiPin || (pinLength !== 4 && pinLength !== 6)) {
            console.log("\n❌ Invalid UPI Pin ");
            return false;
        }

        return true;
    }

    static validateWallet(walletDetails: Wallet): boolean {
        const walletId = walletDetails.walletId;
        const balance = walletDetails.balance;
        if (!walletId) {
            console.log("\n❌ Invalid Wallet Id");
            return false;
        }

        if (!balance) {
            console.log("\n❌ Invalid Balance Amount");
            return false;
        }

        return true;
    }

    static validateNetBanking(bankingDetails: Banking) {
        const bankCode = bankingDetails.bankCode;
        const accNumber = bankingDetails.accountNumber;

        if (!bankCode) {
            console.log("\n❌ Invalid Bank Code");
            return false;
        }

        if (!accNumber || Math.ceil(Math.log10(accNumber)) !== 18) {
            console.log("\n❌ Invalid Account Number");
            return false;
        }

        return true;
    }

    static processPayment(user: User, paymentMethod: PaymentMethod, amount: number): void {
        console.log("\nProcessing Payment...");
        if (!amount) {
            console.log("❌ Invalid Amount");
            return;
        }
        const tax = paymentMethod.calculateFee(amount);
        const totalAmount = amount + tax;


        const transaction = new Transaction(user.getEmail(), paymentMethod.getPaymentType(), totalAmount, new Date(), "Failed");

        if (!paymentMethod.checkLimit(totalAmount)) {
            console.log("❌ Error Daily limit exceeded!");
            TransactionService.addTransaction(transaction);
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
                        TransactionService.addTransaction(transaction);
                        return;
                    default:
                        console.log("❌ Invalid Choice");
                        break;
                }
            }
        }

        paymentMethod.setDailyLimit(paymentMethod.getDailyLimit() - totalAmount);

        console.log("\n✅ Payment Successful!");
        transaction.setTransactionStatus("Success");
        TransactionService.addTransaction(transaction);
        console.log(`\nTransaction Id: ${transaction.getTransactionId()}`)
    }

    static refund(email: User["email"]): void {
        const transactionId: string = prompt("Enter Transaction Id: ");
        console.log("\nChecking Refund Eligibility...\n");
        const transactions = TransactionService.getTransactions(email);
        const transaction = transactions.find(
            (t) => t.getTransactionId() === transactionId
        );


        if (!transaction) {
            console.log("\n❌ Refund Failed: Transaction not found");
            return;
        }

        const paymentType: PaymentType = transaction.getPaymentMethod();
        const paymentMethod = PaymentRepository.getPaymentMethod(paymentType, email);

        if (!paymentMethod?.isRefundable()) {
            console.log(`❌ ${paymentType} was not Eligible for Refund`);
            return;
        }

        if (transaction.getTransactionStatus() === "Refunded") {
            console.log("\nAlready Refunded !");
            return;
        }

        if (transaction.getTransactionStatus() === "Failed") {
            console.log("\n❌ It was a Failed Transaction !");
            return;
        }

        let amount = transaction.getTransactionAmount();
        amount -= paymentMethod?.calculateFee(amount) ?? 0;
        paymentMethod!.setDailyLimit(paymentMethod!.getDailyLimit() + amount);
        transaction.setTransactionStatus("Refunded");
        console.log("\n✅ Refund Initiated Successfully!");
    }

    static getPaymentMethod(paymentType: PaymentType, email: User["email"]): PaymentMethod | undefined {
        return PaymentRepository.getPaymentMethod(paymentType, email);
    }

    static addPaymentMethod(user: User, paymentMethod: PaymentMethod): void {
        PaymentRepository.addPaymentMethod(user, paymentMethod);
    }

    static getPaymentMethods(email: User["email"]): void {
        PaymentRepository.getPaymentMethods(email);
    }

    static createPaymentMethod(paymentType: PaymentType, paymentDetails: Credit | Debit | UPI | Wallet | Banking): CreditCard | DebitCard | Upi | DigitalWallet | NetBanking {
        return PaymentFactory.createPaymentMethod(paymentType,paymentDetails)
    }
}