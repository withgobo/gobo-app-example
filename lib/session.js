import cookieSession from "cookie-session";
import crypto from "node:crypto";

import { base64URLEncode, getSecretKey } from "./utils.js";

function generateSessionId() {
  return base64URLEncode(crypto.randomBytes(24));
}

export default [
  cookieSession({
    name: "session",
    secret: getSecretKey(),
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  }),
  (req, res, next) => {
    if (req.session.isNew) req.session.id = generateSessionId();
    next();
  },
];
