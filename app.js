import express from "express";
import morgan from "morgan";
import nunjucks from "nunjucks";

import { errorHandler, notFoundHandler } from "./lib/error.js";
import session from "./lib/session.js";
import apiRouter from "./routes/api.js";
import callbackRouter from "./routes/callback.js";
import indexRouter from "./routes/index.js";
import installRouter from "./routes/install.js";
import refreshRouter from "./routes/refresh.js";

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
app.set("trust proxy", true);

// routes
app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/install", installRouter);
app.use("/callback", callbackRouter);
app.use("/refresh", refreshRouter);

// error pages
app.use(notFoundHandler);
app.use(errorHandler);

// server
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
