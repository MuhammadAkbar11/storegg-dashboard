import UserRoutes from "../app/user/user.routes.js";
import { ensureAuth } from "../middleware/auth.js";

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
