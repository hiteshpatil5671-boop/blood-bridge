const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
    {
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donor",
            required: true
        },

        donationDate: {
            type: Date,
            required: true
        },

        bloodGroup: {
            type: String,
            required: true
        },
        status: {
    type: String,
    enum: ["Pending", "Confirmed", "Rejected"],
    default: "Pending"
}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Donation", donationSchema);
