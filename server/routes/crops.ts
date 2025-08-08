import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

export const handleCrops: RequestHandler = (req, res) => {
  try {
    const cropsPath = path.join(__dirname, "../data/crops.json");
    const cropsData = fs.readFileSync(cropsPath, "utf8");
    const crops = JSON.parse(cropsData);
    res.json(crops);
  } catch (error) {
    console.error("Error reading crops data:", error);
    res.status(500).json({ error: "Failed to load crops data" });
  }
};
