import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

export function encrypt(text, secret) {
  const iv = crypto.randomBytes(12);
  const key = crypto.createHash("sha256").update(secret).digest();

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag().toString("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted,
    tag,
  };
}

export function decrypt(payload, secret) {
  const key = crypto.createHash("sha256").update(secret).digest();

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(payload.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(payload.tag, "hex"));

  let decrypted = decipher.update(payload.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}