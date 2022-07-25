import { ensurePlayerAuth } from "../../middleware/auth.js";
import { uploadSingleImage } from "../../middleware/upload.js";
import { joinAPIsURL } from "../../utils/index.js";
import playerValidation from "../player/player.validator.js";
import userValidation from "../user/user.validator.js";
import {
  apiGetCategories,
  apiGetDashboard,
  apiGetDetailHistory,
  apiGetDetailVoucher,
  apiGetListHistory,
  apiGetProfile,
  apiGetVouchers,
  apiPostCheckout,
  apiPutProfile,
} from "./api.controller.js";
import { apiPlayerSignin, apiPlayerSignup } from "./auth.api.controller.js";

function APIsRoutes(app) {
  app
    .route(joinAPIsURL("/histories/:id"))
    .get(ensurePlayerAuth, apiGetDetailHistory);
  app.route(joinAPIsURL("/vouchers/:ID")).get(apiGetDetailVoucher);
  app
    .route(joinAPIsURL("/auth/signin"))
    .post(userValidation.login, apiPlayerSignin);
  app
    .route(joinAPIsURL("/auth/signup"))
    .post(uploadSingleImage("/users"), userValidation.signup, apiPlayerSignup);

  app.route(joinAPIsURL("/checkout")).post(ensurePlayerAuth, apiPostCheckout);
  app.route(joinAPIsURL("/dashboard")).get(ensurePlayerAuth, apiGetDashboard);
  app.route(joinAPIsURL("/histories")).get(ensurePlayerAuth, apiGetListHistory);
  app
    .route(joinAPIsURL("/profile"))
    .get(ensurePlayerAuth, apiGetProfile)
    .put(
      uploadSingleImage("/users"),
      ensurePlayerAuth,
      playerValidation.update,
      apiPutProfile
    );
  app.route(joinAPIsURL("/categories")).get(apiGetCategories);
  app.route(joinAPIsURL("/vouchers")).get(apiGetVouchers);
}

export default APIsRoutes;
