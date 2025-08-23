import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  cc?: string;
  bcc?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      ...options,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export function generateApplicationEmailTemplate(
  type: string,
  applicationId: string,
  customerName: string,
  details: any
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #102a43; color: white; padding: 20px; text-align: center; }
            .logo { width: 60px; height: 60px; margin: 0 auto 15px; }
            .content { padding: 20px; }
            .footer { background-color: #f4f4f4; padding: 15px; text-align: center; }
            .highlight { background-color: #f59e0b; color: white; padding: 10px; border-radius: 5px; display: inline-block; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">
                <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://perryedengroup.com'}/company_logo_transparent.png" 
                     alt="Perry Eden Group Logo" 
                     style="width: 60px; height: 60px; object-fit: contain;">
            </div>
            <h1>Perry Eden Group</h1>
            <p>Your ${type} Application Received</p>
        </div>
        <div class="content">
            <h2>Dear ${customerName},</h2>
            <p>Thank you for choosing Perry Eden Group. We have received your ${type} application.</p>
            
            <div class="highlight">
                <strong>Application ID: ${applicationId}</strong>
            </div>
            
            <h3>Application Details:</h3>
            <pre>${JSON.stringify(details, null, 2)}</pre>
            
            <p>Our team will review your application and contact you within 1-2 business days.</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
            <p>Perry Eden Group - Your Gateway to Global Success</p>
            <p>Contact: +971 XX XXX XXXX | Email: info@perryedengroup.com</p>
        </div>
    </body>
    </html>
  `;
}
