import {
  getDetailUser,
  getListUsers,
  getLocalAuthCallback,
  getUserSignin,
  postLogout,
  postUserSignin,
  putUser,
  updateUserStatus,
  viewSettingUser,
} from "./user.controller.js";
import { ensureAuth, ensureGuest } from "../../middleware/auth.js";
import userValidation from "./user.validator.js";
import { passportAuthLogin } from "../../middleware/passportAuth.js";
import { uploadSingleImage } from "../../middleware/upload.js";

function UserRoutes(app) {
  app
    .route("/users/:id/settings")
    .get(ensureAuth, viewSettingUser)
    .post(uploadSingleImage("/users"), ensureAuth, putUser);

  app.route("/users/status/:id").post(ensureAuth, updateUserStatus);

  app.route("/auth/logout").post(postLogout);
  app
    .route("/auth")
    .get(ensureGuest, getUserSignin)
    .post(
      userValidation.login,
      postUserSignin,
      passportAuthLogin,
      getLocalAuthCallback
    );

  app.route("/users/:id").get(ensureAuth, getDetailUser);
  app.route("/users").get(ensureAuth, getListUsers);
}

export default UserRoutes;
