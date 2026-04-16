export default interface OtpVerifiable {
    requireOtp():boolean;
    generateOtp():number;
    verifyOtp(otp:number):boolean;
}