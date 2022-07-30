import { ensureAuth } from "../../middleware/auth.js";
import {
  index,
  postBank,
  putBank,
  deleteBank,
  viewPutBank,
} from "./bank.controller.js";

import bankValidation from "./bank.validator.js";

function BankRoutes(app) {
  app.get("/bank-edit/:id", ensureAuth, viewPutBank);
  app
    .route("/bank/:id")
    .put(ensureAuth, bankValidation, putBank)
    .delete(ensureAuth, deleteBank);
  app.route("/bank").get(ensureAuth, index).post(ensureAuth, postBank);
}

export default BankRoutes;
