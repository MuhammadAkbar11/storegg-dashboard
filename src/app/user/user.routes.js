import {
  getDetailUser,
  getListUsers,
  getLocalAuthCallback,
  getUserSignin,
  postLogout,
  postUserSignin,
  updateUserStatus,
} from "./user.controller.js";
import { ensureAuth, ensureGuest } from "../../middleware/auth.js";
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

  app.get("/users", ensureAuth, getListUsers);
  app.get("/users/:id", ensureAuth, getDetailUser);
  app.post("/users/status/:id", ensureAuth, updateUserStatus);
}

export default UserRoutes;
