'use strict';

const yf = require('yahoo-finance2').default;

// Controller function for Express.js
const fetchStockData = async (req, res) => {
  try {
    const symbol = req.params.symbol?.toUpperCase();

    if (!symbol) {
      return res.status(400).json({
        error: "Stock symbol is required. Please provide it as a path parameter.",
      });
    }

    // Append ".NS" for NSE-listed companies
    const yahooSymbol = `${symbol}.NS`;

    // Fetch stock quote
    const stockData = await yf.quote(yahooSymbol);

    // Check if data is returned
    if (!stockData || Object.keys(stockData).length === 0) {
      return res.status(404).json({
        success: false,
        message: `No data found for stock symbol: ${symbol}`,
      });
    }

    // Return formatted stock data
    return res.status(200).json({
      success: true,
      data: {
        symbol: stockData.symbol,
        name: stockData.shortName,
        price: stockData.regularMarketPrice,
        previousClose: stockData.regularMarketPreviousClose,
        open: stockData.regularMarketOpen,
        dayHigh: stockData.regularMarketDayHigh,
        dayLow: stockData.regularMarketDayLow,
        volume: stockData.regularMarketVolume,
        currency: stockData.currency,
        marketState: stockData.marketState,
      },
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return res.status(500).json({
      error: `Error fetching stock data: ${error.message}`,
    });
  }
};

// Export function
module.exports = {
  fetchStockData,
};