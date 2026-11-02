export interface IEmailService{
    sendVerificationEmail(
        email:string,
        verificationCode:string,
    ):Promise<void>;

    sendPasswordResetEmail(
        email:string,
        resetToken:string,
    ):Promise<void>;
}