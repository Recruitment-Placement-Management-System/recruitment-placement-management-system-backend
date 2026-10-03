
import nodemailer from "nodemailer";
import { render } from "@react-email/render";

import type { IEmailService } from "../../application/interfaces/services/email.service.js";
import { env } from "../../config/env.js";
import { VerificationEmail } from "../email/templates/verification-email.js";

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
    // Implement when password reset is developed.
    void email;
    void resetToken;
  }
}
