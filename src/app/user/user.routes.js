import {
  getLocalAuthCallback,
  getUserSignin,
  postLogout,
  postUserSignin,
} from "./user.controller.js";
import { ensureGuest } from "../../middleware/auth.js";
import userValidation from "./user.validator.js";
import { passportAuthLogin } from "../../middleware/passportAuth.js";

function UserRoutes(app) {
  app
    .route("/auth")
    .get(ensureGuest, getUserSignin)
    .post(
      userValidation.login,
      postUserSignin,
      passportAuthLogin,
      getLocalAuthCallback
    );
  app.post("/auth/logout", postLogout);
}

export default UserRoutes;
