import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Parse request body
    const { email, message } = await request.json();

    // Validate inputs
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Email content
    const emailData = {
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev', // Default Resend sender or your verified domain
      to: process.env.MY_EMAIL || 'sraz.sw@gmail.com', // Your email address
      subject: `Portfolio Contact Form Submission from ${email}`,
      html: `
        <h3>New message from your portfolio contact form</h3>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
      // Optional: text fallback
      text: `You have received a new message from your portfolio website:
        
From: ${email}

Message: ${message}
      `,
      reply_to: email // Enable easy replies directly to the sender
    };

    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY not set, email would be sent with these details:', emailData);
      
      // Return success for development without actual API key
      return NextResponse.json({ success: true, message: 'Email would be sent (development mode)' });
    }

    // Send email
    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Error from Resend API:', error);
      return NextResponse.json(
        { success: false, message: `Email error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully', 
      id: data?.id 
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
} 