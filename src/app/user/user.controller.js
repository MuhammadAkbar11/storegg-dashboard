import dayjs from "dayjs";
import Sequelize from "sequelize";
import { validationResult } from "express-validator";
import {
  httpStatusCodes,
  ROLES,
  SUPERADMIN_EMAIL,
  USER_STATUS,
} from "../../constants/index.constants.js";
import { ComparePassword } from "../../helpers/authentication.helper.js";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../../helpers/baseError.helper.js";
import {
  HTMLScript,
  HTMLStylesheet,
  Rupiah,
  ToCapitalize,
  ToPlainObject,
  UnlinkFile,
} from "../../helpers/index.helper.js";
import Logger from "../../helpers/logger.helper.js";
import {
  findAllUsers,
  findCountUser,
  findListUserRoles,
  findListUserStatus,
  findOneUser,
  updateOneUser,
} from "./user.repository.js";
import Administrator from "../../models/admin.model.js";
import Transaction from "../../models/transaction.model.js";
import Player from "../../models/player.model.js";
import { findAllTransaction } from "../transaction/transaction.repository.js";

const Op = Sequelize.Op;

export const getUserSignin = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");

    res.render("auth/login", {
      title: "Login",
      flashdata: flashdata,
      errors: null,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const postUserSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array());
      throw errValidate;
    }

    const user = await findOneUser({ where: { email: email } });

    if (!user) {
      throw new BaseError(
        "BAD_REQUEST",
        httpStatusCodes.BAD_REQUEST,
        "User not found",
        true
      );
    }

    if (!user.role.includes("ADMIN")) {
      throw new BaseError(
        "ERR_AUTHENTICATION",
        httpStatusCodes.BAD_REQUEST,
        "Failed to login because the email has not been registered as an administration email",
        true
      );
    }

    const passwordMatch = await ComparePassword(password, user.password);

    if (!passwordMatch) {
      throw new BaseError(
        "BAD_REQUEST",
        httpStatusCodes.BAD_REQUEST,
        "Wrong password",
        true
      );
    }

    next();
  } catch (error) {
    const baseError = new BaseError(
      error?.name,
      error?.statusCode,
      error.message,
      true,
      {
        validation: error?.validation || null,
        errorView: "auth/login",
        renderData: { title: "Login", values: req.body, flashdata: null },
      }
    );
    Logger.error(error, "[EXCEPTION] signin user");
    next(new TransfromError(baseError));
  }
};

// export const getSignUp = async (req, res, next) => {
//   try {
//     const flashdata = req.flash("flashdata");
//     res.render("auth/signup", {
//       title: "Sign Up",
//       flashdata: flashdata,
//       errors: null,
//       values: null,
//     });
//   } catch (error) {
//     const baseError = new TransfromError(error);
//     next(baseError);
//   }
// };

// export const postSignUp = async (req, res, next) => {
//   const { name, email, password } = req.body;
//   try {
//     const validate = validationResult(req);

//     if (!validate.isEmpty()) {
//       throw new ValidationError(validate.array(), "auth/signup", {
//         title: "Sign Up",
//         values: req.body,
//       });
//     }

//     const newUser = {
//       name,
//       email,
//       password,
//     };

//     const user = await UserModel.findOne({ email: email });

//     if (user) {
//       throw new BaseError(
//         "BAD_REQUEST",
//         httpStatusCodes.BAD_REQUEST,
//         "User already exist",
//         true,
//         {
//           errorView: "auth/signup",
//           renderData: { title: "Sign Up", values: req.body },
//         }
//       );
//     }

//     await UserModel.create(newUser);

//     next();
//   } catch (error) {
//     const baseError = new TransfromError(error);
//     next(baseError);
//   }
// };

export const getLocalAuthCallback = (req, res) => {
  try {
    res.redirect("/dashboard");
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Opps, Login failed please try again",
    });
    res.redirect("/auth");
  }
};

// export const getGoogleAuthCallback = (req, res) => {
//   try {
//     res.redirect("/dashboard/");
//   } catch (error) {
//     req.flash("flashdata", {
//       type: "danger",
//       message: "Opps, Login failed please try again",
//     });
//     res.redirect("/auth");
//   }
// };

export const postLogout = (req, res) => {
  req.logout();
  res.redirect("/");
};

