/** @types/node */
declare var process: any;
import promptSync from "prompt-sync";
import UserService from "./services/UserService";
import UserRepository from "./repository/UserRepository";
import PaymentService from "./services/PaymentService";
import PaymentFactory from "./factory/PaymentFactory";

const prompt = promptSync();

function main() {
    let currentUser: string | null = null;

    while (true) {
        if (!currentUser) {
            console.log("\n1 -> Register\n2 -> Login\n0 -> Exit");
            const choice = parseInt(prompt("Choice: "));

            if (choice === 1) UserService.registerUser();

            else if (choice === 2) currentUser = UserService.loginUser();

            else if (choice === 0) process.exit(0);
        } 
        else {
            console.log(`\nWelcome ${currentUser}`);
            console.log("1 -> Credit Card\n2 -> Debit Card\n3 -> UPI\n4 -> Wallet\n5 -> Net Banking\n6 -> Logout");

            const choice = parseInt(prompt("Choice: "));
            const user = UserRepository.getUser(currentUser)!;

            switch (choice) {
                case 1:
                    const creditCardNumber = parseInt(prompt("Card Number: "));
                    const creditCardCVV = parseInt(prompt("CVV: "));
                    if(!PaymentService.validateCardDetails({cardNumber: creditCardNumber, cvv: creditCardCVV}))
                        break;
                    const creditCard = PaymentFactory.createPaymentMethod("Credit Card",{cardNumber:creditCardNumber,cvv:creditCardCVV});
                    break;

                case 2:
                    const debitCardNumber = parseInt(prompt("Card Number: "));
                    const debitCardCVV = parseInt(prompt("CVV: "));
                    PaymentService.validateCardDetails({cardNumber: debitCardNumber, cvv: debitCardCVV});
                    break;

                case 3:
                    const upiId = prompt("UPI ID: ");
                    break;
                case 4:
                    const walletNumber = prompt("Wallet Number: ");
                    break;
                case 5:
                    const bankName = prompt("Bank Name: ");
                    const accountNumber = prompt("Account Number: ");
                    break;
                case 6:
                    currentUser = null;
                    break;
            }
        }
    }
}

main();