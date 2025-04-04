const StockModel = require("../models/stocks.model");
const fs = require("fs");
const csvParser = require("csv-parser");

exports.uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a CSV file." });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (row) => {
      // Clean and map CSV headers to model fields
      const cleanedRow = {};
      Object.keys(row).forEach((key) => {
        // Remove extra spaces, convert to lowercase, and remove spaces within the name
        const cleanedKey = key.trim().toLowerCase().replace(/\s+/g, "");
        cleanedRow[cleanedKey] = row[key];
      });

      results.push({
        symbol: cleanedRow.symbol?.toUpperCase(), // Ensure symbol is uppercase
        nameOfCompany: cleanedRow.nameofcompany, // Map cleaned field to model
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

// Fetch all stock data
exports.getStocks = async (req, res) => {
  try {
    const stocks = await StockModel.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(400).json({ error: "Error fetching stocks", details: error });
  }
};

// Delete all stock data
exports.deleteAllStocks = async (req, res) => {
  try {
    await StockModel.deleteMany({}); // Delete all records
    res.status(200).json({ message: "All stock data deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting stocks", details: error });
  }
};

// this api is for add trade 

exports.addTrade = async (req, res) => {
  try {
    const {
      symbol,
      nameOfCompany,
      stockName,
      buyDate,
      buyPrice,
      sellDate,
      sellPrice,
      quantity,
      stopLoss,
    } = req.body;

    // Validate required fields
    if (!symbol || !buyDate || !buyPrice || !quantity) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create and save new trade
    const newTrade = new StockModel({
      symbol,
      nameOfCompany,
      stockName,
      buyDate,
      buyPrice,
      sellDate,
      sellPrice,
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