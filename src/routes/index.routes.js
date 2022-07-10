import { ensureAuth } from "../middleware/auth.js";
import CategoryRoutes from "../modules/category/category.routes.js";
import UserRoutes from "../modules/user/user.routes.js";

function MainRoutes(app) {
  app.get("/", ensureAuth, (req, res) => {
    res.render("index", {
      title: "Welcome",
      path: "/",
    });
  });

  UserRoutes(app);

  CategoryRoutes(app);
}

export default MainRoutes;
