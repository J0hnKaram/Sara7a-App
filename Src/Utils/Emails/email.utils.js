import nodemailer from "nodemailer";

export async function sendEmail({
    to = "",
    subject = "",
    text = "",
    html = "",
    attachments = [],
    cc = "",
    bcc = "",
 }) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ORGANIZATION, 
            pass: process.env.PASSWORD_ORGANIZATION,   
        },
    });


    const info = await transporter.sendMail({
        from: `"Sara7a App" <${process.env.EMAIL_ORGANIZATION}>`, 
        to,
        subject,
        text,
        html, 
        attachments,
        cc,
        bcc,
    });

}



export const emailSubjects = {
    confirmEmail: "Confirm your email",
    resetPassword: "Reset your password",
    welcome: "Welcome to Sara7a App",
}



