import nodemailer from "nodemailer";

export const sendEmail = async ({
    to,
    cc,
    bcc,
    subject,
    html,
    attachments = []
} = {}) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
            user: 'Sayed01116343586@gmail.com',
            pass: 'tpwdfztgziznqjqf', 
        },
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
