import { ensureAuth } from "../../middleware/auth.js";
import {
  index,
  postNominal,
  putNominal,
  deleteNominal,
  viewCreateNominal,
  viewPutNominal,
} from "./nominal.controller.js";

import nominalValidation from "./nominal.validator.js";

function NominalRoutes(app) {
  app
    .route("/nominal")
    .get(ensureAuth, index)
    .post(ensureAuth, nominalValidation, postNominal);

  app.route("/nominal-create").get(ensureAuth, viewCreateNominal);
  app.route("/nominal-edit/:id").get(ensureAuth, viewPutNominal);
  app
    .route("/nominal/:id")
    .put(ensureAuth, nominalValidation, putNominal)
    .delete(ensureAuth, deleteNominal);
}

export default NominalRoutes;
