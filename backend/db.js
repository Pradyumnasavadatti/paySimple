const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
  },
  password: {
    type: String,
  },
});

userSchema.methods.createHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(5);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

userSchema.methods.comparePassword = async function (password) {
  const isSame = await bcrypt.compare(password, this.password);
  return isSame;
};

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  balance: Number,
});

const userModel = mongoose.model("user", userSchema);
const accountModel = mongoose.model("accounts", accountSchema);

module.exports = { userModel, accountModel };
