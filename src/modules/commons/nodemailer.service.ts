import * as nodemailer from 'nodemailer';
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_APPLICATION_GMAIL,
                pass: process.env.PASSWORD_APPLICATION_GMAIL,
               }
        })
    }

    async sendRegistrationEmail( to: string, subject: string, text: string): Promise<void> {
        
        const mailOptions = {
            from: process.env.EMAIL_APPLICATION_GMAIL,
            to,
            subject,
            text
        }

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email enviado: ', info.response);
        } 
        catch (error) {
            console.error('Error enviando email: ', error);
        }
    }
}