import { getDashboard, getIndex } from "../controllers/app.controller.js";
import { ensureAuth } from "../middleware/auth.js";
import AuthRoutes from "./auth.routes.js";

function MainRoutes(app) {
  app.get("/", getIndex);
  app.get("/dashboard", ensureAuth, getDashboard);

  // auth Routes
  AuthRoutes(app);
}

export default MainRoutes;
