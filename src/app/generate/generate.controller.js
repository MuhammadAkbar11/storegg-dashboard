import { faker } from "@faker-js/faker";
import bcryptjs from "bcryptjs";
import dayjs from "dayjs";
import { httpStatusCodes } from "../../constants/index.constants.js";
import BaseError, { TransfromError } from "../../helpers/baseError.helper.js";
import DayjsUTC from "../../helpers/date.helper.js";
import { GetRandom, ToPlainObject } from "../../helpers/index.helper.js";
import Logger from "../../helpers/logger.helper.js";
import { findAllCategories } from "../category/category.repository.js";
import { findPaymentById } from "../payment/payment.repository.js";
import {
  createPlayer,
  findAllPlayer,
  findOnePlayer,
} from "../player/player.repository.js";
import { createTransaction } from "../transaction/transaction.repository.js";
import { findOneUser } from "../user/user.repository.js";
import {
  findListVoucher,
  findOneVoucher,
} from "../voucher/voucher.repository.js";

const fakerGetRandom = faker.helpers.arrayElement;

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getDayFromDate(totalDay) {
  let day = 1;
  let days = [];
  for (let i = 1; i < +totalDay; i++) {
    days.push(i);
  }

  day = faker.helpers.arrayElement(days);

  return day.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

function getTime() {
  let hours = [];
  let minutes = [];
  let seconds = [];

  for (let index = 0; index < 24; index++) hours.push(index);
  for (let index = 0; index < 60; index++) minutes.push(index);
  for (let index = 0; index < 60; index++) seconds.push(index);

  const hour = fakerGetRandom(hours).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  const minute = fakerGetRandom(minutes).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  const second = fakerGetRandom(seconds).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return `${hour}:${minute}:${second}`;
}

export const generateUsers = async (req, res, next) => {
  const result = req.body.result || 10;
  let data = [];
  try {
    let categories = await findAllCategories();

    categories = ToPlainObject(categories);

    for (let i = 0; i < result; i++) {
      const name1st = faker.name.firstName();
      const name2nd = "Legieuvn";
      const name = `${name1st} ${name2nd}`;

      const username = name.split(" ").join("_").toLowerCase();

      const email = faker.internet.email(name1st, name2nd, "storegg.com");

      const existEmail = await findOneUser({
        where: {
          email: email,
        },
      });

      if (!existEmail) {
        const user = {
          name,
          username,
          role: "PLAYER",
          email: email.toLowerCase(),
          password: bcryptjs.hashSync("12345", 12),
          avatar: faker.image.avatar(),
          phone_number: faker.phone.number("+62###-####-####"),
          favorite: GetRandom(categories).category_id,
        };

        // const createdUser = await createU;

        const created = await createPlayer(user);

        data.push(ToPlainObject(created));
      }
    }

    res.status(201).json({
      data,
      success: data.length,
      result: result,
    });
  } catch (error) {
    Logger.error(error, "[EXCEPTION] generateUsers");
    next(new TransfromError(error));
  }
};

export const generateChekcout = async (req, res, next) => {
  // const { accountGame, name, nominal, voucher, payment, bank } = req.body;

  const result = req.body.result || 10;

  let data = [];

  try {
    const payment = "PYM0001";
    const listVoucher = await findListVoucher({ where: {} });
    const listPlayers = await findAllPlayer({ where: {} });
    const resPayment = await findPaymentById(payment);

    for (let i = 0; i < result; i++) {
      const resPlayer = fakerGetRandom(listPlayers);
      const resVoucher = ToPlainObject(fakerGetRandom(listVoucher));
      const resNominal = fakerGetRandom(resVoucher.nominals);
      const resBank = ToPlainObject(fakerGetRandom(resPayment.banks));

      const month = fakerGetRandom(["05", "06", "07", "08"]);

      const totalDay = getDaysInMonth(2022, month);
      const day = getDayFromDate(totalDay);

      const name = resPlayer.user.name;
      const accountGame = resPlayer.user.username;
      const status = fakerGetRandom(["pending", "success"]);
      const times = getTime();
      console.log(times);
      const created_at = DayjsUTC(`2022-${month}-${day} ${times}`);

      let tax = (10 / 100) * resNominal.price;
      let value = resNominal.price - tax;

      const historyVoucherTopup = {
        game_name: resVoucher.game_name,
        category: resVoucher.category ? resVoucher.category.name : "",
        thumbnail: resVoucher.thumbnail,
        coin_name: resNominal.coin_name,
        coin_quantity: resNominal.coin_quantity,
        price: +resNominal.price,
      };

      const historyPayment = {
        account_name: resBank.account_name,
        type: resPayment.type,
        bank_name: resBank.bank_name,
        no_rekening: resBank.no_rekening,
      };

      const historyPlayer = {
        name: resPlayer?.user.name,
        email: resPlayer?.user.email,
        phone_number: resPlayer?.user.phone_number,
      };

      const payload = {
        historyVoucherTopup,
        historyPayment,
        historyPlayer,
        name: name,
        account_game: accountGame,
        tax: tax,
        value: value,
        voucher_id: resVoucher.voucher_id,
        player_id: resPlayer.player_id,
        category_id: resVoucher.category_id,
        payment_method_id: resPayment.payment_method_id,
        created_at,
        updated_at: created_at,
        status: status,
      };

      const result = await createTransaction(payload);

      data.push(ToPlainObject(result));
      // data.push(payload);
    }

    // const resVoucher = await findOneVoucher({
    //   where: {
    //     voucher_id: voucher,
    //   },
    //   attributes: {
    //     exclude: ["created_at", "updated_at", "admin_id"],
    //   },
    // });

    // if (!resVoucher) {
    //   throw new BaseError(
    //     "NOT_FOUND",
    //     httpStatusCodes.NOT_FOUND,
    //     "Voucher game tidak ditemukan.",
    //     true
    //   );
    // }

    // const resNominal = await findNominalById(nominal);

    // if (!resNominal) {
    //   throw new BaseError(
    //     "NOT_FOUND",
    //     httpStatusCodes.NOT_FOUND,
    //     "Nominal tidak ditemukan.",
    //     true
    //   );
    // }

    // const resPayment = await findPaymentById(payment);

    // if (!resPayment) {
    //   throw new BaseError(
    //     "NOT_FOUND",
    //     httpStatusCodes.NOT_FOUND,
    //     "Metode pembayaran tidak ditemukan.",
    //     true
    //   );
    // }

    // const resBank = resPayment.banks.find(bnk => bnk.bank_id === bank);

    // if (!resBank) {
    //   throw new BaseError(
    //     "NOT_FOUND",
    //     httpStatusCodes.NOT_FOUND,
    //     "Bank tidak ditemukan.",
    //     true
    //   );
    // }

    // const player = await findOnePlayer({
    //   where: {
    //     user_id: req.player.user_id,
    //   },
    // });
    // // console.log();

    // let tax = (10 / 100) * resNominal.dataValues.price;
    // let value = resNominal.dataValues.price - tax;

    // const historyVoucherTopup = {
    //   game_name: resVoucher.dataValues.game_name,
    //   category: resVoucher.dataValues.category ? resVoucher.category.name : "",
    //   thumbnail: resVoucher.dataValues.thumbnail,
    //   coin_name: resNominal.dataValues.coin_name,
    //   coin_quantity: resNominal.dataValues.coin_quantity,
    //   price: +resNominal.dataValues.price,
    // };

    // const historyPayment = {
    //   account_name: resBank.dataValues.account_name,
    //   type: resPayment.dataValues.type,
    //   bank_name: resBank.dataValues.bank_name,
    //   no_rekening: resBank.dataValues.no_rekening,
    // };
    // const historyPlayer = {
    //   name: player?.user.name,
    //   email: player?.user.email,
    //   phone_number: player?.user.phone_number,
    // };

    // const payload = {
    //   historyVoucherTopup,
    //   historyPayment,
    //   historyPlayer,
    //   name,
    //   name: name,
    //   account_game: accountGame,
    //   tax: tax,
    //   value: value,
    //   voucher_id: resVoucher.dataValues.voucher_id,
    //   player_id: player.player_id,
    //   category_id: resVoucher.dataValues.category_id,
    //   payment_method_id: resPayment.dataValues.payment_method_id,
    //   status: "pending",
    // };

    // const result = await createTransaction(payload);

    res.status(200).json({
      message: "Generate checkout berhasil",
      data: data,
    });
  } catch (error) {
    next(new TransfromError(error));
  }
};
