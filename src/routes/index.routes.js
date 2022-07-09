import { ensureAuth } from "../middleware/auth.js";
import UserRoutes from "../modules/user/user.routes.js";

function MainRoutes(app) {
  app.get("/", ensureAuth, (req, res) => {
    res.render("index", {
      title: "Welcome",
      path: "/",
    });
  });

  UserRoutes(app);
}

export default MainRoutes;
