import { getDashboard, getIndex } from "../controllers/app.controller.js";
import { ensureAuth } from "../middleware/auth.js";
import APIsRoutes from "./api/apis.routes.js";
import AuthRoutes from "./auth.routes.js";

function MainRoutes(app) {
  app.get("/", getIndex);
  app.get("/dashboard", ensureAuth, getDashboard);

  // auth Routes
  AuthRoutes(app);

  // Api main routes
  APIsRoutes(app);
}

export default MainRoutes;
