import nodemailer from "nodemailer";
import googleApis from "googleapis";
import {
  EMAIL,
  OAUTH_CLIENTID,
  OAUTH_CLIENT_SECRET,
  OAUTH_PLAYGROUND,
  OAUTH_REFRESH_TOKEN,
} from "./env.config.js";
import BaseError from "../helpers/baseError.helper.js";
import ApiError from "../helpers/apiError.helper.js";

const OAuth2 = googleApis.google.auth.OAuth2;

const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      OAUTH_CLIENTID,
      OAUTH_CLIENT_SECRET,
      OAUTH_PLAYGROUND
    );

    oauth2Client.setCredentials({
      refresh_token: OAUTH_REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      return oauth2Client.getAccessToken((err, token) => {
        if (err) {
          const errors = new BaseError(
            "Error OAuth2",
            err.response.status,
            err.response.data?.error_description ||
              "Failed to create access token :(",
            true
          );

          reject(errors);
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        accessToken,
        clientId: OAUTH_CLIENTID,
        clientSecret: OAUTH_CLIENT_SECRET,
        refreshToken: OAUTH_REFRESH_TOKEN,
      },
    });

    return transporter;
  } catch (error) {
    throw new BaseError(error.name, error.statusCode, error.message, true, {
      ...error,
    });
  }
};

export default createTransporter;
