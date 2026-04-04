import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import Record from "./models/Record.js";


dotenv.config();

mongoose.connect("mongodb://127.0.0.1:27017/ipfsDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const app = express();

app.use(cors());
app.use(express.json());





// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// UPLOAD JSON TO PINATA
app.post("/upload", async (req, res) => {
  try {
    const data = req.body;

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    // ✅ SAVE TO MONGODB HERE
    const savedRecord = await Record.create({
      patientId: data.patientId,
      cid: response.data.IpfsHash,
      data: data
    });

    res.json({
      success: true,
      cid: response.data.IpfsHash,
      dbRecord: savedRecord
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

app.get("/records", async (req, res) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: records.length,
      data: records
    });

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      error: "Failed to fetch records"
    });
  }
});


app.get("/records/:id", async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    res.json({
      success: true,
      data: record
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching record"
    });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});