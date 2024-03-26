import express from "express";
import morgan from "morgan";
import nunjucks from "nunjucks";

import { errorHandler, notFoundHandler } from "./lib/error.js";
import session from "./lib/session.js";
import callbackRouter from "./routes/callback.js";
import installRouter from "./routes/install.js";

const app = express();
const port = process.env.PORT || 8400;

// templates
nunjucks.configure("templates", {
  autoescape: true,
  express: app,
});

// logging
app.use(morgan("dev"));

// sessions
app.use(session);

// routes
app.use("/install", installRouter);
app.use("/callback", callbackRouter);

// error pages
app.use(notFoundHandler);
app.use(errorHandler);

// server
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
