import axios from "axios";
import express from "express";
import nocache from "nocache";

import { getApiURL } from "../lib/utils.js";

const router = express.Router();

router.get("/", nocache(), async (req, res) => {
  try {
    // Get the API URL from utils
    const apiUrl = getApiURL();

    // Prepare headers
    const headers = {
      "User-Agent": "Gobo-App-Example/1.0",
      Accept: "application/json",
    };

    // Add authorization header if access token exists in session
    if (req.session?.token?.access_token) {
      headers.Authorization = `Bearer ${req.session.token.access_token}`;
    }

    // Make the API call
    const response = await axios.get(apiUrl, {
      headers,
      timeout: 5000, // 5 second timeout
    });

    // Check if response is JSON
    const contentType = response.headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
      throw new Error("API did not return JSON");
    }

    // Return the actual JSON response
    res.json(response.data);
  } catch (error) {
    console.error("API call failed:", error.message);

    // Return simple JSON error for all cases
    res.status(error.response?.status || 500).json({
      error: error.message,
    });
  }
});

export default router;
