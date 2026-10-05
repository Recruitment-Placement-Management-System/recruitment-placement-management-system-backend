import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  resetUrl: string;
}

export const PasswordResetEmail = ({
  resetUrl,
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your R&PMS password</Preview>

      <Body>
        <Container>
          <Heading>Reset your password</Heading>

          <Text>
            We received a request to reset your password for your
            Recruitment & Placement Management System account.
          </Text>

          <Text>
            Click the button below to choose a new password.
          </Text>

          <Button
            href={resetUrl}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Reset Password
          </Button>

          <Text>
            This link will expire in 15 minutes. If you did not
            request a password reset, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};