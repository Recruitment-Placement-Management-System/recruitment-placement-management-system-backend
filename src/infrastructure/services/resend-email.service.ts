// import { Resend } from "resend";
// import { IEmailService } from "../../application/interfaces/services/email.service.js";
// import { env } from "../../config/env.js";
// import { VerificationEmail } from "../email/templates/verification-email.js";

// export class ResendEmailService implements IEmailService{
//     private readonly resend:Resend;

//     constructor(){
//         this.resend = new Resend(env.RESEND_API_KEY);
//     }

//     async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
//         const {error} = await this.resend.emails.send({
//             from:env.EMAIL_FROM,
//             to:email,
//             subject:'Verify your R&PMS account',
//             react:VerificationEmail({verificationCode}),
//         });

//         if(error){
//             throw new Error(
//                 `Failed to send verification email:${error.message}`,
//             );
//         }
//     }

//     async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
//         void email;
//         void resetToken;
//     }
// }