import { validationResult } from "express-validator";
import { httpStatusCodes } from "../../constants/index.constants.js";
import {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import {
  createCategory,
  deleteCategoryById,
  findAllCategories,
  findCategoryById,
  updateCategory,
} from "./category.repository.js";

export const viewCategoryList = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    res.render("category/view_catagory", {
      title: "Kategori",
      path: "/category",
      flashdata: flashdata,
      errors: errors,
      isEdit: false,
      categories: await findAllCategories(),
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const viewEditCategory = async (req, res, next) => {
  const id = req.params.id;
  const flashdata = req.flash("flashdata");
  const errors = req.flash("errors")[0];
  try {
    const category = await findCategoryById(id);

    res.render("category/view_edit_category", {
      title: "Edit Kategori",
      path: "/category",
      flashdata: flashdata,
      errors: errors,
      category: await findCategoryById(id),
      values: null,
      params: id,
    });
  } catch (error) {
    // console.log(first)
    const baseError = new TransfromError(error);

    next(baseError);
  }
};

export const getCategoryList = async (req, res, next) => {
  try {
    res.json({
      message: "Success to get your skills list",
      data: findAllCategories(),
    });
  } catch (error) {
    error.responseType = "json";
    const trError = new TransfromError(error);

    next(trError);
  }
};

export const postCategory = async (req, res, next) => {
  const redirect = req.query.redirect || `/category`;
  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array(), "", {
        values: req.body,
        isEdit: false,
      });
      // console.log(errValidate.renderData.values);
      req.flash("errors", errValidate);
      res.redirect(`${redirect}?validation_error=true`);
      return;
    }

    await createCategory({
      name: req.body.name,
      description: req.body.description,
    });

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: "Berhasil menambahkan category",
    });
    res.redirect("/category");
  } catch (error) {
    console.log(error);
    req.flash("flashdata", {
      type: "error",
      title: "Oppps",
      message: "Gagal menambahkan kategori baru",
    });
    res.redirect(`${redirect}?action_error=true`);
  }
};

export const deleteCategory = async (req, res, next) => {
  const id = req.params.id;

  const redirect = req.query.redirect || `/category`;
  try {
    const category = await findCategoryById(id);

    if (!category) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal menghapus kategori, karena kategori dengan ID <strong>${id}</strong> tidak di temukan`,
      });
      res.redirect(`${redirect}`);
      return;
    }

    const message = `Anda telah menghapus kategori ${category.name}`;

    await deleteCategoryById(id);

    req.flash("flashdata", {
      type: "warning",
      title: "Terhapus!",
      message: message,
    });
    res.redirect("/category");
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Opps!",
      message: "Gagal menghapus kategori",
    });
    res.redirect(`${redirect}?action_error=true`);
  }
};

export const putCategory = async (req, res, next) => {
  const id = req.params.id;
  const redirect = req.query.redirect || `/category-edit/${id}`;
  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array(), "", {
        values: req.body,
      });
      req.flash("errors", errValidate);
      res.redirect(`${redirect}?validation_error=true`);
      return;
    }

    await updateCategory(id, {
      name: req.body.name,
      description: req.body.description,
    });

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: "Berhasil mengubah kategori",
    });
    res.redirect("/category");
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Opps!",
      message: "Gagal mengubah kategori",
    });
    console.log(error);
    res.redirect(`${redirect}?action_error=true`);
  }
};
