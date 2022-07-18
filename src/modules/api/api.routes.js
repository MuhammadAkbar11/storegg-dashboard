import { uploadSingleImage } from "../../middleware/upload.js";
import { joinAPIsURL } from "../../utils/index.js";
import userValidation from "../user/user.validator.js";
import { apiGetDetailVoucher, apiGetVouchers } from "./api.controller.js";
import { apiPlayerSignin, apiPlayerSignup } from "./auth.api.controller.js";

function APIsRoutes(app) {
  app.route(joinAPIsURL("/vouchers")).get(apiGetVouchers);
  app.route(joinAPIsURL("/vouchers/:ID")).get(apiGetDetailVoucher);
  app
    .route(joinAPIsURL("/auth/signin"))
    .post(userValidation.login, apiPlayerSignin);
  app
    .route(joinAPIsURL("/auth/signup"))
    .post(uploadSingleImage("/users"), userValidation.signup, apiPlayerSignup);
}

export default APIsRoutes;
