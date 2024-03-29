import express from "express";
import {
  getVehicles,
  createVehicle,
  deleteVehicle,
  updateExitingVehicle,
  checkPaymentStatus,
  makePayment,
  timelyData,
  checkIfVehicleCreated,
} from "../services/index.js";
import { body, query, validationResult } from "express-validator";

const router = express.Router();
const validator = {};

//End point for getting all vehicles
router.get("/", async (req, res) => {
  try {
    res.json(await getVehicles());
    // res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.json({ error: e.message || err });
  }
});

//End point for creating a vehicle
router.post(
  "/",
  body("number_plate", "Invalid number").isString(),
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
      await createVehicle(req.body);
      res.status(201).json({
        message: "Vehicle created",
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//Main controller for exiting vehicles
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

router.get(
  "/checkPayment",
  query("number_plate", "Invalid number").isString(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      res.json(await checkPaymentStatus(req.query.number_plate));
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message || error });
    }
  }
);

//End point for registering payment for a vehicle
router.post(
  "/makePayment",
  body("number_plate", "Invalid number").isString(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      var number_plate = req.body.number_plate;
      res.status(201).json(await makePayment(number_plate));
    } catch (error) {
      console.log(error);
    }
  }
);

//End point for checking the status of a slot
router.get("/checkStatus", async (req, res) => {
  try {
    res.json(await checkIfVehicleCreated());
    // res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.json({ error: e.message || err });
  }
});

export default router;
// module.exports = router;
