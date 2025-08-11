require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { WatchListModel } = require("./model/WatchListModel");
const authRoute = require("./Routes/AuthRoute");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Auth routes
app.use("/auth", authRoute);

app.get("/allHoldings", async (req, res) => {
  try {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    console.error("Error fetching holdings:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch positions" });
  }
});

app.get("/allWatchlist", async (req, res) => {
  try {
    let allWatchlist = await WatchListModel.find({});
    res.json(allWatchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch watchlist" });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    // Validation
    const { name, qty, price, mode } = req.body;

    if (!name || !qty || !price || !mode) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, qty, price, mode) are required",
      });
    }

    if (qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    if (!["BUY", "SELL"].includes(mode.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Mode must be either BUY or SELL",
      });
    }

    let newOrder = new OrdersModel({
      name: name.trim(),
      qty: Number(qty),
      price: Number(price),
      mode: mode.toUpperCase(),
    });

    await newOrder.save();
    res.json({ success: true, message: "Order saved!", order: newOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ success: false, message: "Failed to save order" });
  }
});

app.listen(PORT, () => {
  console.log("App started!");
  mongoose
    .connect(uri)
    .then(() => console.log("DB connected!"))
    .catch((err) => console.error("DB connection error:", err));
});
