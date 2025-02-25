const express = require('express');
const router = express.Router();
const StocksController = require('../controllers/stock.controller');

/**
 * @swagger
 * /api/stock/{symbol}:
 *   get:
 *     tags:
 *       - Stock
 *     summary: Get stock data for a specific symbol
 *     description: Retrieve stock data including daily prices (open, high, low, close) and volume for a specific stock symbol.
 *     parameters:
 *       - name: symbol
 *         in: path
 *         required: true
 *         description: Stock symbol (e.g., IBM, AAPL, INFY, etc.)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved stock data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     Meta_Data:
 *                       type: object
 *                       properties:
 *                         1_Information:
 *                           type: string
 *                           example: "Daily Prices (open, high, low, close) and Volumes"
 *                         2_Symbol:
 *                           type: string
 *                           example: "IBM"
 *                         3_Last_Refreshed:
 *                           type: string
 *                           example: "2023-01-21"
 *                     Time_Series_Daily:
 *                       type: object
 *                       additionalProperties:
 *                         type: object
 *                         properties:
 *                           open:
 *                             type: string
 *                             example: "142.00"
 *                           high:
 *                             type: string
 *                             example: "143.30"
 *                           low:
 *                             type: string
 *                             example: "141.50"
 *                           close:
 *                             type: string
 *                             example: "142.80"
 *                           volume:
 *                             type: string
 *                             example: "3200000"
 *       400:
 *         description: Bad Request - Invalid input or missing stock symbol
 *       401:
 *         description: Authorization Failure
 *       422:
 *         description: Validation Error - Input does not meet requirements
 *       500:
 *         description: Internal Server Error - Unexpected failure
 */

router.get('/stock/:symbol', StocksController.fetchStockData);

module.exports = router;