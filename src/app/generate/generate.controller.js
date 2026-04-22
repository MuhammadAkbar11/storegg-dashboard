import { faker } from "@faker-js/faker";
import bcryptjs from "bcryptjs";
import { TransfromError } from "../../helpers/baseError.helper.js";
import DayjsUTC from "../../helpers/date.helper.js";
import { GetRandom, ToPlainObject } from "../../helpers/index.helper.js";
import Logger from "../../helpers/logger.helper.js";
import { findAllCategories } from "../category/category.repository.js";
import { findPaymentById } from "../payment/payment.repository.js";
import { createPlayer, findAllPlayer } from "../player/player.repository.js";
import { createTransaction } from "../transaction/transaction.repository.js";
import { findOneUser } from "../user/user.repository.js";
import { findListVoucher } from "../voucher/voucher.repository.js";

const fakerGetRandom = faker.helpers.arrayElement;

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getSelectedMonth() {
  const month = DayjsUTC().month() + 1;

  let monthsArray = [...Array(month).keys()].map(x => {
    return String(x + 1).length > 1 ? `${x + 1}` : `0${x + 1}`;
  });
  if (monthsArray.length >= 4) {
    monthsArray = monthsArray.slice(monthsArray.length - 4, monthsArray.length);
  }

  return monthsArray;
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
          status: "ACTIVE",
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

      const year = DayjsUTC().year();
      const month = fakerGetRandom(getSelectedMonth());

      const totalDay = getDaysInMonth(year, month);
      const day = getDayFromDate(totalDay);

      const name = resPlayer.user.name;
      const accountGame = resPlayer.user.username;
      const status = fakerGetRandom(["pending", "success"]);
      const times = getTime();

      const created_at = DayjsUTC(`${year}-${month}-${day} ${times}`);

      let tax = (10 / 100) * resNominal.price;
      let value = resNominal.price + tax;

      let payer = null;
      let is_paid = fakerGetRandom([true, false]);

      if (status === "success") {
        payer = JSON.stringify({
          pay_date: DayjsUTC(),
          bank_account_name: name,
          bank_name: fakerGetRandom(["BRI", "BNI", "BCA", "Mandiri"]),
          no_bank_account: faker.finance.account(10),
          value: value,
        });
        is_paid = true;
      }

      if (is_paid) {
        payer = JSON.stringify({
          pay_date: DayjsUTC(),
          bank_account_name: name,
          bank_name: fakerGetRandom(["BRI", "BNI", "BCA", "Mandiri"]),
          no_bank_account: faker.finance.account(10),
          value: value,
        });
      }

      const historyVoucherTopup = {
        game_name: resVoucher.game_name,
        category: resVoucher.category ? resVoucher.category.name : "",
        thumbnail: resVoucher.thumbnail,
        coin_name: resNominal.coin_name,
        coin_quantity: resNominal.coin_quantity,
        price: +resNominal.price,
      };

      const historyPayment = {
        payer,
        bank_account_name: resBank.account_name,
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
        is_paid,
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

    res.status(200).json({
      message: "Generate checkout berhasil",
      data: data,
    });
  } catch (error) {
    next(new TransfromError(error));
  }
};
