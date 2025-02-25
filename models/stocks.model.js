const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      default: null,
      set: (value) => value?.toUpperCase(), // Convert to uppercase
    },
    nameOfCompany: {
      type: String,
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

const Stocks = mongoose.model('Stocks', schema);

module.exports = Stocks;