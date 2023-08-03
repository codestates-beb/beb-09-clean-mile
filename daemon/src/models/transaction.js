const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  account: { type: String },
  badgeType: { type: Number },
  amount: { type: mongoose.Schema.Types.Mixed },
  uri: { type: String },
  data: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;