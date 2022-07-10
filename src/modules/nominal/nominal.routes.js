import { ensureAuth } from "../../middleware/auth.js";
import {
  index,
  postNominal,
  putNominal,
  deleteNominal,
  viewCreateNominal,
} from "./nominal.controller.js";

import nominalValidation from "./nominal.validator.js";

function NominalRoutes(app) {
  app
    .route("/nominal")
    .get(ensureAuth, index)
    .post(ensureAuth, nominalValidation, postNominal);

  app
    .route("/nominal/:id")
    .put(ensureAuth, nominalValidation, putNominal)
    .delete(ensureAuth, deleteNominal);

  app.route("/create-nominal").get(ensureAuth, viewCreateNominal);
}

export default NominalRoutes;
