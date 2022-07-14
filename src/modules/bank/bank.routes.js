
import { ensureAuth } from "../../middleware/auth.js";
import {
  index,
  postBank,
  putBank,
  deleteBank
} from "./bank.controller.js";

import bankValidation from "./bank.validator.js";

function BankRoutes(app) {
  app
    .route("/bank")
    .get(ensureAuth, index)
    .post(ensureAuth, bankValidation, postBank);

  app
    .route("/bank/:id")
    .put(ensureAuth, bankValidation, putBank)
    .delete(ensureAuth, deleteBank);
}

export default BankRoutes;

