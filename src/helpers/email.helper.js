import createTransporter from "../config/nodemailer.config.js";
import BaseError from "./baseError.helper.js";

const SendEmail = async emailOptions => {
  try {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
  } catch (err) {
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
