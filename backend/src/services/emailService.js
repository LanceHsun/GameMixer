// src/services/emailService.js
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const sesClient = new SESClient();

class EmailService {
  constructor(senderEmail) {
    this.senderEmail = senderEmail;
  }

  // 基础邮件发送方法
  async sendEmail(to, subject, body) {
    const params = {
      Source: this.senderEmail,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: body } },
      },
    };

    try {
      await sesClient.send(new SendEmailCommand(params));
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email: ' + error.message);
    }
  }

  // Contact Form 相关邮件
  async sendContactConfirmation(name, email, category, message) {
    const subject = category 
      ? `Thank you for contacting Game Mixer - ${category}`
      : 'Thank you for contacting Game Mixer';

    const body = `Dear ${name},

Thank you for contacting us${category ? ` regarding ${category}` : ''}. We have received your message and will get back to you soon.

Your message:
${message}

Best regards,
Game Mixer Team`;

    await this.sendEmail(email, subject, body);
  }

  async sendContactNotification(name, email, category, message) {
    const subject = `New Contact Form Submission - ${category || 'General'}`;

    const body = `New contact form submission received:

From: ${name}
Email: ${email}
Category: ${category || 'Not specified'}

Message:
${message}

Action Required:
Please review and respond to this inquiry within 24 hours.

Note: Timely response helps maintain good communication with our community.`;

    await this.sendEmail(this.senderEmail, subject, body);
  }

  // Monetary Donation 相关邮件
  async sendMonetaryDonationInstructions(email, amount, donationId) {
    const subject = 'Game Mixer - Donation Payment Instructions';
    const body = `Dear Donor,

Thank you for your generous donation of $${amount}! Please follow these steps to complete your donation:

1. Open your Zelle app or banking app with Zelle
2. Send payment to: ${this.senderEmail}
3. Amount to send: $${amount}
4. Important: Include this Donation ID in the memo: ${donationId}

Once you’ve completed the payment, we will send you a donation receipt. If you do not receive the receipt within 24 hours of a successful payment, please contact us again at ${this.senderEmail}

Thank you for supporting Game Mixer!

Best regards,
Game Mixer Team`;

    await this.sendEmail(email, subject, body);
  }

  async sendMonetaryDonationNotification(email, amount, donationId) {
    const subject = 'New Monetary Donation Received';
    const body = `New monetary donation initiated:

Amount: $${amount}
Contact Email: ${email}
Donation ID: ${donationId}
Status: PENDING

IMPORTANT ACTION REQUIRED:
1. Please check your Zelle account for the incoming payment of $${amount}
2. Once payment is received, please verify the donation and send a receipt to the donor
3. Use the Donation ID above when verifying the payment

Note: Timely verification helps maintain donor trust.`;

    await this.sendEmail(this.senderEmail, subject, body);
  }

  // Goods Donation 相关邮件
  async sendGoodsDonationConfirmation(email, donationType, details, donationId) {
    const subject = 'Thank You for Your Donation Offer';
    const body = `Dear Donor,

Thank you for your generous donation offer! We have received your submission and will contact you soon to discuss the details.

Donation Details:
Type: ${donationType}
Description: ${details}

Reference Number: ${donationId}

We greatly appreciate your support and will be in touch shortly!

Best regards,
Game Mixer Team`;

    await this.sendEmail(email, subject, body);
  }

  async sendGoodsDonationNotification(email, donationType, details, donationId) {
    const subject = 'New Goods Donation Offer Received';
    const body = `New goods donation offer received:

Type: ${donationType}
Description: ${details}
Contact Email: ${email}
Donation ID: ${donationId}

Action Required:
Please contact the donor within 24 hours to discuss:
- Verify item condition and specifications
- Arrange logistics for collection/delivery
- Confirm acceptance of donation

Next Steps:
1. Review donation details
2. Contact donor within 24 hours`;

    await this.sendEmail(this.senderEmail, subject, body);
  }
}

// 导出单例实例
const emailService = new EmailService(process.env.SENDER_EMAIL);
module.exports = emailService;