import express from "express";
import {
  getFloors,
  createFloor,
  deleteFloor,
  updateFloor,
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
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      console.log(req.body.no_of_slots);
      await createFloor(req.body.no_of_slots);
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
  body("no_of_slots", "Provide a valid number").isNumeric(),
  query("id", "Provide a valid primary key").isNumeric(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.query.id;
      console.log(id);
      if (id === undefined) {
        return res.status(400).json({ error: "Please provide an id" });
      } else {
        // [no_of_slots] = req.body;
        res
          .json(await updateFloor(Number(id), Number(req.body.no_of_slots)))
          .status(201);
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

export default router;
