const StockModel = require("../models/stocks.model");
const TradesModel = require("../models/trades.model");
const SoldTradesModel = require("../models/soldTrades.model");
const fs = require("fs");
const csvParser = require("csv-parser");
const yf = require('yahoo-finance2').default;

// this function is used for upload csv 

const uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a CSV file." });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", async (row) => {
      // Clean and map CSV headers to model fields
      const cleanedRow = {};
      Object.keys(row).forEach((key) => {
        const cleanedKey = key.trim().toLowerCase().replace(/\s+/g, "");
        cleanedRow[cleanedKey] = row[key];
      });

      // Fetch additional data from the API (assuming you have access to the API response)
      const apiResponse = {
        symbol: cleanedRow.symbol?.toUpperCase(),
        nameOfCompany: cleanedRow.nameofcompany,
        price: 1426.2,  // Example fetched from API
        previousClose: 1430.6,
        open: 1429.9,
        dayHigh: 1440.7,
        dayLow: 1417.3,
        volume: 8026620,
        currency: "INR",
        marketState: "POSTPOST",
      };

      // Prepare the full stock data with API fields
      results.push({
        symbol: apiResponse.symbol,
        nameOfCompany: apiResponse.nameOfCompany,
        price: apiResponse.price,
        previousClose: apiResponse.previousClose,
        open: apiResponse.open,
        dayHigh: apiResponse.dayHigh,
        dayLow: apiResponse.dayLow,
        volume: apiResponse.volume,
        currency: apiResponse.currency,
        marketState: apiResponse.marketState,
      });
    })
    .on("end", async () => {
      try {
        // Insert the parsed results into MongoDB
        await StockModel.insertMany(results);
        // Delete the uploaded file after processing
        fs.unlinkSync(req.file.path);
        // Respond with success message
        res.status(200).json({ message: "CSV uploaded and data inserted!" });
      } catch (error) {
        // Handle error if insertion fails
        res.status(400).json({ error: "Error inserting data", details: error });
      }
    })
    .on("error", (error) => {
      // Handle CSV parsing error
      res.status(400).json({ error: "Error parsing CSV file", details: error });
    });
};
// this function is used for get stock data

const getStocks = async (req, res) => {
  try {
    const stocks = await StockModel.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(400).json({ error: "Error fetching stocks", details: error });
  }
};

// this function is used for Delete all stock data

const deleteAllStocks = async (req, res) => {
  try {
    await StockModel.deleteMany({}); // Delete all records
    res.status(200).json({ message: "All stock data deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting stocks", details: error });
  }
};

// this function is used for add trades

