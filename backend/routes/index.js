const express = require("express");
const userRouter = require("./user");
const accountRouter = require("./account");

const routes = express.Router();

routes.use("/user", userRouter);
routes.use("/account", accountRouter);

module.exports = routes;
