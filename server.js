require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
const Donor = require("./models/Donor");
const Request = require("./models/Request");
const ContactMessage = require("./models/ContactMessage");
const Camp = require("./models/Camp");
const GOOGLE_CLIENT_ID = "1005423740477-au01tr2uijj31fths31vi1l6f4hjq92l.apps.googleusercontent.com";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(
                `BloodBridge server running at http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });


// ===============================
// Backend Status
// ===============================

app.get("/", (req, res) => {
    res.send("BloodBridge Backend is Running!");
});
app.get("/test-camps", (req, res) => {
    res.send("Camps route is working!");
});
// ===============================
// Google Donor Login
// ===============================

app.post("/api/auth/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required"
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        const donor = await Donor.findOne({ email });

        if (!donor) {
            return res.status(404).json({
                message: "Donor account not found. Please register first."
            });
        }

        res.json({
            message: "Google login successful",
            donor: {
                id: donor._id,
                name: donor.name,
                email: donor.email,
                bloodGroup: donor.bloodGroup,
                location: donor.location
            }
        });

    } catch (error) {
        console.error("Google login failed:", error.message);

        res.status(401).json({
            message: "Google authentication failed"
        });
    }
});
// ===============================
// Donor APIs
// ===============================

// Get all donors
app.get("/api/donors", async (req, res) => {
    try {
        const donors = await Donor.find();
        res.json(donors);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch donors",
            error: error.message
        });
    }
});

// Register donor
app.post("/api/donors", async (req, res) => {
    try {
        const donor = new Donor(req.body);
        const savedDonor = await donor.save();

        res.status(201).json({
            message: "Donor registered successfully!",
            donor: savedDonor
        });
    } catch (error) {
        res.status(400).json({
            message: "Donor registration failed",
            error: error.message
        });
    }
});


// ===============================
// Blood Request API
// ===============================

app.post("/api/requests", async (req, res) => {
    try {
        const request = new Request(req.body);
        const savedRequest = await request.save();

        res.status(201).json({
            message: "Blood request submitted successfully!",
            request: savedRequest
        });
    } catch (error) {
        res.status(400).json({
            message: "Blood request failed",
            error: error.message
        });
    }
});


// ===============================
// Contact API
// ===============================

app.post("/api/contact", async (req, res) => {
    try {
        const message = new ContactMessage(req.body);
        const savedMessage = await message.save();

        res.status(201).json({
            message: "Message submitted successfully!",
            contactMessage: savedMessage
        });
    } catch (error) {
        res.status(400).json({
            message: "Message submission failed",
            error: error.message
        });
    }
});


// ===============================
// Blood Camps APIs
// ===============================

// Get all blood camps
console.log("REGISTERED ROUTES: /api/camps");
console.log("CAMP ROUTE LOADED");
app.get("/api/camps", async (req, res) => {
    try {
        const camps = await Camp.find();
        res.json(camps);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch camps",
            error: error.message
        });
    }
});

// Add a blood camp
app.post("/api/camps", async (req, res) => {
    try {
        const camp = new Camp(req.body);
        const savedCamp = await camp.save();

        res.status(201).json({
            message: "Blood camp added successfully!",
            camp: savedCamp
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to add blood camp",
            error: error.message
        });
    }
});
