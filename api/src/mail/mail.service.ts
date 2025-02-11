import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
// import * as fs from 'fs';
// import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private confirmationTemplate: handlebars.TemplateDelegate;
  private passwordResetTemplate: handlebars.TemplateDelegate;
  private groupInviteTemplate: handlebars.TemplateDelegate;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAIL_HOST,
      secure: process.env.MAILER_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // {
    //   from: {
    //     name: 'No-reply',
    //     address: process.env.MAIL_FROM,
    //   },
    // },
    // // // Load Handlebars templates
    // this.confirmationTemplate = this.loadTemplate('confirmation.hbs');
  }

  // private loadTemplate(templateName: string): handlebars.TemplateDelegate {
  //   const templatesFolderPath = path.join(__dirname, './templates');
  //   const templatePath = path.join(templatesFolderPath, templateName);

  //   const templateSource = fs.readFileSync(templatePath, 'utf8');
  //   return handlebars.compile(templateSource);
  // }
  async sendResetPasswordEmail(email: string, code: string) {
    // const resetLink = `https://yourfrontend.com/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset.</p>
             <p>the Code below to reset your password:</p>
           <h2>  ${code}</h2>
             <p>This code will expire in 10 minutes.</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendUserConfirmation() {
    // const url = `${process.env.CLIENT_URL}?token=${token}`;
    // const html = this.confirmationTemplate({ name: user.firstName, url });

    try {
      await this.transporter.sendMail({
        to: 'mahmoudg.dev@gmail.com',
        subject: 'Welcome user! Confirm your Email',
        text: 'Hi from server',
      });
    } catch (err) {
      console.log(err);
    }
  }

  // Other email sending methods...
}
