import dayjs from "dayjs";
import { faker } from "@faker-js/faker";
import {
  ROLES,
  SUPERADMIN_EMAIL,
  USER_STATUS,
} from "../../constants/index.constants.js";
// import { ComparePassword } from "../../helpers/authentication.helper.js";
import BaseError, { TransfromError } from "../../helpers/baseError.helper.js";
import {
  HTMLScript,
  HTMLStylesheet,
  ToPlainObject,
  UnlinkFile,
} from "../../helpers/index.helper.js";
import {
  createAdmin,
  deleteOneAdmin,
  findAllAdmin,
  findOneAdmin,
  updateAdmin,
} from "../admin/admin.repository.js";
import Transaction from "../../models/transaction.model.js";
import {
  findListUserRoles,
  findListUserStatus,
  findOneUser,
} from "../user/user.repository.js";

export const getListAdmin = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    let listAdmin = await findAllAdmin({});
    let countUsers = listAdmin.length;

    listAdmin = ToPlainObject(listAdmin);

    if (listAdmin.length !== 0) {
      listAdmin = listAdmin
        .filter(
          u =>
            u.user.email !== SUPERADMIN_EMAIL && u.user.email !== req.user.email
        )
        .map(u => {
          u.created_at = dayjs(u.created_at).format("DD MMM YYYY");
          u.is_locked = false;
          return { ...u };
        });
    }

    res.render("user/admin/v_list_admin", {
      title: "List Admin",
      path: "/admin",
      flashdata: flashdata,
      errors: errors,
      // users: [],
      users: listAdmin,
      countUsers,
      isEdit: false,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const getDetailAdmin = async (req, res, next) => {
  const ID = req.params.id;
  const flashdata = req.flash("flashdata");
  const errors = req.flash("errors")[0];
  try {
    let admin = await findOneAdmin({
      where: {
        admin_id: ID,
      },
    });

    if (!admin) {
      throw new BaseError("NOT_FOUND", 404, "Admin is not found!", true, {
        errorView: "errors/404",
        renderData: {
          title: "Page Not Found",
        },
        responseType: "page",
      });
    }

    admin = ToPlainObject(admin);

    if (admin.admin_id == req.user.admin_id) {
      return res.redirect("/profile");
    }

    const adminVouchers = await Promise.all(
      admin.vouchers.map(async vcr => {
        const countTr = await Transaction.count({
          where: {
            voucher_id: vcr.voucher_id,
          },
        });
        vcr.created_at = dayjs(vcr.created_at).format("DD MMM YYYY");
        return { ...vcr, count: countTr };
      })
    );

    admin.vouchers = adminVouchers;

    res.render("user/admin/v_detail", {
      title: admin.admin_id,
      path: "/admin",
      flashdata: flashdata,
      errors: errors,
      admin: admin,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const putAdmin = async (req, res, next) => {
  const ID = req.params.id;
  const { name, username, status, phone_number, role, address, regency, city } =
    req.body;
  const fileimg = req.fileimg;
  const isUpload = fileimg.data ? true : false;
  try {
    let admin = await findOneAdmin({
      where: {
        admin_id: ID,
      },
    });

    if (!admin) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal mengubah data admin, karena admin dengan ID <strong>${ID}</strong> tidak di temukan`,
      });
      return res.redirect("back");
    }

    if (admin.user.email === SUPERADMIN_EMAIL) {
      req.flash("flashdata", {
        type: "warning",
        title: "Peringatan",
        message: `Tidak ada perubahan, karena <b>${ID}</b> merupakan data yang terkunci!. Jadi tidak dapat dihapus atau diubah`,
      });
      return res.redirect("back");
    }

    if (admin.admin_id == req.user.admin_id) {
      req.flash("flashdata", {
        type: "warning",
        title: "Peringatan",
        message: `Tidak ada perubahan, silahkan ubah data anda di halaman profile!`,
      });
      return res.redirect("/profile");
    }

    const splitReqAddress = address.split(",");
    let joinAddress = {
      country: "Indonesia",
      regency: regency,
      city: city,
      districts: splitReqAddress[splitReqAddress.length - 1],
      ward: splitReqAddress[3],
      RT_RW: splitReqAddress[2],
      house: splitReqAddress[1],
      street: splitReqAddress[0],
    };

    joinAddress = JSON.stringify(joinAddress);

    const payload = {
      admin_id: admin.admin_id,
      user_id: admin.user.user_id,
      name,
      username,
      status,
      phone_number,
      role,
      address: joinAddress,
      fileimg,
      oldAvatar: admin.user.avatar,
    };

    await updateAdmin(payload);

    req.flash("flashdata", {
      type: "success",
      title: "Diubah!",
      message: "Berhasil mengubah data admin",
    });
    res.redirect("back");
  } catch (error) {
    if (isUpload) {
      UnlinkFile(fileimg.data.path);
    }
    req.flash("flashdata", {
      type: "error",
      title: "Opps!",
      message: "Gagal mengubah data",
    });
    res.redirect("back");
  }
};

export const postAdmin = async (req, res, next) => {
  const {
    name,
    username,
    email,
    status,
    phone_number,
    role,
    address,
    regency,
    city,
  } = req.body;

  try {
    let user = await findOneUser({
      where: {
        email,
      },
    });

    req.flash("values", { ...req.body });

    if (user) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Email telah terdaftar, silahkan coba lagi dengan email yang belum terdaftar!`,
      });
      return res.redirect("back");
    }

    const splitReqAddress = address.split(",");
    let joinAddress = {
      country: "Indonesia",
      regency: regency,
      city: city,
      districts: splitReqAddress[splitReqAddress.length - 1],
      ward: splitReqAddress[3],
      RT_RW: splitReqAddress[2],
      house: splitReqAddress[1],
      street: splitReqAddress[0],
    };

    joinAddress = JSON.stringify(joinAddress);

    const payload = {
      name,
      username,
      email,
      status,
      phone_number,
      role,
      address: joinAddress,
    };

    await createAdmin(payload);

    req.flash("flashdata", {
      type: "success",
      title: "Ditambahkan!",
      message: "Berhasil menambah data admin",
    });
    res.redirect("/admin");
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Opps!",
      message: "Gagal menambah data",
    });
    res.redirect("back");
  }
};

export const deleteAdmin = async (req, res, next) => {
  const ID = req.params.id;

  try {
    let admin = await findOneAdmin({
      where: {
        admin_id: ID,
      },
    });

    if (!admin) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal menghapus data admin, karena admin dengan ID <strong>${ID}</strong> tidak di temukan`,
      });
      return res.redirect("back");
    }

    const email = admin.user.email;

    if (admin.user.email === SUPERADMIN_EMAIL) {
      req.flash("flashdata", {
        type: "warning",
        title: "Peringatan",
        message: `Tidak terhapus, karena <b>${ID}</b> merupakan data yang terkunci!. Jadi tidak dapat dihapus atau diubah`,
      });
      return res.redirect("back");
    }

    if (admin.admin_id == req.user.admin_id) {
      req.flash("flashdata", {
        type: "warning",
        title: "Peringatan",
        message: `Tidak dapat menghapus data sendiri!`,
      });
      return res.redirect("back");
    }

    await deleteOneAdmin({
      admin_id: admin.admin_id,
      user_id: admin.user.user_id,
    });

    req.flash("flashdata", {
      type: "warning",
      title: "Dihapus!",
      message: `Berhasil menghapus <b>${email}</b> `,
    });
    res.redirect("back");
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Opps!",
      message: "Gagal menghapus data",
    });
    res.redirect("back");
  }
};

export const viewEditAdmin = async (req, res, next) => {
  const ID = req.params.id;

  HTMLStylesheet(
    [
      ["/vendors/css/forms/select/select2.min.css", "vendors"],
      ["/css/forms/form-validation.css", "pages"],
    ],
    res
  );

  HTMLScript(
    [
      ["/vendors/js/forms/select/select2.full.min.js", "pages"],
      ["/vendors/js/forms/validation/jquery.validate.min.js", "pages"],
      ["/vendors/js/forms/cleave/cleave.min.js", "pages"],
      ["/vendors/js/forms/cleave/addons/cleave-phone.id.js", "pages"],
      ["/vendors/js/forms/cleave/addons/cleave-phone.us.js", "pages"],
    ],
    res
  );

  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];

    let admin = await findOneAdmin({
      where: {
        admin_id: ID,
      },
    });

    if (!admin) {
      throw new BaseError("NOT_FOUND", 404, "Admin is not found!", true, {
        errorView: "errors/404",
        renderData: {
          title: "Page Not Found",
        },
        responseType: "page",
      });
    }

    if (admin.admin_id == req.user.admin_id) {
      return res.redirect("/profile");
    }

    admin = ToPlainObject(admin);

    const address = JSON.parse(admin.address);
    admin.city = address?.city || "";
    admin.regency = address?.regency || "";
    admin.address = address
      ? `${address.street},${address.house},${address.RT_RW},${address.ward},${address.districts}`
      : "";

    const roles = findListUserRoles(admin.user.role);
    const status = findListUserStatus(admin.user.status);

    res.render("user/admin/v_edit_admin", {
      title: `Pengaturan ${admin.admin_id}`,
      path: "/admin",
      roles: roles,
      status: status,
      flashdata: flashdata,
      errors: errors,
      admin: admin,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const viewCreateAdmin = async (req, res, next) => {
  HTMLStylesheet(
    [
      ["/vendors/css/forms/select/select2.min.css", "vendors"],
      ["/css/forms/form-validation.css", "pages"],
    ],
    res
  );

  HTMLScript(
    [
      ["/vendors/js/forms/select/select2.full.min.js", "pages"],
      ["/vendors/js/forms/validation/jquery.validate.min.js", "pages"],
      ["/vendors/js/forms/cleave/cleave.min.js", "pages"],
      ["/vendors/js/forms/cleave/addons/cleave-phone.id.js", "pages"],
      ["/vendors/js/forms/cleave/addons/cleave-phone.us.js", "pages"],
    ],
    res
  );

  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    const reqValues = req.flash("values")[0];

    const roles = findListUserRoles(ROLES.ADMIN);
    const status = findListUserStatus(USER_STATUS.ACTIVE);

    const name = faker.name.findName();
    const username = name.split(" ").join("_").toLowerCase();
    const phone_number = faker.phone.number("+628##-####-####");
    const city = faker.address.city();
    const regency = faker.address.county();
    const splitUsername = username.split("_");
    const email = faker.internet.email(
      splitUsername[0],
      splitUsername[1],
      "gmail.com"
    );

    const address = `${faker.address.streetAddress()},No ${faker.address.buildingNumber()},RT.000/RT.000,Kel.${faker.random.word()},Kec.${faker.random.word()}`;

    let values = {
      name: name,
      username: username,
      email: email,
      phone_number: phone_number,
      address: address,
      city: city,
      regency: regency,
    };

    if (reqValues) {
      values = reqValues;
    }

    res.render("user/admin/v_create_admin", {
      title: `Tambah admin`,
      path: "/admin",
      roles: roles,
      status: status,
      flashdata: flashdata,
      errors: errors,
      values: values,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const getAdminProfile = async (req, res, next) => {
  const flashdata = req.flash("flashdata");
  const errors = req.flash("errors")[0];

  HTMLStylesheet([["/css/pages/page-profile.css", "pages"]], res);

  try {
    const user = req.user;
    user.created_at = dayjs(user.created_at).format("DD MMM YYYY");

    const userVouchers = await Promise.all(
      user.vouchers.map(async vcr => {
        const countTr = await Transaction.count({
          where: {
            voucher_id: vcr.voucher_id,
          },
        });
        vcr.created_at = dayjs(vcr.created_at).format("DD MMM YYYY");
        return { ...vcr, count: countTr };
      })
    );

    user.vouchers = userVouchers;
    if (user.address) {
      const address = JSON.parse(user.address);
      user.address = address;
      user.full_address = address
        ? `${address.street}, ${address.house}, ${address.RT_RW}, ${address.ward}, ${address.districts}, ${address.city}, ${address.regency}`
        : "";
    } else {
      user.address = "-";
      user.full_address = "-";
    }

    res.render("user/admin/v_profile", {
      title: "Profile",
      path: "/profile",
      flashdata: flashdata,
      errors: errors,
      user: user,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};
