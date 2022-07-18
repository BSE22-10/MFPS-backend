import express from "express";
import {
  getVehicles,
  createVehicle,
  deleteVehicle,
  updateExitingVehicle,
} from "../services/index.js";
import { body, validationResult } from "express-validator";

const router = express.Router();
const validator = {};
router.get("/", async (req, res) => {
  try {
    res.json(await getVehicles());
    // res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.json({ error: e.message || err });
  }
});

router.post(
  "/",
  body("number_plate").isString(),
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
      createVehicle(req.body);
      res.status(201).json({
        message: "Vehicle created",
      });
    } catch (error) {
      console.log(error);
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

export default router;
// module.exports = router;
