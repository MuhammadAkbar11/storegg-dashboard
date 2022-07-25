import { getDummy, postDummy } from "../../controllers/api/dumb.controller.js";
import { PREFIX_VERSION } from "../../helpers/version.helper.js";

function APIsRoutes(app) {
  app.route(`${PREFIX_VERSION}`).get((req, res) => {
    res.send({ message: "Hello" });
  });

  app.route(`${PREFIX_VERSION}/dummies`).get(getDummy).post(postDummy);
}

export default APIsRoutes;
