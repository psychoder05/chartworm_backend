'use strict';
const axios = require('axios');
const { NseIndia } = require('stock-nse-india');
const nseIndia = new NseIndia();

// Fetch details of a stock
nseIndia.getEquityDetails('INFY').then(data => {
  console.log(data);
});

const fetchStockData = async (req, res) => {
  try {
    const stockSymbol = req.params.symbol;

    if (!stockSymbol) {
      return res.status(400).json({
        error: "Stock symbol is required. Please provide it as a path parameter.",
      });
    }

    const stockData = await nseIndia.getEquityDetails(stockSymbol);

    console.log("Raw Stock Data:", stockData);

    // Handle cases where no data is returned
    if (!stockData || Object.keys(stockData).length === 0) {
      return res.status(404).json({
        success: false,
        message: `No data found for stock symbol: ${stockSymbol}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: stockData,
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return res.status(500).json({
      error: `Error fetching stock data: ${error.message}`,
    });
  }
};

// Export the function
module.exports = {
  fetchStockData,
};