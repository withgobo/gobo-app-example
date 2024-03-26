import cookieSession from "cookie-session";
import crypto from "node:crypto";

import { base64URLEncode, getSecretKey } from "./utils.js";

function generateSessionId() {
  return base64URLEncode(crypto.randomBytes(24));
}

export default [
  cookieSession({
    name: "reflector_session",
    secret: getSecretKey(),
  }),
  (req, res, next) => {
    if (req.session.isNew) req.session.id = generateSessionId();
    next();
  },
];
