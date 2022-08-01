import CategoryRoutes from "../app/category/category.routes.js";
import NominalRoutes from "../app/nominal/nominal.routes.js";
import UserRoutes from "../app/user/user.routes.js";
import VoucherRoutes from "../app/voucher/voucher.routes.js";
import { ensureAuth } from "../middleware/auth.js";

function MainRoutes(app) {
  app.get("/", ensureAuth, (req, res) => {
    res.render("index", {
      title: "Welcome",
      path: "/",
    });
  });

  UserRoutes(app);
  VoucherRoutes(app);
  NominalRoutes(app);
  CategoryRoutes(app);
}

export default MainRoutes;
