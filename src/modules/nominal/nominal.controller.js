import { validationResult } from "express-validator";
import {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import {
  createNominal,
  deleteNominalById,
  findAllNominal,
  findNominalById,
  updateNominal,
} from "./nominal.repository.js";

export const index = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    res.render("nominal/v_nominal", {
      title: "Nominal",
      path: "/nominal",
      nominals: await findAllNominal(),
      flashdata: flashdata,
      errors: errors,
      isEdit: false,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const viewCreateNominal = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    res.render("nominal/v_create_nominal", {
      title: "Buat Nominal",
      path: "/nominal",
      flashdata: flashdata,
      errors: errors,
      isEdit: false,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const viewPutNominal = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    res.render("nominal/v_edit_nominal", {
      title: "Edit Nominal",
      path: "/nominal",
      flashdata: flashdata,
      errors: errors,
      nominal: await findNominalById(req.params.id),
      values: null,
      params: req.params.id,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const postNominal = async (req, res, next) => {
  const redirect = req.query.redirect || `/create-nominal`;
  const validate = validationResult(req);

  const { coinNominal, coinName, price } = req.body;

  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    req.flash("errors", errValidate);
    res.redirect(`${redirect}?validation_error=true`);
    return;
  }

  try {
    await createNominal({
      coinName,
      coinNominal,
      price,
    });

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: "Berhasil membuat nominal baru!",
    });
    res.redirect(`/nominal`);
  } catch (error) {
    console.log(error);
    req.flash("flashdata", {
      type: "error",
      title: "Oppps!",
      message: "Gagal membuat Nominal",
    });
    res.redirect(`/nominal`);
  }
};

export const putNominal = async (req, res, next) => {
  const id = req.params.id;
  const { coinNominal, coinName, price } = req.body;

  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errValidate = new ValidationError(validate.array(), "", {
      values: req.body,
    });
    req.flash("errors", errValidate);
    res.redirect(`${redirect}?validation_error=true`);
    return;
  }

  try {
    await updateNominal(id, {
      coinName,
      coinNominal,
      price,
    });

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: "Berhasil mengubah nominal",
    });
    res.redirect(`/nominal`);
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};

export const deleteNominal = async (req, res, next) => {
  const id = req.params.id;
  const redirect = req.query.redirect || "/nominal";
  try {
    const nominal = await findNominalById(req.params.id);

    if (!nominal) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal menghapus Nominal, karena Nominal dengan ID <strong>${id}</strong> tidak di temukan`,
      });
      res.redirect(`${redirect}`);
      return;
    }

    const message = `Anda telah menghapus Nominal <strong class=" text-warning" >${nominal.coinNominal} ${nominal.coinName}</strong> `;

    await deleteNominalById(id);

    req.flash("flashdata", {
      type: "warning",
      title: "Terhapus!",
      message: message,
    });
    res.redirect("/nominal");
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Opps!",
      message: "Gagal menghapus Nominal",
    });
    res.redirect(`${redirect}?action_error=true`);
  }
};
