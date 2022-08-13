import { ApiURL } from "../../helpers/index.helper.js";
import { generateUsers } from "./generate.controller.js";

function GenerateRoutes(app) {
  app.route(ApiURL("/generates/users")).post(generateUsers);
}

export default GenerateRoutes;
