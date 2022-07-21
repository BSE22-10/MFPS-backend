import express from "express";
import {} from "../services/index.js";
import { body, query, validationResult } from "express-validator";
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    res.json(await getVehicles());
    // res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.json({ error: e.message || err });
  }
});
