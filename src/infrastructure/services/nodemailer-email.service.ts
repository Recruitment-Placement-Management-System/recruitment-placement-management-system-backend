
import nodemailer from "nodemailer";
import { render } from "@react-email/render";

import type { IEmailService } from "../../application/interfaces/services/email.service.js";
import { env } from "../../config/env.js";
import { VerificationEmail } from "../email/templates/verification-email.js";
import { PasswordResetEmail } from "../email/templates/password-reset.js";

export class NodemailerEmailService implements IEmailService {
  private readonly transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_APP_PASSWORD,
    },
  });

  async sendVerificationEmail(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    const html = await render(
      VerificationEmail({ verificationCode }),
    );

    await this.transporter.sendMail({
      from: `"R&PMS" <${env.SMTP_USER}>`,
      to: email,
      subject: "Verify your R&PMS account",
      html,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `http://localhost:5173/reset-password?token=${encodeURIComponent(resetToken)}`;

    const html = await render(
      PasswordResetEmail({resetUrl})
    )

    await this.transporter.sendMail({
      from:`R&PMS <${env.SMTP_USER}>`,
      to:email,
      subject:"Reset your R&PMS password",
      html,
    })

  }
}
