import crypto from "node:crypto";

export const ADMIN_COOKIE = "paperboat_admin";

function expectedSessionValue() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return "";
  return crypto
    .createHmac("sha256", password)
    .update("paperboat-admin-session-v1")
    .digest("hex");
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function verifyAdminPassword(password) {
  return Boolean(process.env.ADMIN_PASSWORD) &&
    safeEqual(password, process.env.ADMIN_PASSWORD);
}

export function verifyAdminCookie(value) {
  const expected = expectedSessionValue();
  return Boolean(expected) && safeEqual(value, expected);
}

export function getAdminSessionValue() {
  return expectedSessionValue();
}
