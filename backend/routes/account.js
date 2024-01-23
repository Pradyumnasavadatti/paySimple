const express = require("express");
const { validateToken } = require("../middleware");
const { accountModel } = require("../db");
const { default: mongoose } = require("mongoose");

const accountRouter = express.Router();

accountRouter.get("/balance", validateToken, async (req, res) => {
  const details = await accountModel.findOne({
    userId: req.userId,
  });
  if (details) {
    res.json({
      balance: details.balance,
    });
  } else {
    res.status(411).json({
      message: "Account not found :<",
    });
  }
});

accountRouter.post("/transfer", validateToken, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { to, amount } = req.body;
    const toUser = await accountModel.findOne({
      userId: to,
    });

    const user = await accountModel.findOne({
      userId: req.userId,
    });
    if (!toUser || !user) {
      res.status(400).json({
        message: "User not found",
      });
      throw new Error("Invalid user");
    }
    if (user.balance < amount) {
      res.status(400).json({
        message: "Insufficient balance",
      });
      throw new Error("Insufficient balace");
    }
    await accountModel
      .updateOne(
        { userId: user.userId },
        {
          $inc: {
            balance: -amount,
          },
        }
      )
      .session(session);

    await accountModel
      .updateOne(
        { userId: toUser.userId },
        {
          $inc: {
            balance: amount,
          },
        }
      )
      .session(session);

    session.commitTransaction();

    res.json({
      message: "Transaction successfull",
    });
  } catch (err) {
    session.abortTransaction();
    res.json({
      message: "Transaction unsuccessfull",
    });
  }
});

module.exports = accountRouter;
