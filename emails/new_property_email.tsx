import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface NewPropertyEmailProps {
    name?: string;
    slogan?: string;
    location?: string;
    min_price?: string;
    max_price?: string;
    status?: string;
    percent?: string;
    description?: string;
}

export const NewPropertyEmail = ({
    name,
    slogan,
    location,
    min_price,
    max_price,
    status,
    percent,
    description,
}: NewPropertyEmailProps) => (
    <Html>
        <Head />
        <Preview>New Property Notification</Preview>
        <Body style={main}>
            <Container style={container}>
                <Img
                    src="https://dmci-agent-bakit.s3.ap-southeast-1.amazonaws.com/logo/dmci-logo-only.png"
                    height="170"
                    alt="DMCI Homes Logo"
                    style={logo}
                />
                <Heading style={h1}>New Property Notification!</Heading>
                <Text style={text}>
                    Hello {name},
                </Text>
                <Text style={text}>
                    A new inquiry with the following details:
                </Text>
                <Text style={text}>
                    <b>Viewing Details:</b>
                </Text>
                <Text style={text}>
                    <b>Property Name:</b> {name}<br />
                    <b>Slogan:</b> {slogan}<br />
                    <b>Location:</b> {location}<br />
                    <b>Price:</b> {min_price} - {max_price}<br />
                    <b>Status:</b> {status}<br />
                    <b>Percent:</b> {percent}<br />
                    <b>Description:</b> {description}<br />
                </Text>

                <Text style={text}>
                    Please log in to your account for additional property information.
                </Text>
                <Text style={text}>
                    If you have any questions, our support team is here to help.
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
    backgroundColor: '#ffffff',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '560px',
};

const logo = {
    margin: '0 auto',
    marginBottom: '24px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
};

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const button = {
    backgroundColor: '#0070f3',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
};

const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
};