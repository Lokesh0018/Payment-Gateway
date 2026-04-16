import promptSync from "prompt-sync"; import Transaction from "../models/Transaction";
import User from "../models/User";
import PaymentMethod from "../payment methods/PaymentMethod";
import TransactionRepository from "../repository/TransactionRepository";
import { Banking, Credit, Debit, PaymentType, UPI, Wallet } from "../types/enum";
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

    static validateUpi(upiDetails:UPI,phno:string):boolean{
        const upiId = upiDetails.upiId;
        const upiPin = upiDetails.pin;
        const upi = upiId.split("@");
        if(!upiId || upi.length !== 2 || upi[0] !== phno){
            console.log("\n❌ Invalid UPI Id ");
            return false;
        }

        const pinLength = Math.ceil(Math.log10(upiPin));

        if(!upiPin || (pinLength !== 4 && pinLength !== 6)){
            console.log("\n❌ Invalid UPI Pin ");
        }

        return true;
    }

    static validateWallet(walletDetails:Wallet):boolean{
        const walletId = walletDetails.walletId;
        const balance = walletDetails.balance;
        if(!walletId){
            console.log("\n❌ Invalid Wallet Id");
            return false;
        }

        if(!balance){
            console.log("\n❌ Invalid Balance Amount");
            return false;
        }

        return true;
    }

    static validateNetBanking(bankingDetails:Banking){
        const bankCode = bankingDetails.bankCode;
        const accNumber = bankingDetails.accountNumber;

        if(!bankCode){
            console.log("\n❌ Invalid Bank Code");
            return false;
        }

        if(!accNumber || Math.ceil(Math.log10(accNumber)) !== 18){
            console.log("\n❌ Invalid Account Number");
            return false;
        }

        return true;
    }

    static processPayment(user: User, paymentMethod: PaymentMethod, amount: number): void {
        console.log("\nProcessing Payment...");
        if(!amount){
            console.log("❌ Invalid Amount");
            return;
        }
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

        const paymentType:PaymentType = transaction.paymentMethod;
        const paymentMethod = PaymentRepository.getPaymentMethod(paymentType,email); 

        if(!paymentMethod?.isRefundable()){
            console.log(`❌ ${paymentType} was not Eligible for Refund`);
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

        let amount = transaction.transactionAmount;
        amount -= paymentMethod?.calculateFee(amount) ?? 0;
        paymentMethod!.setDailyLimit(paymentMethod!.getDailyLimit() + amount);
        transaction.transactionStatus = "Refunded";
        console.log("\n✅ Refund Initiated Successfully!");
    }
}