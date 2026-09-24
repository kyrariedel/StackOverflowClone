// Account Document Schema
const mongoose = require("mongoose");

const Account = require("./schema/account");

module.exports = mongoose.model("Account", Account);
