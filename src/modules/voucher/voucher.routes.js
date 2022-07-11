import { ensureAuth } from "../../middleware/auth.js";
import {
  index,
  postVoucher,
  putVoucher,
  deleteVoucher,
  viewPutVoucher,
} from "./voucher.controller.js";

import voucherValidation from "./voucher.validator.js";

function VoucherRoutes(app) {
  app
    .route("/voucher")
    .get(ensureAuth, index)
    .post(ensureAuth, voucherValidation, postVoucher);

  app.route("/voucher-edit/:id").get(ensureAuth, viewPutVoucher);

  app
    .route("/voucher/:id")
    .put(ensureAuth, putVoucher)
    .delete(ensureAuth, deleteVoucher);
}

export default VoucherRoutes;
