const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      default: null,
      set: (value) => value?.toUpperCase(),
      trim: true,
    },
    nameOfCompany: {
      type: String,
      default: null,
      trim: true,
    },
    stockName: {
      type: String,
      default: null,
      trim: true,
    },
    buyDate: {
      type: Date,
      default: null,
    },
    buyPrice: {
      type: Number,
      default: null,
    },
    sellDate: {
      type: Date,
      default: null,
    },
    sellPrice: {
      type: Number,
      default: null,
    },
    quantity: {
      type: Number,
      default: null,
    },
    stopLoss: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = mongoose.model("Stock", stockSchema);
