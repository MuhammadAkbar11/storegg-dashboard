import {
  getDetailAdmin,
  getListAdmin,
  putAdmin,
  viewEditAdmin,
} from "./admin.controller.js";
import { ensureAuth, ensurePermission } from "../../middleware/auth.js";
import { ROLES } from "../../constants/index.constants.js";
import { uploadSingleImage } from "../../middleware/upload.js";

function AdminRoutes(app) {
  app
    .route("/admin/:id/settings")
    .get(ensureAuth, ensurePermission([ROLES.SUPER_ADMIN]), viewEditAdmin)
    .post(uploadSingleImage("/users"), ensureAuth, ensurePermission([ROLES.SUPER_ADMIN]), putAdmin);
  app
    .route("/admin/:id")
    .get(ensureAuth, ensurePermission([ROLES.SUPER_ADMIN]), getDetailAdmin);

  app
    .route("/admin")
    .get(ensureAuth, ensurePermission([ROLES.SUPER_ADMIN]), getListAdmin);
}

export default AdminRoutes;
