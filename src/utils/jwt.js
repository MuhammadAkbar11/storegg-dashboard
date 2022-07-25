import jwt from "jsonwebtoken";

// sign jwt
export function signJWT(payload, privateKey, expiresIn) {
  return jwt.sign(payload, privateKey, { expiresIn });
}

export function verifyJWT(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
  }
}
