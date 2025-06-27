import crypto from "node:crypto";
import { URL } from "node:url";

export function base64URLEncode(buf) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function getClientID() {
  const clientID = process.env.APP_CLIENT_ID;
  if (!clientID) throw new Error("APP_CLIENT_ID not set");
  return clientID;
}

export function getMarketplaceURL() {
  const marketplaceURL = process.env.APP_MARKETPLACE_URL;
  if (!marketplaceURL) throw new Error("APP_MARKETPLACE_URL not set");
  return new URL(marketplaceURL);
}

export function getApiURL() {
  const apiURL = process.env.API_URL;
  if (!apiURL) throw new Error("API_URL not set");
  return apiURL;
}

export function getSecretKey() {
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) throw new Error("SECRET_KEY not set");
  return secretKey;
}

export function getSecretKeyHash() {
  const secretKey = getSecretKey();
  return crypto.createHash("sha256").update(secretKey).digest();
}
