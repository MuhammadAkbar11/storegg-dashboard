import path from "path";
import fs from "fs";
import { faker } from "@faker-js/faker";
import bcryptjs from "bcryptjs";
import User from "../../models/user.model.js";
import Logger from "../../helpers/logger.helper.js";
import { DEFAULT_USER_PP } from "../../constants/index.constants.js";
import Administrator from "../../models/admin.model.js";
import Player from "../../models/player.model.js";

export async function seedImportUsers() {
  const jsonFile = path.resolve("src/database/data/users.json");
  const usersJson = fs.readFileSync(jsonFile, "utf8");

  await User.destroy({ where: {} });

  await Administrator.destroy({ where: {} });
  await Player.destroy({ where: {} });

  // let count = +userIdIncr.value;
  const usersParse = JSON.parse(usersJson);

  const users = usersParse.map((user, i) => {
    const data = {
      ...user,
      username: user.name,
      phone_number: faker.phone.number("+62###-####-####"),
      password: bcryptjs.hashSync(user.password, 12),
      avatar: DEFAULT_USER_PP,
    };

    return data;
  });

  const createdUsers = await User.bulkCreate(users, {
    individualHooks: false,
    returning: true,
  });

  // // await UserModel.insertMany(users);
  Logger.info("[seed] Users imported!");

  for (const newUser of createdUsers) {
    const isAdmin = newUser.dataValues.role.includes("ADMIN");
    const isPlayer = newUser.dataValues.role.includes("PLAYER");
    if (isAdmin) {
      const newAdmin = await Administrator.create(
        {
          user_id: newUser.dataValues.user_id,
        },
        { returning: true }
      );
      Logger.info(`[seed] new admin ${newAdmin.dataValues.admin_id}!`);
    }

    if (isPlayer) {
      const newPlayer = await Player.create(
        {
          user_id: newUser.dataValues.user_id,
        },
        { returning: true }
      );
      Logger.info(`[seed] create player  ${newPlayer.dataValues.player_id}!`);
    }
  }

  // await Promise.all(
  //   createdUsers.forEach(async newUser => {
  //     Logger.info(newUser.dataValues.role);
  //     const isAdmin = newUser.dataValues.role.includes("ADMIN");
  //     if (isAdmin) {
  //
  //     }
  //   })
  // );
}

export async function seedDestroyUsers() {
  await UserModel.deleteMany();
}
