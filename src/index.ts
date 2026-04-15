/** @types/node */
declare var process: any;
import promptSync from "prompt-sync";
import UserService from "./services/UserService";
import PaymentService from "./services/PaymentService";
import PaymentFactory from "./factory/PaymentFactory";
import User from "./models/User";
import PaymentRepository from "./repository/PaymentRepository";
import PaymentMethod from "./payment methods/PaymentMethod";
import CreditCard from "./payment methods/CreditCard";

const prompt = promptSync();

function main() {
    let currentUser: User | null = null;

    while (true) {
        if (!currentUser) {
            console.log("💳 Welcome to PayEase Payment System\n");
            console.log("\n1. Register\n2. Login\n3. Exit\n");
            const choice = parseInt(prompt("Choice: "));

            if (choice === 1) UserService.registerUser();

            else if (choice === 2) currentUser = UserService.loginUser();

            else if (choice === 3) process.exit(0);
        }
        else {
            console.log(`👤 Dashboard\n`);
            console.log("1. Make Payment\n2. View Saved Methods\n3. View Transactions\n4. Request Refund\n5. Logout\n");

            const choice = parseInt(prompt("Choice: "));

            switch (choice) {
                case 1:
                    const creditCard: PaymentMethod | undefined = PaymentRepository.getCreditCard(currentUser.getEmail());
                    if (!creditCard) {
                        const creditCardNumber = parseInt(prompt("Enter Card Number: "));
                        const creditCardCVV = parseInt(prompt("Enter CVV: "));
                        const creditExpiry = prompt("Enter Expiry: ");
                        if (!PaymentService.validateCardDetails({ cardNumber: creditCardNumber, cvv: creditCardCVV, expiry: creditExpiry }))
                            break;
                        const cCard:CreditCard = PaymentFactory.createPaymentMethod("Credit Card",{cardNumber:creditCardNumber,cvv:creditCardCVV, expiry:creditExpiry}) as CreditCard;
                        PaymentRepository.addPaymentMethod(currentUser,cCard);
                    }
                    else{
                        const amount:number = parseInt(prompt("Enter Amount: "));
                        PaymentService.processPayment(currentUser,creditCard,amount);
                    }
                    break;

                case 2:
                    const debitCardNumber = parseInt(prompt("Card Number: "));
                    const debitCardCVV = parseInt(prompt("CVV: "));
                    const debitExpiry = prompt("Enter Expiry: ");
                    PaymentService.validateCardDetails({ cardNumber: debitCardNumber, cvv: debitCardCVV, expiry: debitExpiry });
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
            }
        }
    }
}

main();