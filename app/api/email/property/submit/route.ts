// app\api\email\property\submit\route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";

import { NewPropertyEmail } from "@/emails/new_property_email";

export async function POST(req: Request) {
  const { property, subscribers } = await req.json();

  const emails = subscribers.map((subscriber: { email: string }) => {
    return subscriber.email;
  });

  const uniqueEmails = [...new Set(emails)] as string[];

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const emailHtml = await render(
    NewPropertyEmail({
      name: property.name,
      slogan: property.slogan,
      location: property.location,
      description: property.description,
    })
  );

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: uniqueEmails,
    subject: "DMCI : New Property Notification!",
    html: emailHtml,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);

  return NextResponse.json({
    status: "success",
    message: "Email sent successfully",
  });
}
