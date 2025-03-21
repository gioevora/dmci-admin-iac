// app\api\email\property\submit\route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

import { NewPropertyEmail } from '@/emails/new_property_email';

export async function POST(req: Request) {
  const {  email, name, slogan, location, min_price, max_price, status, percent, description} = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const emailHtml = await render(
    NewPropertyEmail({
      name: "Agent",
      slogan: slogan,
      location: location,
      min_price: min_price,
      max_price: max_price,   
      status: status,   
      percent: percent,
      description: description,
    }),
  );

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "infinitech.fortune@gmail.com",
      subject: 'DMCI : New Property Notification!',
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    return NextResponse.json({
        status: "success",
        message: "Email sent successfully",
      });
      
}