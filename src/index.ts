declare var process: any;
import promptSync from "prompt-sync";
import UserService from "./services/UserService";
import PaymentService from "./services/PaymentService";
import User from "./models/User";
import TransactionService from "./services/TransactionService";

const prompt = promptSync();

function main() {
    let currentUser: User | null = null;

    while (true) {
        if (!currentUser) {
            console.log("\n💳 Welcome to PayEase Payment System\n");
            console.log("\n1. Register\n2. Login\n3. Exit\n");
            const choice = parseInt(prompt("Choice: "));

            if (choice === 1) UserService.registerUser();

            else if (choice === 2) currentUser = UserService.loginUser();

            else if (choice === 3) process.exit(0);
        }
        else {
            console.log(`\n👤 Dashboard\n`);
            console.log("1. Make Payment\n2. View Saved Methods\n3. View Transactions\n4. Request Refund\n5. Logout\n");
            const choice = parseInt(prompt("Choice: "));
            switch (choice) {
                case 1:
                    console.log("\nSelect Payment Method: \n");
                    console.log("1. Credit Card\n2. Debit Card\n3. UPI\n4. Wallet\n5. Net Banking\n");
                    const paymentChoice: number = parseInt(prompt("Enter Payment Method: "));
                    switch (paymentChoice) {
                        case 1:
                            const creditCard = PaymentService.getPaymentMethod("Credit Card", currentUser.getEmail());
                            if (!creditCard) {
                                const cardNumber = parseInt(prompt("Enter Card Number: "));
                                const cvv = parseInt(prompt("Enter CVV: "));
                                const expiry = prompt("Enter Expiry: ");
                                if (!PaymentService.validateCardDetails({ cardNumber: cardNumber, cvv: cvv, expiry: expiry }))
                                    break;
                                const card = PaymentService.createPaymentMethod("Credit Card", { cardNumber: cardNumber, cvv: cvv, expiry: expiry });
                                PaymentService.addPaymentMethod(currentUser, card);
                            }
                            else {
                                const amount: number = parseInt(prompt("Enter Amount: "));
                                PaymentService.processPayment(currentUser, creditCard, amount);
                            }
                            break;

                        case 2:
                            const debitCard = PaymentService.getPaymentMethod("Debit Card", currentUser.getEmail());
                            if (!debitCard) {
                                const cardNumber = parseInt(prompt("Enter Card Number: "));
                                const cvv = parseInt(prompt("Enter CVV: "));
                                const expiry = prompt("Enter Expiry: ");
                                if (!PaymentService.validateCardDetails({ cardNumber: cardNumber, cvv: cvv, expiry: expiry }))
                                    break;
                                const card = PaymentService.createPaymentMethod("Debit Card", { cardNumber: cardNumber, cvv: cvv, expiry: expiry });
                                PaymentService.addPaymentMethod(currentUser, card);
                            }
                            else {
                                const amount: number = parseInt(prompt("Enter Amount: "));
                                PaymentService.processPayment(currentUser, debitCard, amount);
                            }
                            break;

                        case 3:
                            const upi = PaymentService.getPaymentMethod("UPI", currentUser.getEmail());
                            if (!upi) {
                                const upiId = prompt("Enter UPI Id: ");
                                const upiPin = parseInt(prompt("Enter UPI Pin: "));
                                if (!PaymentService.validateUpi({ "upiId": upiId, "pin": upiPin }, currentUser.getPhno()))
                                    break;
                                const upi = PaymentService.createPaymentMethod("UPI", { "upiId": upiId, "pin": upiPin });
                                PaymentService.addPaymentMethod(currentUser, upi);
                            }
                            else {
                                const amount: number = parseInt(prompt("Enter Amount: "));
                                PaymentService.processPayment(currentUser, upi, amount);
                            }
                            break;
                        case 4:
                            const wallet = PaymentService.getPaymentMethod("Wallet", currentUser.getEmail());
                            if (!wallet) {
                                const walletId = prompt("Enter Wallet Id: ");
                                const walletBalance = parseInt(prompt("Enter Available Balance: "));
                                if (!PaymentService.validateWallet({ "walletId": walletId, "balance": walletBalance }))
                                    break;
                                const wallet = PaymentService.createPaymentMethod("Wallet", { "walletId": walletId, "balance": walletBalance });
                                PaymentService.addPaymentMethod(currentUser, wallet);
                            }
                            else {
                                const amount:number = parseInt(prompt("Enter Amount: "));
                                PaymentService.processPayment(currentUser,wallet,amount);
                            }
                            break;
                        case 5:
                            const bankCode = prompt("Enter Bank Code: ");
                            const accNumber = parseInt(prompt("Enter Account Number: "));
                            if(!PaymentService.validateNetBanking({"bankCode":bankCode,"accountNumber":accNumber}))
                                break;
                            const banking = PaymentService.createPaymentMethod("Net Banking",{"bankCode":bankCode,"accountNumber":accNumber});
                            const amount:number = parseInt(prompt("Enter Amount: "));
                            PaymentService.processPayment(currentUser,banking,amount);
                            break;
                        default:
                            console.log("❌ Invalid Payment Method");
                            break;
                    }
                    break;
                case 2:
                    console.log("\nSaved Methods:\n");
                    PaymentService.getPaymentMethods(currentUser!.getEmail());
                    break;
                case 3:
                    console.log("\nTransaction History:\n");
                    TransactionService.printTransactions(currentUser.getEmail());
                    break;
                case 4:
                    PaymentService.refund(currentUser.getEmail());
                    break;
                case 5:
                    currentUser = null;
                    console.log("\n👋 Logged out successfully!\n");
                    break;
                default:
                    console.log("\n Invalid Choice !");
                    break;
            }
        }
    }
}

main();