const addTrade = async (req, res) => {
  try {
    const {
      stockName,
      buyDate,
      buyPrice,
      stopLoss,
    } = req.body;

    let { quantity } = req.body;

    // Ensure quantity is an array
    if (!quantity) {
      return res.status(400).json({ message: "Missing quantity field." });
    }

    if (!Array.isArray(quantity)) {
      quantity = [Number(quantity)];
    }

    // Validate other required fields
    if (!buyDate || !buyPrice || quantity.length === 0) {
      return res.status(400).json({ message: "Missing or invalid required fields." });
    }

    const newTrade = new TradesModel({
      stockName,
      buyDate,
      buyPrice,
      quantity,
      stopLoss,
    });

    const saved = await newTrade.save();
    res.status(201).json({ message: "Trade added successfully!", data: saved });
  } catch (err) {
    console.error("Error in addTrade controller:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// this function is used for add close trades

const updateClosePosition = async (req, res) => {
  try {
    const {
      tradeId,
      sellDate,
      sellPrice,
      stopLoss,
    } = req.body;

    let { quantity } = req.body;

    if (!quantity) return res.status(400).json({ message: "Missing quantity field." });

    const sellQty = Array.isArray(quantity) ? quantity[0] : Number(quantity);

    // Find the trade by ID
    const trade = await TradesModel.findById(tradeId);

    if (!trade) {
      return res.status(404).json({ message: "Trade not found." });
    }

    const existingQty = trade.quantity[0];

    if (sellQty > existingQty) {
      return res.status(400).json({ message: "Sell quantity exceeds available quantity." });
    }

    // Calculate remaining quantity
    const remainingQty = existingQty - sellQty;
    trade.quantity[0] = remainingQty;
    trade.sellDate = sellDate;
    trade.sellPrice = sellPrice;
    trade.stopLoss = stopLoss;
    trade.exitType = remainingQty === 0 ? "Full Exit" : "Partial Exit";

    await trade.save();

    const soldTrade = new SoldTradesModel({
      stockName: trade.stockName,
      buyDate: trade.buyDate,
      buyPrice: trade.buyPrice,
      sellDate,
      sellPrice,
      quantity: [sellQty],
      stopLoss,
      exitType: trade.exitType,
      originalTradeId: trade._id, // ✅ Pass original trade reference
    });

    await soldTrade.save();

    res.status(200).json({
      message: "Trade updated and sold trade recorded successfully",
      data: { updatedTrade: trade, soldTrade }
    });
  } catch (err) {
    console.error("Error in updateClosePosition:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// this function is used for get getPnlStatement

const getPnlStatement = async (req, res) => {
  try {
    const trades = await SoldTradesModel.find();

    const buyTrades = trades.filter(trade => trade.buyDate);
    const sellTrades = trades.filter(trade => trade.sellDate);

    const transactions = [];

    sellTrades.forEach(sell => {
      const matchedBuy = buyTrades.find(buy =>
        buy.stockName === sell.stockName &&
        buy.quantity[0] + sell.quantity[0] >= 0
      );

      if (matchedBuy) {
        const quantity = sell.quantity[0];
        const invested = matchedBuy.buyPrice * quantity;
        const gain = (sell.sellPrice - matchedBuy.buyPrice) * quantity;

        transactions.push({
          tradeId: sell.originalTradeId?.toString(), // ✅ Add this line
          scripName: sell.stockName,
          buyDate: matchedBuy.buyDate,
          buyPrice: matchedBuy.buyPrice,
          sellDate: sell.sellDate,
          sellPrice: sell.sellPrice,
          quantity,
          investedAmount: invested.toFixed(2),
          realisedGainLoss: gain >= 0 ? `+${gain.toFixed(2)}` : gain.toFixed(2),
          gainLossPercent:
            gain >= 0
              ? `+${((gain / invested) * 100).toFixed(2)}%`
              : `${((gain / invested) * 100).toFixed(2)}%`,
        });
      }
    });

    res.status(200).json({
      transactions,
      totalRows: transactions.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in getPnlStatement:", error);
    res.status(500).json({ message: "PnL Fetch Error", error: error.message });
  }
};

const getLiveOpenPositions = async (req, res) => {
  try {
    const trades = await TradesModel.find();

    const openBuys = trades.filter(
      t =>
        t.buyDate &&
        Array.isArray(t.quantity) &&
        t.quantity[0] > 0 
    );

    const positions = await Promise.all(
      openBuys.map(async (trade) => {
        const symbol = trade.stockName.toUpperCase();

        // Fetch LTP using yahoo-finance2
        let ltp = 0;
        try {
          const quote = await yf.quote(`${symbol}.NS`);
          ltp = quote?.regularMarketPrice ?? 0;
        } catch (err) {
          console.warn(`Failed to fetch quote for ${symbol}:`, err.message);
        }

        const quantity = trade.quantity[0];
        const investedAmount = trade.buyPrice * quantity;
        const gain = (ltp - trade.buyPrice) * quantity;
        const gainPercent = investedAmount
          ? (gain / investedAmount) * 100
          : 0;

        return {
          scripName: symbol,
          buyDate: trade.buyDate,
          buyPrice: trade.buyPrice,
          tradeId: trade._id,
          quantity,
          investedAmount: investedAmount.toFixed(2),
          ltp: ltp.toFixed(2),
          unrealisedGainLoss:
            gain >= 0 ? `+${gain.toFixed(2)}` : gain.toFixed(2),
          gainLossPercent:
            gainPercent >= 0
              ? `+${gainPercent.toFixed(2)}%`
              : `${gainPercent.toFixed(2)}%`,
          stopLoss: trade.stopLoss,
        };
      })
    );

    res.json({ positions });
  } catch (err) {
    console.error("Error in getLiveOpenPositions:", err);
    res.status(500).json({
      message: "Error fetching live positions",
      error: err.message,
    });
  }
};

const getAllTrades = async (req, res) => {
  try {
    const trades = await TradesModel.find().sort({ created_at: -1 });

    res.status(200).json({
      message: "All trades fetched successfully.",
      data: trades,
    });
  } catch (err) {
    console.error("Error in getAllTrades controller:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  uploadCSV,
  getStocks,
  deleteAllStocks,
  addTrade,
  updateClosePosition,
  getPnlStatement,
  getLiveOpenPositions,
  getAllTrades
};