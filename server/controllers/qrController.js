const asyncHandler = require("express-async-handler");
const QRCode = require("../models/QRCode");

// @desc    Get QRs
// @route   GET /api/qr
// @access  Private
const getQRs = asyncHandler(async (req, res) => {
    const qrs = await QRCode.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(qrs);
});

// @desc    Create QR
// @route   POST /api/qr
// @access  Private
const createQR = asyncHandler(async (req, res) => {
    if (!req.body.content || !req.body.image) {
        res.status(400);
        throw new Error("Please add content and image fields");
    }

    const qr = await QRCode.create({
        user: req.user.id,
        content: req.body.content,
        image: req.body.image,
        logo: req.body.logo
    });

    res.status(200).json(qr);
});

// @desc    Delete QR
// @route   DELETE /api/qr/:id
// @access  Private
const deleteQR = asyncHandler(async (req, res) => {
    const qr = await QRCode.findById(req.params.id);

    if (!qr) {
        res.status(404);
        throw new Error("QR Code not found");
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error("User not found");
    }

    // Make sure the logged in user matches the qr user
    if (qr.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    await qr.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getQRs,
    createQR,
    deleteQR,
};
