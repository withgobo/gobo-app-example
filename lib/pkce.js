import { EncryptJWT, jwtDecrypt } from "jose";
import crypto from "node:crypto";

import { base64URLEncode, getSecretKeyHash } from "./utils.js";

export function generateCodeVerifier() {
  return base64URLEncode(crypto.randomBytes(32));
}

export function generateCodeChallenge(verifier) {
  return base64URLEncode(crypto.createHash("sha256").update(verifier).digest());
}

export async function generateState(verifier, sessionID) {
  // Encode code verifier and session ID in the OAuth2 state parameter.
  // See: https://joseph.is/49buPZ1
  const payload = { code_verifier: verifier, rfp: sessionID };

  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .encrypt(getSecretKeyHash());
}

export async function decryptCodeVerifier(state, sessionID) {
  return jwtDecrypt(state, getSecretKeyHash(), {
    keyManagementAlgorithms: ["dir"],
    contentEncryptionAlgorithms: ["A256GCM"],
    requiredClaims: ["code_verifier", "rfp"],
  }).then((jwt) => {
    if (sessionID !== jwt.payload.rfp) throw new Error("Invalid session ID");
    return jwt.payload.code_verifier;
  });
}
