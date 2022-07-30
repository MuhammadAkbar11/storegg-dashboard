import { ensureAuth } from "../../middleware/auth.js";
import {
  deleteCategory,
  getCategoryList,
  postCategory,
  putCategory,
  viewCategoryList,
  viewEditCategory,
} from "./category.controller.js";

import categoryValidation from "./category.validator.js";

function CategoryRoutes(app) {
  app
    .route("/category")
    .get(ensureAuth, viewCategoryList)
    .post(ensureAuth, categoryValidation, postCategory);

  app
    .route("/category/:id")
    .put(ensureAuth, categoryValidation, putCategory)
    .delete(ensureAuth, deleteCategory);
  app.route("/category-edit/:id").get(ensureAuth, viewEditCategory);

  app.route("/data-categories").get(ensureAuth, getCategoryList);
}

export default CategoryRoutes;
