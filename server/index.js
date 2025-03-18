import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config.js";
import ChartConfig from "./models/ChartConfig.js";

const app = express();
const PORT = config.PORT || 3000;

mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const allowedOrigins = [
  "https://jacob-trafa.vercel.app",
  "http://localhost:5173",
  "http://localhost:5000",
];

app.use(
  cors({
    origin: allowedOrigins, 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.post("/api/configs", async (req, res) => {
  try {
    console.log("Received POST request:", req.body);
    const newConfig = new ChartConfig({ config: req.body });
    const savedConfig = await newConfig.save();
    console.log("Saved config:", savedConfig);
    res.json({ id: savedConfig._id });
  } catch (err) {
    console.error("Error saving config:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/configs/:id", async (req, res) => {
  try {
    console.log("Received GET request for config ID:", req.params.id);
    const config = await ChartConfig.findById(req.params.id);
    if (!config) {
      console.log("Config not found for ID:", req.params.id);
      return res.status(404).json({ message: "Config not found" });
    }
    console.log("Retrieved config:", config);
    res.json(config.config);
  } catch (err) {
    console.error("Error retrieving config:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});