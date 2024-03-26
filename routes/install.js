import express from "express";
import nocache from "nocache";
import { URL } from "node:url";

import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateState,
} from "../lib/pkce.js";
import { getClientID, getMarketplaceURL } from "../lib/utils.js";

const CLIENT_ID = getClientID();
const MARKETPLACE_URL = getMarketplaceURL();

const router = express.Router();

router.get("/", nocache(), async (req, res) => {
  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  const state = await generateState(verifier, req.session.id);

  let params = {
    response_type: "code",
    client_id: CLIENT_ID,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state: state,
  };
  if (req.query.target) params.target = req.query.target;
  if (req.query.target_id) params.target_id = req.query.target_id;

  const authorizationURL = new URL("/oauth/authorize", MARKETPLACE_URL);
  authorizationURL.search = new URLSearchParams(params);

  return res.redirect(authorizationURL.href);
});

export default router;
