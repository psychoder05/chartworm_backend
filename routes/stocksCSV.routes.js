const express = require('express');
const multer = require("multer");
const router = express.Router();
const StocksCSVController = require('../controllers/stockCSV.controller');
const upload = multer({ dest: "uploads/" }); // Temporary file storage


/**
 * @swagger
 * /api/upload-csv:
 *   post:
 *     summary: Upload a CSV file and store data in the database
 *     tags: [Stocks - CSV]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CSV uploaded successfully
 *       400:
 *         description: File not provided
 *       500:
 *         description: Server error
 */
router.post("/upload-csv", upload.single("file"), StocksCSVController.uploadCSV);

/**
 * @swagger
 * /api/getstocks:
 *   get:
 *     summary: Get all stock data
 *     tags: [Get - Stocks]
 *     responses:
 *       200:
 *         description: Successfully retrieved stock data
 *       500:
 *         description: Server error
 */
router.get("/getstocks", StocksCSVController.getStocks);


/**
 * @swagger
 * /api/deletestocks:
 *   delete:
 *     summary: Delete all stock data
 *     tags: [Stocks - CSV]
 *     responses:
 *       200:
 *         description: Successfully deleted all stock data
 *       400:
 *         description: Error deleting stock data
 *       500:
 *         description: Server error
 */
router.delete("/deletestocks", StocksCSVController.deleteAllStocks);


/**
 * @swagger
 * /api/addTrade:
 *   post:
 *     summary: Add a new trades
 *     tags: [Trades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stockName
 *               - buyDate
 *               - buyPrice
 *               - quantity
 *             properties:
 *               stockName:
 *                 type: string
 *                 example: "Infosys"
 *               buyDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-01"
 *               buyPrice:
 *                 type: number
 *                 example: 1500.25
 *               quantity:
 *                 oneOf:
 *                   - type: number
 *                   - type: array
 *                     items:
 *                       type: number
 *                 example: [10]
 *               stopLoss:
 *                 type: number
 *                 example: 1480
 *     responses:
 *       201:
 *         description: Trade added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/addTrade", StocksCSVController.addTrade);


/**
 * @swagger
 * /api/updateClosePosition:
 *   put:
 *     summary: Update a trade by closing a position (partial or full)
 *     tags: [Trades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tradeId
 *               - sellDate
 *               - sellPrice
 *               - quantity
 *             properties:
 *               tradeId:
 *                 type: string
 *                 description: The ID of the trade to be updated
 *                 example: "6652fe08c99d1b0ec820b3a6"
 *               sellDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-01"
 *               sellPrice:
 *                 type: number
 *                 example: 1500.25
 *               quantity:
 *                 oneOf:
 *                   - type: number
 *                   - type: array
 *                     items:
 *                       type: number
 *                 example: [10]
 *               stopLoss:
 *                 type: number
 *                 example: 1480
 *     responses:
 *       200:
 *         description: Trade updated and sold trade recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Trade updated and sold trade recorded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedTrade:
 *                       $ref: '#/components/schemas/Trade'
 *                     soldTrade:
 *                       type: object
 *                       properties:
 *                         stockName:
 *                           type: string
 *                           example: "INFY"
 *                         buyDate:
 *                           type: string
 *                           format: date
 *                           example: "2024-01-15"
 *                         buyPrice:
 *                           type: number
 *                           example: 1200
 *                         sellDate:
 *                           type: string
 *                           format: date
 *                           example: "2024-02-01"
 *                         sellPrice:
 *                           type: number
 *                           example: 1500.25
 *                         quantity:
 *                           type: array
 *                           items:
 *                             type: number
 *                           example: [10]
 *                         exitType:
 *                           type: string
 *                           example: "Partial Exit"
 *       400:
 *         description: Missing required fields or invalid quantity
 *       404:
 *         description: Trade not found
 *       500:
 *         description: Server error
 */
router.put("/updateClosePosition", StocksCSVController.updateClosePosition);


/**
 * @swagger
 * /api/pnlstatement:
 *   get:
 *     summary: Get all trades with calculated PnL data
 *     tags: [Trades]
 *     responses:
 *       200:
 *         description: Successfully retrieved PnL data
 *       500:
 *         description: Server error
 */
router.get("/pnlstatement", StocksCSVController.getPnlStatement);


/**
 * @swagger
 * /api/liveOpenPositions:
 *   get:
 *     summary: Get all active trades that are not yet closed (no sellDate)
 *     tags: [Trades]
 *     responses:
 *       200:
 *         description: Successfully retrieved PnL data
 *       500:
 *         description: Server error
 */
router.get("/liveOpenPositions", StocksCSVController.getLiveOpenPositions);


/**
 * @swagger
 * /api/trades:
 *   get:
 *     summary: Retrieve all trades with associated explainers
 *     tags: [Trades]
 *     responses:
 *       200:
 *         description: Successfully retrieved PnL data
 *       500:
 *         description: Server error
 */

router.get("/trades", StocksCSVController.getAllTrades);

module.exports = router;
