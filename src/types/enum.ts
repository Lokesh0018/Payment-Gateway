export type UserType = {
    username: string;
    email: string;
    phno: string;
    password:string;
}

export type Credit = {
    cardNumber: number;
    cvv: number;
    expiry:string;
};

export type Debit = {
    cardNumber: number;
    cvv: number;
    expiry:string;
};

export type UPI = {
    paymentId: string;
};

export type Wallet = {
    paymentId: string;
};

export type Banking = {
    bankCode: string;
    bankName:string;
}

export type PaymentMethods = {
    creditCard?: Credit[];
    debitCard?: Debit[];
    upi?: UPI[];
    wallet?: Wallet[];
};

export type PaymentType = "Credit Card" | "Debit Card" | "UPI" | "Wallet" | "Net Banking";

export type TransactionStatus = "Success" | "Failed" | "Refunded";