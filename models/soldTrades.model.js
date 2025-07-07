const mongoose = require("mongoose");

const soldTradesSchema = new mongoose.Schema(
  {
    stockName: { type: String, default: null, trim: true },
    buyDate: { type: Date, default: null },
    buyPrice: { type: Number, default: null },
    sellDate: { type: Date, default: null },
    sellPrice: { type: Number, default: null },
    quantity: { type: [Number], default: [] },
    stopLoss: { type: Number, default: null },
    exitType: { type: String, default: null },
    
    // ✅ Reference to the original trade in "trades" collection
    originalTradeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'trades',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = mongoose.model("soldTrades", soldTradesSchema);
