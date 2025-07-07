const express = require('express');
const router = express.Router();
const TradesExplainController = require('../controllers/tradeExplain.controller');
const upload = require('../middleware/fileUpload'); 


/**
 * @swagger
 * /api/addExplainer:
 *   post:
 *     summary: Add a new trade explanation
 *     tags: [Trades Explain]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Breakout Strategy
 *               content:
 *                 type: string
 *                 example: A breakout occurs when the price moves outside a defined support or resistance zone.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Successfully added all trade explain
 *       400:
 *         description: Error adding trade explain
 *       500:
 *         description: Server error
 */

router.post('/addExplainer', upload.array('images', 5), TradesExplainController.addExplainer);




/**
 * @swagger
 * /api/addExplainer:
 *   post:
 *     summary: Add a new trade explanation
 *     tags: [Trades Explain]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tradeId:
 *                 type: string
 *                 example: 6819ecef16b6055d4d94c0d4
 *               title:
 *                 type: string
 *                 example: Breakout Strategy
 *               content:
 *                 type: string
 *                 example: A breakout occurs when the price moves outside a defined support or resistance zone.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Successfully added trade explanation.
 *       400:
 *         description: Error adding trade explanation.
 *       500:
 *         description: Server error.
 */
router.put('/editExplainer/:id',  upload.array('images', 5), TradesExplainController.editExplainer);

/**
 * @swagger
 * /api/getAllExplainer:
 *   get:
 *     summary: Get all trade explanations
 *     tags: [Trades Explain]
 *     responses:
 *       200:
 *         description: List of trade explanations
 *       500:
 *         description: Server error
 */

router.get('/getAllExplainer', TradesExplainController.getAllExplainer);

/**
 * @swagger
 * /api/deleteExplainer/{id}:
 *   delete:
 *     summary: Delete a trade explanation by ID
 *     tags: [Trades Explain]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the trade explanation
 *     responses:
 *       200:
 *         description: Trade explanation deleted successfully
 *       404:
 *         description: Trade explanation not found
 *       500:
 *         description: Server error
 */

router.delete('/deleteExplainer/:id', TradesExplainController.deleteExplainer);

module.exports = router;
