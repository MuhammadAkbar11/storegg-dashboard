import { validationResult } from "express-validator";
import {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import { getRandom } from "../../utils/index.js";
import { findAllCategories } from "../category/category.repository.js";
import { findAllNominal } from "../nominal/nominal.repository.js";
import {
  createVoucher,
  deleteVoucherById,
  findAllVoucher,
  findVoucherById,
  updateVoucher,
} from "./voucher.repository.js";

export const index = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    const vouchers = await findAllVoucher();
    res.render("voucher/v_voucher", {
      title: "Voucher",
      path: "/voucher",
      flashdata: flashdata,
      errors: errors,
      vouchers,
      isEdit: false,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const viewPutVoucher = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];

    const voucher = await findVoucherById(req.params.id);
    const nominals = await findAllNominal(
      {},
      {
        sort: {
          coinName: 1,
          coinNominal: 1,
        },
      }
    );
    const categories = await findAllCategories({});

    const transformNominal = nominals.map(nominal => {
      const data = nominal._doc;
      let checked = null;
      voucher.nominals.map(vcn => {
        if (vcn._id.toString() === data._id.toString()) {
          checked = "checked";
        }
      });
      return {
        ...data,
        checked: checked,
      };
    });
    res.render("voucher/v_edit_voucher", {
      title: "Edit Voucher",
      path: "/voucher",
      flashdata: flashdata,
      errors: errors,
      voucher: voucher,
      values: null,
      nominals: transformNominal,
      categories: categories,
      params: req.params.id,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const postVoucher = async (req, res) => {
  try {
    const categories = await findAllCategories();
    const nominals = await findAllNominal({ coinName: "Gold" });
    const nominalsId = nominals.map(doc => doc._id);

    const newVoucher = {
      name: "Generate Game",
      thumbnail: "/uploads/Default-Thumbnail.png",
      category: getRandom(categories)._id,
      nominals: nominalsId,
      user: req.user._id,
      gameCoinName: "Gold",
    };

    const result = await createVoucher(newVoucher);

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: "Berhasil membuat voucher. ",
    });
    req.flash("flashdata", {
      type: "info",
      title: "Note!",
      message:
        "Jika ingin membatalkan silahkan klik tombol batal dan hapus untuk membatalkan pembuatan Voucher baru ",
    });
    res.redirect(`/voucher-edit/${result._id}`);
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Oppps",
      message: "Gagal membuat voucher baru",
    });
    res.redirect(`/voucher?action_error=true`);
  }
};

export const putVoucher = async (req, res, next) => {
  // if (!validate.isEmpty()) {
  //   const errValidate = new ValidationError(validate.array(), "", {
  //     values: req.body,
  //   });
  //   // response here
  //   return;
  // }
  const fileimg = req.fileimg;
  try {
    await updateVoucher(req.params.id, { ...req.body, fileimg: fileimg });

    req.flash("flashdata", {
      type: "success",
      title: "Diubah!",
      message: "Berhasil mengubah voucher",
    });
    res.redirect(`/voucher`);
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Oppps",
      message: "Gagal mengubah voucher",
    });
    res.redirect(`/voucher?action_error=true`);
  }
};

export const deleteVoucher = async (req, res, next) => {
  try {
    // code here
  } catch (error) {
    const trError = new TransfromError(error);
    next(trError);
  }
};
