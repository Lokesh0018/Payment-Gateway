export type UserType = {
    username: string;
    email: string;
    phno: string;
}

export type Credit = {
    cardNumber: number;
    cvv: number;
};

export type Debit = {
    cardNumber: number;
    cvv: number;
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
