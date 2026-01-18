import crypto from "crypto";
import bcrypt from "bcryptjs";

export function generateRecoveryCodes(count = 8) {
  const plainCodes = [];
  const hashedCodes = [];

  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString("hex"); 
    plainCodes.push(code);

    hashedCodes.push({
      code: bcrypt.hashSync(code, 10),
      used: false,
    });
  }

  return { plainCodes, hashedCodes };
}
