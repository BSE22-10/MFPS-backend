import express from "express";
import {
  getFloors,
  createFloor,
  deleteFloor,
  updateFloor,
  getSlotsForASpecificFloor,
  createFloorWithManySlots,
} from "../services/index.js";
import { body, query, validationResult } from "express-validator";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json(await getFloors());
    // res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.json({ error: error.message || error });
  }
});

router.post(
  "/",
  body("no_of_slots", "Provide a valid number").isNumeric(),
  body("name", "Provide a valid string").isString(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      await createFloor(req.body.no_of_slots, req.body.name);
      res.status(201).json({
        message: "Floor created",
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.put(
  "/update",
  body("no_of_slots", "Provide a valid number").isNumeric().optional(),
  body("name", "Provide a valid string").isString().optional(),
  query("id", "Provide a valid primary key").isNumeric(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.query.id;
      if (id === undefined) {
        return res.status(400).json({ error: "Please provide an id" });
      } else {
        // [no_of_slots] = req.body;
        res.json(await updateFloor(Number(id), req.body)).status(201);
      }
      // res.status(201).json({
      //   message: "Vehicle updated",
      // });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message || error });
    }
  }
);

router.get(
  "/singleFloor",
  query("floor_id", "Provide a valid number").isNumeric(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const floor_id = Number(req.query.floor_id);
      res.json(await getSlotsForASpecificFloor(floor_id));
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/multipleSlots",
  body("number_of_slots", "Invalid number").isNumeric(),
  body("name", "Invalid string").isString(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      res.json(
        await createFloorWithManySlots(
          Number(req.body.number_of_slots),
          req.body.name
        )
      );
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  }
);

router.delete(
  "/delete",
  query("floor_id", "Invalid number").isNumeric(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      console.log(req.query.floor_id);
      res.json(await deleteFloor(Number(req.query.floor_id)));
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  }
);

export default router;
