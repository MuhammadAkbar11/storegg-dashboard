import { ensureAuth } from "../../middleware/auth.js";
import { uploadSingleImage } from "../../middleware/upload.js";
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
    .route("/voucher-edit/:id")
    .get(ensureAuth, viewPutVoucher)
    .post(ensureAuth, uploadSingleImage, putVoucher);

  app.route("/voucher/:id").delete(ensureAuth, deleteVoucher);
  app
    .route("/voucher")
    .get(ensureAuth, index)
    .post(ensureAuth, voucherValidation, postVoucher);
}

export default VoucherRoutes;
