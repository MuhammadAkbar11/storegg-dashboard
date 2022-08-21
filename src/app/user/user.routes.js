import {
  getDetailAdmin,
  getListAdmin,
  getListUsers,
  getLocalAuthCallback,
  getUserSignin,
  postLogout,
  postUserSignin,
} from "./user.controller.js";
import {
  ensureAuth,
  ensureGuest,
  ensurePermission,
} from "../../middleware/auth.js";
import userValidation from "./user.validator.js";
import { passportAuthLogin } from "../../middleware/passportAuth.js";
import { roles } from "../../constants/index.constants.js";

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
  app.get(
    "/admin",
    ensureAuth,
    ensurePermission([roles.SUPER_ADMIN]),
    getListAdmin
  );
  app.get(
    "/admin/:id",
    ensureAuth,
    ensurePermission([roles.SUPER_ADMIN]),
    getDetailAdmin
  );
}

export default UserRoutes;
