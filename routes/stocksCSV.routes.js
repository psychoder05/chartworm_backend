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
