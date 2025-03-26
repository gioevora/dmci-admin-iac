import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NewPropertyEmailProps {
  name: string;
  slogan: string;
  location: string;
  description: string;
}

export const NewPropertyEmail = ({
  name,
  slogan,
  location,
  description,
}: NewPropertyEmailProps) => (
  <Html>
    <Head />
    <Preview>A New Property Has Been Added</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://dmci-agent-bakit.s3.ap-southeast-1.amazonaws.com/logo/dmci-logo-only.png"
          height="80"
          alt="DMCI Homes Logo"
          style={logo}
        />

        <Section>
          <Img
            src="https://dmci-agent-bakit.s3.amazonaws.com/properties/images/01JH7MWMTVXJE07AYRBR5SH6J6.webp"
            height="auto"
            width="1000"
            alt="DMCI Homes Logo"
            style={logo}
          />
        </Section>

        <Text style={text}>Good Day,</Text>
        <Text style={text}>
          We are excited to inform you that a new property has been added.
        </Text>
        <Text style={text}>
          <b>Property Details:</b>
        </Text>
        <Text style={text}>
          <b>Name:</b> {name}
          <br />
          <b>Slogan:</b> {slogan}
          <br />
          <b>Location:</b> {location}
          <br />
          <br />
          <b>Description:</b> {description}
        </Text>

        <Text style={text}>
          Please log in to your account to check out the new property or
          additional property information.
        </Text>
        <Text style={text}>Thank you for choosing DMCI Homes!</Text>
        <Hr style={hr} />
        <Text style={footer}>
          © 2025 DMCI Homes. All rights reserved.
          <br />
          Philippines
        </Text>
      </Container>
    </Body>
  </Html>
);

export default NewPropertyEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const logo = {
  margin: "0 auto",
  marginBottom: "24px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#0070f3",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
