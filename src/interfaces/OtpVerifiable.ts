export interface RequireOtp {
    requireOtp():boolean;
}

export interface OtpMethods {
    generateOtp():number;
    verifyOtp(otp:number):boolean;
}