import { validationResult } from "express-validator";
import { Op } from "sequelize";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import { GetRandom, UnlinkFile } from "../../helpers/index.helper.js";
import Logger from "../../helpers/logger.helper.js";
import { findAllCategories } from "../category/category.repository.js";
import { findAllNominal } from "../nominal/nominal.repository.js";
import {
  createVoucher,
  deleteVoucherById,
  findListVoucher,
  findOneVoucher,
  findVoucherById,
  updateVoucher,
  updateVoucherStatusById,
} from "./voucher.repository.js";
import { faker } from "@faker-js/faker";

export const index = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    const vouchers = await findListVoucher();
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

    const voucher = await findOneVoucher({
      where: {
        voucher_id: req.params.id,
      },
    });

    if (!voucher) {
      throw new BaseError("NOT_FOUND", 404, "Voucher is not found!", true, {
        errorView: "errors/404",
        renderData: {
          title: "Page Not Found",
        },
        responseType: "page",
      });
    }
    // console.log(voucher.nominals[]);
    const nominals = await findAllNominal({
      where: {
        [Op.or]: {
          coin_name: { [Op.like]: `%${voucher.game_coin_name}%` },
          description: { [Op.like]: `%${voucher.name}%` },
        },
      },
    });
    const categories = await findAllCategories({});
    const transformNominal = nominals.map(nominal => {
      const data = nominal.dataValues;
      let checked = null;
      voucher.nominals.map(vcn => {
        if (vcn.nominal_id === data.nominal_id) {
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
    Logger.error(error);
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const viewListVoucherNominals = async (req, res, next) => {
  const ID = req.params.id;
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];

    const voucher = await findVoucherById(ID);

    if (!voucher) {
      throw new BaseError("NOT_FOUND", 404, "Voucher is not found!", true, {
        errorView: "errors/404",
        renderData: {
          title: "Page Not Found",
        },
        responseType: "page",
      });
    }

    res.render("voucher/v_info_voucher", {
      title: "Detail Voucher",
      path: "/voucher",
      flashdata: flashdata,
      errors: errors,
      voucher: voucher,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const postVoucher = async (req, res) => {
  try {
    const categories = await findAllCategories();
    const nominals = await findAllNominal({
      where: {
        coin_name: { [Op.like]: `%Gold%` },
      },
    });

    const newVoucher = {
      game_name: faker.commerce.productName(),
      thumbnail: "/uploads/Default-Thumbnail.png",
      category_id: GetRandom(categories).dataValues.category_id,
      admin_id: req.user.admin_id,
      game_coin_name: "Gold",
    };

    const result = await createVoucher(newVoucher, nominals);

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
    res.redirect(`/voucher-edit/${result.voucher_id}`);
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
    // const {}
    await updateVoucher(req.params.id, { ...req.body, fileimg: fileimg });

    // return;
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
  const ID = req.params.id;
  try {
    const voucher = await findVoucherById(ID);

    if (!voucher) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal menghapus Voucher, karena Nominal dengan ID <strong>${ID}</strong> tidak di temukan`,
      });
      res.redirect(`/voucher`);
      return;
    }

    const message = `Anda telah menghapus Voucher <strong class=" text-warning" >${voucher.game_name}</strong> `;

    await deleteVoucherById(ID);

    req.flash("flashdata", {
      type: "warning",
      title: "Terhapus!",
      message: message,
    });
    res.redirect("/voucher");
  } catch (error) {
    console.log(error);
    req.flash("flashdata", {
      type: "error",
      title: "Oppps!",
      message: "Gagal menghapus voucher",
    });
    res.redirect(`/voucher?action_error=true`);
  }
};

export const updateVoucherStatus = async (req, res, next) => {
  const ID = req.params.id;
  const status = req.body.status === "Y" ? "Menonaktifkan" : "Mengaktifkan";

  try {
    const voucher = await findVoucherById(ID);

    if (!voucher) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal ${status} Voucher, karena Voucher dengan ID <strong>${ID}</strong> tidak di temukan`,
      });
      res.redirect(`/voucher`);
      return;
    }

    const message = `Berhasil ${status} Voucher <strong class="text-success" >${voucher.game_name}</strong> `;

    await updateVoucherStatusById(ID);

    req.flash("flashdata", {
      type: "success",
      title: "Berhasil!",
      message: message,
    });
    res.redirect("/voucher");
  } catch (error) {
    console.log(error);
    req.flash("flashdata", {
      type: "error",
      title: "Oppps!",
      message: `Gagal ${status} Voucher `,
    });
    res.redirect(`/voucher?action_error=true`);
  }
};
