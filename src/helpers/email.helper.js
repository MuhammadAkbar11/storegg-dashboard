import createTransporter from "../config/nodemailer.config.js";
import BaseError from "./baseError.helper.js";
import Logger from "./logger.helper.js";
import fs from "fs";

const SendEmail = async emailOptions => {
  try {
    let emailTransporter = await createTransporter();
    return await emailTransporter.sendMail(emailOptions);

    //     transport.sendMail(mailOptions, (error, info) => {
    //       if (error) {
    //           return console.log(error);
    //       }
    //       console.log('Message sent: %s', info.messageId);
    // });
  } catch (err) {
    Logger.error(err);
    const errors = new BaseError(
      "MAILER_ERROR",
      err.statusCode,
      err.message,
      true
    );
    throw errors;
  }
};

export { SendEmail };
