import express from "express";
import {
  getSlots,
  createSlot,
  deleteSlot,
  updateSlotStatus,
  numberOfCarsOnEachFloor,
  timelyData,
  getWeeklyData,
  getMonthlyData,
  createMultipleSlots,
  getSlotsPerFloor,
} from "../services/index.js";
import { body, query, validationResult } from "express-validator";

const router = express.Router();

//End point for getting all slots
router.get("/", async (req, res) => {
  try {
    res.json(await getSlots());
  } catch (e) {
    console.log(e);
    res.json({ error: e.message || err });
  }
});

//End point for creating a slot
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

//Creating multiple slots
router.post(
  "/mutlipleSlots",
  query("id", "Invalid id").isNumeric(),
  body("no_of_slots", "Invalid number").isNumeric(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      res.json(
        await createMultipleSlots(
          Number(req.query.id),
          Number(req.body.number_of_slots)
        )
      );
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  }
);

//End point for updating exiting vehicle
router.put("/update", body("number_plate").isString(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.json(await updateExitingVehicle(req.body.number_plate));
    // res.status(201).json({
    //   message: "Vehicle updated",
    // });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message || error });
  }
});

//Updating slot status
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
      const status = req.query.status === "true";
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

//Getting the number of cars on each floor
router.get("/parkingSlots", async (req, res) => {
  try {
    res.json(await numberOfCarsOnEachFloor());
  } catch (e) {
    console.log(e);
    res.json({ error: e.message || err });
  }
});

//End point for getting timely data
router.get("/timelyData", query("duration").isString(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    var filter = req.query.duration;
    if (filter === "daily") {
      res.json(await timelyData());
    } else if (filter === "weekly") {
      res.json(await getWeeklyData());
    } else if (filter === "monthly") {
      res.json(await getMonthlyData());
    } else if (filter === "floor") {
      res.json(await getSlotsPerFloor());
    }
  } catch (e) {
    console.log(e);
    res.json({ error: e.message || err });
  }
});

export default router;
