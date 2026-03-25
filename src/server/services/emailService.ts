import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.init();
  }

  private init() {
    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT) || 587;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
      this.isConfigured = true;
      console.log('✅ [EmailService] SMTP connection initialized.');
    } else {
      console.warn('⚠️ [EmailService] SMTP credentials not fully configured. Operating in dev fallback mode.');
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ [EmailService] Failed to send email in PRODUCTION: No SMTP config');
        return false;
      }
      // Fallback in dev
      this.logMockEmail(options);
      return true;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"صيدلية عبدالكريم" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log(`✅ [EmailService] Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error('❌ [EmailService] Failed to send email via SMTP:', error);
      if (process.env.NODE_ENV !== 'production') {
        console.log('Falling back to mock email in DEV mode...');
        this.logMockEmail(options);
        return true;
      }
      return false;
    }
  }

  private logMockEmail(options: EmailOptions) {
    console.log('\n======================================================');
    console.log(`📩 [MOCK EMAIL SENT TO]: ${options.to}`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log(`CONTENT (HTML): (Open terminal safely to view markup)\n${options.html.substring(0, 300)}...`);
    console.log('======================================================\n');
  }

  async sendPasswordResetEmail(to: string, name: string, token: string): Promise<boolean> {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${encodeURIComponent(token)}`;
    
    const html = `
      <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; padding: 40px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-top: 5px solid #10b981;">
          <h2 style="color: #111827; margin-top: 0; font-size: 24px; font-weight: 900;">صيدلية عبدالكريم 🌿</h2>
          <h3 style="color: #374151; font-size: 18px; margin-bottom: 20px;">طلب إعادة تعيين كلمة المرور</h3>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            مرحباً يا <strong>${name}</strong>,<br/><br/>
            تلقينا طلباً من أجل إعادة تعيين كلمة المرور الخاصة بحسابك في صيدلية عبدالكريم.
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; margin: 30px 0; text-align: center;">
            <p style="font-size: 14px; color: #6b7280; margin-top: 0; margin-bottom: 10px; font-weight: bold;">كود الاستعادة الخاص بك:</p>
            <span style="font-size: 28px; font-weight: 900; letter-spacing: 6px; color: #10b981; font-family: monospace;">${token}</span>
          </div>

          <p style="text-align: center; color: #4b5563; font-size: 15px;">أو لسهولة أكبر، اضغط على الزر أدناه:</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetLink}" style="background-color: #10b981; color: white; padding: 16px 36px; border-radius: 12px; text-decoration: none; font-weight: 900; display: inline-block; font-size: 16px;">تعيين كلمة المرور 🔒</a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0;">
              إذا لم تقم بطلب هذا التغيير، يُرجى تجاهل هذا البريد الإلكتروني.<br/>لا تشارك هذا الكود مع أي شخص أبداً.
            </p>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: '🔐 صيدلية عبدالكريم - استعادة كلمة المرور',
      html,
    });
  }
}

export const emailService = new EmailService();
