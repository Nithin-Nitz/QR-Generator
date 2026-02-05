const mongoose = require("mongoose");

const qrSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        content: {
            type: String,
            required: [true, "Please add some content"],
        },
        image: {
            type: String,
            required: [true, "Please add an image string"],
        },
        logo: {
            type: String, // Store logo as base64 if present
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("QRCode", qrSchema);
