const mongoose = require("mongoose");

const  donorSchema = new mongoose.Schema( 
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        bloodGroup: {
            type: String,
            required: true
        },
                phone: {
            type: String,
            trim: true,
            default: ""
        }

        location: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Donor", donorSchema);
