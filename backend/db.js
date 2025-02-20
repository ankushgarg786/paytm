const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:admin%40123@cluster0.nuhnpst.mongodb.net/paytm"
);
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowecase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    minLength: 6,
    required: true,
  },
  firstName: {
    type: String,
    maxLength: 50,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    maxLength: 50,
    required: true,
    trim: true,
  },
});
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});
const User = mongoose.model("User", UserSchema);
const Account = mongoose.model("Account", accountSchema);
module.exports = {
  User,
  Account,
};
