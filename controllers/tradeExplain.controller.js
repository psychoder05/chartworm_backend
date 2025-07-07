const TradesExplain = require('../models/tradeExplain.model');
const mongoose = require('mongoose');

// Add
const addExplainer = async (req, res) => {
    try {
        const { title, content, tradeId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(tradeId)) {
            return res.status(400).json({ success: false, message: 'Invalid tradeId.' });
        }

        // Collect image URLs from uploaded files
        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            uploadedImages = req.files.map(file =>
                `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            );
        }

        // Collect image URLs from body if present (for live/remote images)
        const bodyImages = Array.isArray(req.body.images) ? req.body.images : req.body.images ? [req.body.images] : [];

        const allImages = [...uploadedImages, ...bodyImages];

        const newTradeExplain = await TradesExplain.create({
            tradeId,
            title,
            content,
            images: allImages,
        });

        res.status(201).json({ success: true, message: 'Trade explanation added.', data: newTradeExplain });
    } catch (err) {
        console.error("Add Explainer Error:", err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Edit
const editExplainer = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tradeId } = req.body;

        if (tradeId && !mongoose.Types.ObjectId.isValid(tradeId)) {
            return res.status(400).json({ success: false, message: 'Invalid tradeId.' });
        }

        // Collect image URLs from uploaded files
        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            uploadedImages = req.files.map(file =>
                `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            );
        }

        // Collect image URLs from body
        const bodyImages = Array.isArray(req.body.images) ? req.body.images : req.body.images ? [req.body.images] : [];

        const allImages = [...uploadedImages, ...bodyImages];

        const updatedTradeExplain = await TradesExplain.findByIdAndUpdate(
            id,
            {
                tradeId,
                title,
                content,
                images: allImages,
            },
            { new: true }
        );

        if (!updatedTradeExplain) {
            return res.status(404).json({ success: false, message: 'Trade explanation not found.' });
        }

        res.json({ success: true, message: 'Trade explanation updated.', data: updatedTradeExplain });
    } catch (err) {
        console.error("Edit Explainer Error:", err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get All
const getAllExplainer = async (req, res) => {
    try {
        const allExplainers = await TradesExplain.find()
            .populate('tradeId', 'stockName buyDate sellDate buyPrice sellPrice')
            .sort({ created_at: -1 });
        res.json({ success: true, data: allExplainers });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete
const deleteExplainer = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await TradesExplain.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Trade explanation not found.' });
        }

        res.json({ success: true, message: 'Trade explanation deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    addExplainer,
    editExplainer,
    getAllExplainer,
    deleteExplainer
};
