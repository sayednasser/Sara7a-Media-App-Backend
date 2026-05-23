import nodemailer from "nodemailer";
import { EMAIL_APP, EMAIL_APP_PASSWORD } from "../../../../config/config";

export const sendEmail = async ({
    to,
    cc,
    bcc,
    subject,
    html,
    attachments = []
} = {}) => {
    const transporter = nodemailer.createTransport({
host: "74.125.140.108",
        port: 465,
        secure: true, 
        auth: {
            user: EMAIL_APP,
            pass: EMAIL_APP_PASSWORD
        },
        tls: {
        rejectUnauthorized: false
    }
    });
    try {
        await transporter.verify();
        console.log("Server is ready to take our messages");
    } catch (err) {
        console.error("Verification failed:", err);
    }
    try {
        const info = await transporter.sendMail({
            to,
            cc,
            bcc,
            html,
            subject,
            attachments,
            from: `Sara7a media ${EMAIL_APP} `,
        });
        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.error("Error while sending mail:", err);


    }




}
