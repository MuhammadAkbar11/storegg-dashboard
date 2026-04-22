import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function GeneratePassword(password) {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  return password_hash;
}

export async function ComparePassword(enteredPassword, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(enteredPassword, password, function (error, res) {
      if (error) reject(error);
      resolve(res);
    });
  });
}

// jwt
export function SignJWT(payload, privateKey, expiresIn) {
  return jwt.sign(payload, privateKey, { expiresIn });
}

export function VerifyJWT(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
  }
}
