// config/email.js
const emailConfig = {
    // Default configuration that can be overridden by environment variables
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    // Admin notification settings
    adminNotifications: {
      recipients: process.env.ADMIN_EMAIL_RECIPIENTS?.split(',') || [],
      defaultSubject: 'Game Mixer Notification'
    },
    // Email templates configuration
    templates: {
      baseDir: process.env.EMAIL_TEMPLATES_DIR || 'templates/email',
      defaultLocale: process.env.DEFAULT_LOCALE || 'en'
    }
  };
  
  export default emailConfig;