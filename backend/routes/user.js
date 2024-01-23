const express = require("express");
const { userVal, updateZod } = require("../zod");
const userRouter = express.Router();
const { userModel, accountModel } = require("../db");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { validateToken } = require("../middleware");
userRouter.post("/signup", async (req, res) => {
  const isValid = userVal.safeParse(req.body);
  if (isValid.success) {
    const isExists = await userModel.findOne({ userName: req.body.userName });
    if (!isExists) {
      const newUser = new userModel({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });

      const hashedPassword = await newUser.createHashedPassword(
        req.body.password
      );

      const balance = Math.floor(Math.random() * (10000 - 100) + 100);

      const accounts = new accountModel({
        userId: newUser._id,
        balance: balance,
      });

      newUser.password = hashedPassword;
      const userId = newUser._id;
      await newUser.save();
      await accounts.save();
      const token = jwt.sign({ userId }, SECRET_KEY);
      res.status(200).json({
        message: "User created successfully",
        token: token,
      });
    } else {
      res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
    }
  } else {
    res.status(411).json({
      message: "Not a valid inputs",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const isValid = userVal.safeParse(req.body);
  if (!isValid.success) {
    res.status(411).json({
      message: "Not a valid inputs",
    });
    return;
  }
  const isExists = await userModel.findOne({
    userName: req.body.userName,
  });
  if (!isExists) {
    res.status(411).json({
      message: "User does not exists, Please signup!",
    });
  } else {
    const isSame = await isExists.comparePassword(req.body.password);
    if (isSame) {
      const token = jwt.sign(isExists.userName, SECRET_KEY);
      res.status(200).json({
        message: "Successfully logged in",
        token: token,
      });
    }
  }
});

userRouter.put("/update", validateToken, async (req, res) => {
  const { success, error } = updateZod.safeParse({
    password: req.body?.password,
    firstName: req.body?.firstName,
    lastName: req.body?.lastName,
  });
  if (success) {
    const user = await userModel.findOne({
      userName: req.userId,
    });
    await userModel.updateOne({ userName: req.userId }, { $set: req.body });

    res.status(202).json({
      message: "Updated successfully",
    });
  } else {
    res.status(411).json({
      message: error,
    });
  }
});

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await userModel.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });
  console.log(users);
  res.status(200).json({
    users: users.map((data) => ({
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      _id: data._id,
    })),
  });
});

module.exports = userRouter;
