// import { Injectable } from "@nestjs/common"
// 
// const nodeMailer = require("nodemailer")
// 
// @Injectable()
// export class EmailService{
// 
    // private transporter = nodeMailer.createTransport({
        // host: "smtp.gmail.com",
        // port: 465,
        // secure: true,
        // auth: {
            // user: "moralesdreiser5@gmail.com",
            // pass: process.env.PASSWORD_APPLICATION_GMAIL,
        // }
    // })
// 
// 
    // 
// }
    // 
// let mail = {
    // from: "",
    // to: "phamton31@gmail.com",
    // subject: "emailling test",
    // text: "does this work",
    // html: `
    // <h5>This message is sent to test this app<h5/>
    // `
// }
// 
// transporter.sendMail(mail, (error, info) => {
    // if (error) {
        // console.log("Error sending email")
    // }
    // else {
        // console.log("Email sent")
    // }
// })
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