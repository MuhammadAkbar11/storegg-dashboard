import {
  getGoogleAuthCallback,
  getLocalAuthCallback,
  getLogin,
  getSignUp,
  postLogin,
  postLogout,
  postSignUp,
} from "../controllers/auth.controller.js";
import { userValidate } from "../helpers/validation.helper.js";
import { ensureGuest } from "../middleware/auth.js";
import {
  passportAuthGoogleLogin,
  passportAuthGoogleLoginCallback,
  passportAuthLogin,
} from "../middleware/passportAuth.js";

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

  app
    .route("/auth/signup")
    .get(ensureGuest, getSignUp)
    .post(
      userValidate("signup"),
      postSignUp,
      passportAuthLogin,
      getLocalAuthCallback
    );

  app.get("/auth/google", passportAuthGoogleLogin);
  app.get(
    "/auth/google/callback",
    passportAuthGoogleLoginCallback,
    getGoogleAuthCallback
  );

  app.post("/auth/logout", postLogout);
}

export default AuthRoutes;
