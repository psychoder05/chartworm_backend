const express = require('express');
const multer = require("multer");
const router = express.Router();
const StocksCSVController = require('../controllers/stockCSV.controller');
const upload = multer({ dest: "uploads/" }); // Temporary file storage

/**
 * @swagger
 * /api/stock:
 *   post:
 *     summary: Add a new trade
 *     tags: [Stocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - buyDate
 *               - buyPrice
 *               - quantity
 *             properties:
 *               symbol:
 *                 type: string
 *                 example: "INFY"
 *               nameOfCompany:
 *                 type: string
 *                 example: "Infosys Ltd"
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
 *               sellDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-20"
 *               sellPrice:
 *                 type: number
 *                 example: 1555.50
 *               quantity:
 *                 type: number
 *                 example: 10
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
router.post("/stock", StocksCSVController.addTrade);



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
 *     tags: [Stocks - CSV]
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


module.exports = router;
