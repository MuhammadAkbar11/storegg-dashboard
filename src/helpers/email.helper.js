import createTransporter from "../config/nodemailer.config.js";
import BaseError from "./baseError.helper.js";

const sendEmail = async emailOptions => {
  try {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
  } catch (err) {
    const errors = new BaseError(
      "Error OAuth2",
      err.statusCode,
      err.message,
      true
    );
    throw errors;
  }
};

export { sendEmail };
