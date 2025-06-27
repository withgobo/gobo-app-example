import axios from "axios";
import express from "express";
import createError from "http-errors";
import nocache from "nocache";
import { URL } from "node:url";

import { formatError, parseErrorMessage } from "../lib/error.js";
import { decryptCodeVerifier } from "../lib/pkce.js";
import { getClientID, getMarketplaceURL } from "../lib/utils.js";

const CLIENT_ID = getClientID();
const MARKETPLACE_URL = getMarketplaceURL();

const router = express.Router();

router.get("/", nocache(), async (req, res, next) => {
  // Make sure the required query params are set.
  if (!req.query.error && (!req.query.code || !req.query.state)) {
    return next(createError(400, "Invalid request parameters."));
  }

  const tokenURL = new URL("/oauth/token", MARKETPLACE_URL);
  const redirectURL = new URL("/redirect", MARKETPLACE_URL);

  // If there's an error, convert the error code to a message and
  // redirect to the marketplace.
  if (req.query.error) {
    redirectURL.search = new URLSearchParams({
      error_message: formatError(req.query.error),
    });
    return res.redirect(redirectURL.href);
  }

  // Get the code verifier from the JWT contained in the state.
  decryptCodeVerifier(req.query.state, req.session.id)
    .then((verifier) => {
      axios
        // Use the verifier to try and obtain a token.
        .post(
          tokenURL,
          {
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            code: req.query.code,
            code_verifier: verifier,
          },
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          },
        )
        // Set the install_success param and update the session if successful.
        .then((response) => {
          redirectURL.search = new URLSearchParams({
            install_success: "true",
          });
          req.session.token = response.data;
          // console.log(response.data);
        })
        // Otherwise create an error message.
        .catch((error) => {
          redirectURL.search = new URLSearchParams({
            error_message: formatError(parseErrorMessage(error)),
          });
        })
        // Redirect to the marketplace when done.
        .finally(() => {
          return res.redirect(redirectURL.href);
        });
    })
    .catch(() => {
      return next(createError(400, "Invalid state parameter."));
    });
});

export default router;
