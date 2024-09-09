import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { passResetMessage, accountCreated } from 'src/sources/emails'; // Importa las funciones de templates

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_APPLICATION_GMAIL,
        pass: process.env.PASSWORD_APPLICATION_GMAIL,
      },
    });
  }

  // Método para enviar correo de registro usando el template `accountCreated`
  async sendRegistrationEmail(
    to: string,
    subject: string,
    name: string,
  ): Promise<void> {
    console.log('Preparing email to:', to);
    // Genera el mensaje usando la función de template `accountCreated`
    const htmlContent = accountCreated({ name }); // Asegúrate de que el objeto tenga la estructura correcta
    console.log('Email content:', htmlContent);

    const mailOptions = {
      from: process.env.EMAIL_APPLICATION_GMAIL,
      to,
      subject,
      html: htmlContent, // Usa el contenido del template como texto del correo
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado: ', info.response);
    } catch (error) {
      console.error('Error enviando email: ', error);
    }
  }

  // Método para enviar correo de reseteo de contraseña usando el template `passResetMessage`
  async sendResetPasswordEmail(
    to: string,
    subject: string,
    name: string,
    temporalPassword: string,
  ): Promise<void> {
    // Genera el mensaje usando la función de template `passResetMessage`
    const htmlContent = passResetMessage(name, temporalPassword);

    const mailOptions = {
      from: process.env.EMAIL_APPLICATION_GMAIL,
      to,
      subject,
      html: htmlContent, // Usa el contenido del template como texto del correo
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado: ', info.response);
    } catch (error) {
      console.error('Error enviando email: ', error);
    }
  }
}
