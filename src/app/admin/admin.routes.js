import { getDetailAdmin, getListAdmin } from "./admin.controller.js";
import { ensureAuth, ensurePermission } from "../../middleware/auth.js";
import { roles } from "../../constants/index.constants.js";

function AdminRoutes(app) {
  app.get(
    "/admin",
    ensureAuth,
    ensurePermission([roles.SUPER_ADMIN]),
    getListAdmin
  );
  app.get(
    "/admin/:id",
    ensureAuth,
    ensurePermission([roles.SUPER_ADMIN]),
    getDetailAdmin
  );
}

export default AdminRoutes;
