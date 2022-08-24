import {
  getDetailAdmin,
  getListAdmin,
  postAdmin,
  putAdmin,
  viewCreateAdmin,
  viewEditAdmin,
} from "./admin.controller.js";
import { ensureAuth, ensurePermission } from "../../middleware/auth.js";
import { ROLES } from "../../constants/index.constants.js";
import { uploadSingleImage } from "../../middleware/upload.js";

function AdminRoutes(app) {
  const permission = ensurePermission([ROLES.SUPER_ADMIN]);

  app
    .route("/admin/:id/settings")
    .get(ensureAuth, permission, viewEditAdmin)
    .post(uploadSingleImage("/users"), ensureAuth, permission, putAdmin);
  app.route("/admin/create-admin").get(ensureAuth, permission, viewCreateAdmin);
  app.route("/admin/:id").get(ensureAuth, permission, getDetailAdmin);

  app
    .route("/admin")
    .post(ensureAuth, permission, postAdmin)
    .get(ensureAuth, permission, getListAdmin);
}

export default AdminRoutes;
