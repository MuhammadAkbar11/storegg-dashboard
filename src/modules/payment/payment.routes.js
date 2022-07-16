import { ensureAuth } from "../../middleware/auth.js";
import {
  index,
  postPayment,
  putPayment,
  deletePayment,
  viewPutPayment,
} from "./payment.controller.js";

import paymentValidation from "./payment.validator.js";

function PaymentRoutes(app) {
  app.get("/payment-edit/:id", ensureAuth, viewPutPayment);
  app
    .route("/payment/:id")
    .put(ensureAuth, paymentValidation, putPayment)
    .delete(ensureAuth, deletePayment);
  app.route("/payment").get(ensureAuth, index).post(ensureAuth, postPayment);
}

export default PaymentRoutes;
