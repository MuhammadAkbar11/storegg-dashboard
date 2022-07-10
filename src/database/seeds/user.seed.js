import path from "path";
import fs from "fs";
import bcryptjs from "bcryptjs";
import UserModel from "../../modules/user/user.model";

export async function seedImportUsers() {
  const usersJson = await fs.readFileSync(path.resolve("src/data/users.json"));
  const users = JSON.parse(usersJson).map(user => {
    return {
      ...user,
      password: bcryptjs.hashSync(user.password, 12),
    };
  });

  await UserModel.insertMany(users);
}

export async function seedDestroyUsers() {
  await UserModel.deleteMany();
}
