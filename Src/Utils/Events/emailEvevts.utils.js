import { EventEmitter } from "node:events";
import { emailSubjects } from "../Emails/email.utils.js";
import { sendEmail } from "../Emails/email.utils.js";
import { template } from "./generateHTML.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail", async (data) => {

  await sendEmail({
    to: data.to,
    subject: emailSubjects.confirmEmail,
    html: template(data.otp, data.firstName),
  }).catch((err) => {
    console.log(`❌ Error sending confirm email: ${err}`);
  });
 
});



eventEmitter.on("forgetPassword", async (data) => {

    await sendEmail({
      to: data.to,
      subject: emailSubjects.resetPassword,
      html: template(data.otp, data.firstName , emailSubjects.resetPassword),
    }).catch((err) => {
    console.log(`❌ Error sending reset password email: ${err}`);
  });
});
