export  default interface OtpVerifiables {
    requireOTP():boolean;
    generateOtp():number;
    verifyOtp(otp:number):boolean;
}