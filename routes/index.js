import express from "express";

import { getMarketplaceURL } from "../lib/utils.js";

const router = express.Router();

router.get("/", (req, res) => {
  const context = {
    user: req.session.user || null,
    isAuthenticated: !!req.session.token,
    marketplaceURL: getMarketplaceURL(),
    timestamp: new Date().toISOString(),
  };

  res.render("index.html", context);
});

export default router;
