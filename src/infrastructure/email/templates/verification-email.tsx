import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  verificationCode: string;
}

export const VerificationEmail = ({
  verificationCode,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your R&PMS account</Preview>

      <Body>
        <Container>
          <Heading>Verify your email</Heading>

          <Text>
            Thank you for registering with the Recruitment & Placement
            Management System.
          </Text>

          <Text>Your verification code is:</Text>

          <Section>
            <Text>
              <strong>{verificationCode}</strong>
            </Text>
          </Section>

          <Text>This code will expire in 10 minutes.</Text>
        </Container>
      </Body>
    </Html>
  );
};