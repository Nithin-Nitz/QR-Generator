const express = require("express");
const router = express.Router();
const { getQRs, createQR, deleteQR } = require("../controllers/qrController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getQRs).post(protect, createQR);
router.route("/:id").delete(protect, deleteQR);

module.exports = router;
