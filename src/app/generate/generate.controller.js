import { faker } from "@faker-js/faker";
import bcryptjs from "bcryptjs";
import { TransfromError } from "../../helpers/baseError.helper.js";
import { GetRandom, ToPlainObject } from "../../helpers/index.helper.js";
import Logger from "../../helpers/logger.helper.js";
import { findAllCategories } from "../category/category.repository.js";
import { createPlayer } from "../player/player.repository.js";
import { findOneUser } from "../user/user.repository.js";

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
