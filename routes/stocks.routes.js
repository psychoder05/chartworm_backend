const express = require('express');
const router = express.Router();
const StocksController = require('../controllers/stock.controller');

/**
 * @swagger
 * /api/stock/{symbol}:
 *   get:
 *     tags:
 *       - Stock
 *     summary: Get stock data for a specific NSE symbol
 *     description: Retrieve real-time stock data (open, high, low, close, volume, etc.) using Yahoo Finance.
 *     parameters:
 *       - name: symbol
 *         in: path
 *         required: true
 *         description: NSE stock symbol (e.g., INFY, TCS, RELIANCE)
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
 *                     symbol:
 *                       type: string
 *                       example: "INFY.NS"
 *                     name:
 *                       type: string
 *                       example: "Infosys Limited"
 *                     price:
 *                       type: number
 *                       example: 1460.75
 *                     previousClose:
 *                       type: number
 *                       example: 1458.20
 *                     open:
 *                       type: number
 *                       example: 1465.00
 *                     dayHigh:
 *                       type: number
 *                       example: 1472.00
 *                     dayLow:
 *                       type: number
 *                       example: 1451.50
 *                     volume:
 *                       type: number
 *                       example: 5218650
 *                     currency:
 *                       type: string
 *                       example: "INR"
 *                     marketState:
 *                       type: string
 *                       example: "REGULAR"
 *       400:
 *         description: Bad Request - Missing or invalid stock symbol
 *       422:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */

router.get('/stock/:symbol', StocksController.fetchStockData);



module.exports = router;
