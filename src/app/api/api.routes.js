import { ApiURL } from "../../helpers/index.helper.js";
import { ensurePlayerAuth } from "../../middleware/auth.js";
import { uploadSingleImage } from "../../middleware/upload.js";
import playerValidation from "../player/player.validator.js";
import userValidation from "../user/user.validator.js";
import {
  apiGetCategories,
  //   apiGetDashboard,
  //   apiGetDetailHistory,
  apiGetDetailVoucher,
  //   apiGetListHistory,
  apiGetProfile,
  apiGetVouchers,
  //   apiPostCheckout,
  apiPutProfile,
} from "./api.controller.js";
import { apiPlayerSignin, apiPlayerSignup } from "./auth.api.controller.js";

function APIsRoutes(app) {
  // app
  //   .route(joinAPIsURL("/histories/:id"))
  //   .get(ensurePlayerAuth, apiGetDetailHistory);
  app.route(ApiURL("/vouchers/:ID")).get(apiGetDetailVoucher);
  app.route(ApiURL("/auth/signin")).post(userValidation.login, apiPlayerSignin);
  app
    .route(ApiURL("/auth/signup"))
    .post(uploadSingleImage("/users"), userValidation.signup, apiPlayerSignup);

  // app.route(joinAPIsURL("/checkout")).post(ensurePlayerAuth, apiPostCheckout);
  // app.route(joinAPIsURL("/dashboard")).get(ensurePlayerAuth, apiGetDashboard);
  // app.route(joinAPIsURL("/histories")).get(ensurePlayerAuth, apiGetListHistory);
  app
    .route(ApiURL("/profile"))
    .get(ensurePlayerAuth, apiGetProfile)
    .put(
      uploadSingleImage("/users"),
      ensurePlayerAuth,
      playerValidation.update,
      apiPutProfile
    );
  app.route(ApiURL("/categories")).get(apiGetCategories);
  app.route(ApiURL("/vouchers")).get(apiGetVouchers);
}

export default APIsRoutes;