export const getListUsers = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors")[0];
    let users = await findAllUsers({
      include: [
        {
          model: Administrator,
          as: "admin",
          attributes: ["admin_id"],
        },
      ],
      order: [
        ["role", "ASC"],
        ["created_at", "ASC"],
      ],
    });
    let countUsers = users.length;
    let countPending = await findCountUser({
      where: {
        status: {
          [Op.like]: `%PENDING%`,
        },
      },
    });
    let countActive = await findCountUser({
      where: {
        status: {
          [Op.like]: `%ACTIVE%`,
        },
      },
    });
    let countPlayers = await findCountUser({
      where: {
        role: {
          [Op.like]: `%PLAYER%`,
        },
      },
    });

    users = ToPlainObject(users);

    users =
      users.length !== 0
        ? users.map(u => {
            let actions = null;

            if (u.role.includes("ADMIN")) {
              const admin = u.admin;
              actions = {
                detail: admin ? `/admin/${admin?.admin_id}` : null,
                suspend: null,
              };
            } else {
              actions = {
                detail: `/users/${u.user_id}`,
                suspend: `/users/status/${u.user_id}`,
              };
            }

            u.actions = actions;
            u.created_at = dayjs(u.created_at).format("DD MMM YYYY");
            return { ...u };
          })
        : [];

    res.render("user/v_list_user", {
      title: "List Users",
      path: "/users",
      flashdata: flashdata,
      errors: errors,
      countPlayers,
      countActive: countActive,
      countPending: countPending,
      users,
      countUsers,
      isEdit: false,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const getDetailUser = async (req, res, next) => {
  const ID = req.params.id;
  const flashdata = req.flash("flashdata");
  const errors = req.flash("errors")[0];
  try {
    let user = await findOneUser({
      where: {
        user_id: ID,
      },
      include: [
        {
          model: Player,
          as: "player",
          attributes: ["player_id"],
        },
      ],
    });

    if (!user) {
      throw new BaseError("NOT_FOUND", 404, "User tidak ditemukan", true, {
        errorView: "errors/404",
        renderData: {
          title: "Halaman tidak ditemukan!",
        },
        responseType: "page",
      });
    }

    user = ToPlainObject(user);

    if (user.role.includes(ROLES.ADMIN)) {
      return res.redirect("/users");
    }

    const playerId = user.player.player_id;

    let transactions = await findAllTransaction({
      where: {
        player_id: playerId,
      },
    });
    transactions = ToPlainObject(transactions);

    transactions.forEach(t => {
      t.created_at = dayjs(t.created_at).format("DD MMM YYYY");
      t.total = Rupiah(t.value);
      delete t.player;
      return t;
    });

    user.transactions = transactions;
    user.transactionsCount = transactions.length;

    if (user.user_id == req.user.user_id) {
      return res.redirect("/profile");
    }

    res.render("user/v_detail", {
      title: user.user_id,
      path: "/users",
      flashdata: flashdata,
      errors: errors,
      user: user,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const updateUserStatus = async (req, res) => {
  const ID = req.params.id;

  let status = USER_STATUS.SUSPENDED;

  try {
    let user = await findOneUser({
      where: {
        user_id: ID,
      },
    });

    if (!user) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal mengupdate status, karena user dengan ID <strong>${ID}</strong> tidak di temukan`,
      });
      return res.redirect("back");
    }

    user = ToPlainObject(user);

    status =
      user.status === USER_STATUS.SUSPENDED
        ? USER_STATUS.ACTIVE
        : USER_STATUS.SUSPENDED;

    let message =
      status === USER_STATUS.SUSPENDED ? "meng-suspend" : "mengaktifkan";

    await updateOneUser({
      user_id: user.user_id,
      status: status,
    });

    req.flash("flashdata", {
      type: "success",
      title: ToCapitalize(message),
      message: `Berhasil ${message} user!`,
    });
    res.redirect("back");
  } catch (error) {
    req.flash("flashdata", {
      type: "error",
      title: "Opps!",
      message: `Gagal mengupdate status!`,
    });
    res.redirect("back");
  }
};

export const putUser = async (req, res, _next) => {
  const ID = req.params.id;
  const { name, username, status, phone_number } = req.body;
  const fileimg = req.fileimg;
  const isUpload = fileimg.data ? true : false;
  try {
    let user = await findOneUser({
      where: {
        user_id: ID,
      },
    });

    if (!user) {
      req.flash("flashdata", {
        type: "error",
        title: "Oppss",
        message: `Gagal mengubah data, karena user dengan ID <strong>${ID}</strong> tidak di temukan`,
      });
      return res.redirect("back");
    }

    if (user.role.includes(ROLES.ADMIN)) {
      req.flash("flashdata", {
        type: "warning",
        title: "Oppss",
        message: `Tidak ada perubahan! karena data yang diubah merupakan data admin!`,
      });
      return res.redirect("/users");
    }

    const payload = {
      user_id: user.user_id,
      name,
      username,
      status,
      phone_number,
      fileimg,
      oldAvatar: user.avatar,
    };

    await updateOneUser(payload);

    req.flash("flashdata", {
      type: "success",
      title: "Diubah!",
      message: "Berhasil mengubah data user",
    });
    res.redirect("back");
  } catch (error) {
    console.log(error);
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

export const viewSettingUser = async (req, res, next) => {
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

    let user = await findOneUser({
      where: {
        user_id: ID,
      },
      include: [
        {
          model: Player,
          as: "player",
          attributes: ["player_id"],
        },
      ],
    });

    if (!user) {
      throw new BaseError("NOT_FOUND", 404, "User tidak ditemukan", true, {
        errorView: "errors/404",
        renderData: {
          title: "Halaman tidak ditemukan!",
        },
        responseType: "page",
      });
    }

    user = ToPlainObject(user);
    const playerId = user.player.player_id;
    user.transactionsCount = await Transaction.count({
      where: {
        player_id: playerId,
      },
    });

    const status = findListUserStatus(user.status);

    res.render("user/v_edit_user", {
      title: `Pengaturan ${user.user_id}`,
      path: "/users",
      status: status,
      flashdata: flashdata,
      errors: errors,
      user: user,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};
