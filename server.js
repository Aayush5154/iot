
require("dotenv").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

const CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID;
const READ_API_KEY = process.env.THINGSPEAK_READ_API_KEY;

// Get parcel statistics from ThingSpeak
app.get("/api/stats", async (req, res) => {
  try {
    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Unable to fetch ThingSpeak data"
      });
    }

    const data = await response.json();

    const correct = Number(data.field1) || 0;
    const wrong = Number(data.field2) || 0;
    const unconfirmed = Number(data.field3) || 0;

    const total = correct + wrong + unconfirmed;

    res.json({
      success: true,
      totalParcels: total,
      parcels: {
        correct,
        wrong,
        unconfirmed
      },
      lastUpdated: data.created_at
    });

  } catch (error) {
    console.error("API Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Parcel Dashboard API running on port ${PORT}`);
});
