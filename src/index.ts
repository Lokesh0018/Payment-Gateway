declare var process: any;
import promptSync from "prompt-sync";
import UserService from "./services/UserService";
import PaymentService from "./services/PaymentService";
import PaymentFactory from "./factory/PaymentFactory";
import User from "./models/User";
import PaymentRepository from "./repository/PaymentRepository";
import PaymentMethod from "./payment methods/PaymentMethod";
import CreditCard from "./payment methods/CreditCard";
import DebitCard from "./payment methods/DebitCard";
import TransactionRepository from "./repository/TransactionRepository";
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
                            const creditCard: PaymentMethod | undefined = PaymentRepository.getPaymentMethod("Credit Card", currentUser.getEmail());
                            if (!creditCard) {
                                const cardNumber = parseInt(prompt("Enter Card Number: "));
                                const cvv = parseInt(prompt("Enter CVV: "));
                                const expiry = prompt("Enter Expiry: ");
                                if (!PaymentService.validateCardDetails({ cardNumber: cardNumber, cvv: cvv, expiry: expiry }))
                                    break;
                                const card: CreditCard = PaymentFactory.createPaymentMethod("Credit Card", { cardNumber: cardNumber, cvv: cvv, expiry: expiry }) as CreditCard;
                                PaymentRepository.addPaymentMethod(currentUser, card);
                            }
                            else {
                                const amount: number = parseInt(prompt("Enter Amount: "));
                                PaymentService.processPayment(currentUser, creditCard, amount);
                            }
                            break;

                        case 2:
                            const debitCard: PaymentMethod | undefined = PaymentRepository.getPaymentMethod("Debit Card", currentUser.getEmail());
                            if (!debitCard) {
                                const cardNumber = parseInt(prompt("Enter Card Number: "));
                                const cvv = parseInt(prompt("Enter CVV: "));
                                const expiry = prompt("Enter Expiry: ");
                                if (!PaymentService.validateCardDetails({ cardNumber: cardNumber, cvv: cvv, expiry: expiry }))
                                    break;
                                const card: DebitCard = PaymentFactory.createPaymentMethod("Debit Card", { cardNumber: cardNumber, cvv: cvv, expiry: expiry }) as DebitCard;
                                PaymentRepository.addPaymentMethod(currentUser, card);
                            }
                            else {
                                const amount: number = parseInt(prompt("Enter Amount: "));
                                PaymentService.processPayment(currentUser, debitCard, amount);
                            }
                            break;

                        case 3:
                            const upiId = prompt("UPI ID: ");
                            break;
                        case 4:
                            const walletNumber = prompt("Wallet Number: ");
                            break;
                        case 5:
                            currentUser = null;
                            break;
                        default:
                            break;
                    }
                    break;
                case 2:
                    console.log("\nSaved Methods:\n");
                    PaymentRepository.getPaymentMethods(currentUser!.getEmail());
                    break;
                case 3:
                    console.log("\nTransaction History:\n");
                    TransactionRepository.printTransactions(currentUser.getEmail());
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