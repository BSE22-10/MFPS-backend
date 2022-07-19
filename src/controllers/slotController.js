import express from "express";
import {
  getSlots,
  createSlot,
  deleteSlot,
  updateSlotStatus,
} from "../services/index.js";
import { body, query, validationResult } from "express-validator";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json(await getSlots());
  } catch (e) {
    console.log(e);
    res.json({ error: e.message || err });
  }
});

router.post(
  "/",
  query("id", "Invalid id").isNumeric(),
  //   body("arrival_time", "Invalid time").matches(
  //     "(d{4})-(d{2})-(d{2}) (d{2}):(d{2}):(d{2})"
  //   "\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?"
  //   ),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      res.json(await createSlot(Number(req.query.id)));
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  }
);

router.put("/update", body("number_plate").isString(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body.number_plate);
    res.json(await updateExitingVehicle(req.body.number_plate));
    // res.status(201).json({
    //   message: "Vehicle updated",
    // });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message || error });
  }
});

router.put(
  "/updateStatus",
  query("id").isNumeric(),
  query("status").isBoolean(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = Number(req.query.id);
      const status = req.query.status === true;
      res.json(await updateSlotStatus(id, status));
      // res.status(201).json({
      //   message: "Vehicle updated",
      // });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message || error });
    }
  }
);

export default router;
