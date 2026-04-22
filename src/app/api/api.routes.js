// import verifyTemplate from "../../config/mail/verify.js";
// import { SendEmail } from "../../helpers/email.helper.js";
import { ApiURL } from "../../helpers/index.helper.js";
import { ensurePlayerAuth } from "../../middleware/auth.js";
import { uploadSingleImage } from "../../middleware/upload.js";
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
import {
  apiPlayerSession,
  apiPlayerSignin,
  apiPlayerSignup,
} from "./auth.api.controller.js";

function APIsRoutes(app) {
  // app.route(ApiURL("/email")).get(async (req, res) => {
  //   try {
  //     const email = await SendEmail({
  //       from: "storegg@storegg.com",
  //       to: "baaev.legieuvn@gmail.com",
  //       subject: "Nice Nodemailer test",
  //       html: verifyTemplate(),
  //     });

  //     res.json({
  //       message: "Email Berhasil",
  //       email,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  app
    .route(ApiURL("/histories/:id"))
    .get(ensurePlayerAuth, apiGetDetailHistory);
  app.route(ApiURL("/vouchers/:ID")).get(apiGetDetailVoucher);
  app.route(ApiURL("/auth/signin")).post(userValidation.login, apiPlayerSignin);
  app
    .route(ApiURL("/auth/signup"))
    .post(uploadSingleImage("/users"), userValidation.signup, apiPlayerSignup);

  app.route(ApiURL("/checkout")).post(ensurePlayerAuth, apiPostCheckout);
  app.route(ApiURL("/dashboard")).get(ensurePlayerAuth, apiGetDashboard);
  app.route(ApiURL("/histories")).get(ensurePlayerAuth, apiGetListHistory);
  app.route(ApiURL("/session")).get(ensurePlayerAuth, apiPlayerSession);
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
