import axios from "axios";
import express from "express";
import nocache from "nocache";
import { URL } from "node:url";

import { getClientID, getMarketplaceURL } from "../lib/utils.js";

const CLIENT_ID = getClientID();
const MARKETPLACE_URL = getMarketplaceURL();

const router = express.Router();

router.get("/", nocache(), async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({
        error: "No session token found",
      });
    } else if (!req.session.token) {
      return res.status(401).json({
        error: "No existing access token found",
      });
    } else if (!req.session.token.refresh_token) {
      return res.status(401).json({
        error: "No refresh token found",
      });
    }

    const tokenURL = new URL("/oauth/token", MARKETPLACE_URL);

    // Make the refresh token request
    const response = await axios.post(
      tokenURL,
      {
        grant_type: "refresh_token",
        client_id: CLIENT_ID,
        refresh_token: req.session.token.refresh_token,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    // Update the session with the new access token data
    req.session.token = response.data;

    // Extend the session duration
    req.session = { ...req.session };

    res.json({
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Token refresh failed:", error.message);

    // Return simple JSON error for all cases
    res.status(error.response?.status || 500).json({
      error: error.message,
    });
  }
});

export default router;
