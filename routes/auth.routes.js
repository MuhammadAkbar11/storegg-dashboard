import {
  getLocalAuthCallback,
  getLogin,
  postLogin,
  postLogout,
} from "../controllers/auth.controller.js";
import { userValidate } from "../helpers/validation.helper.js";
import { ensureGuest } from "../middleware/auth.js";
import { passportAuthLogin } from "../middleware/passportAuth.js";

function AuthRoutes(app) {
  app
    .route("/auth")
    .get(ensureGuest, getLogin)
    .post(
      userValidate("login"),
      postLogin,
      passportAuthLogin,
      getLocalAuthCallback
    );

  app.post("/auth/logout", postLogout);
}

export default AuthRoutes;
