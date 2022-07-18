import { ensureAuth } from "../../middleware/auth.js";
import {
  index,
  postPlayer,
  putPlayer,
  deletePlayer
} from "./player.controller.js";

import playerValidation from "./player.validator.js";

function PlayerRoutes(app) {

  app
  .route("/player/:id")
  .put(ensureAuth, playerValidation, putPlayer)
  .delete(ensureAuth, deletePlayer);
  app
    .route("/player")
    .get(ensureAuth, index)
    .post(ensureAuth, playerValidation, postPlayer);
}

export default PlayerRoutes;

