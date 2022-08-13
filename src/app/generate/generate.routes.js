import { ApiURL } from "../../helpers/index.helper.js";
import { generateChekcout, generateUsers } from "./generate.controller.js";

function GenerateRoutes(app) {
  app.route(ApiURL("/generates/users")).post(generateUsers);
  app.route(ApiURL("/generates/checkout")).post(generateChekcout);
}

export default GenerateRoutes;
