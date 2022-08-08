import express from "express";
import { body, query, validationResult } from "express-validator";
import {
  checkPlate,
  createAccount,
  updateAccountPayment,
} from "../services/index.js";

const router = express.Router();

router.post(
  "/",
  body("email", "Provide a valid email").isEmail(),
  body("number_plate", "Please provide a valid email").isString(),
  body("amount", "Please provide a figure").isNumeric(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      return res.json(await createAccount(req.body));
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/checkPlate", async (req, res) => {
  try {
    console.log(req.body);
    //   const errors = validationResult(req);
    //   if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    //   }
    return res.json(await checkPlate(req.body.number_plate));
  } catch (error) {
    console.log(error);
  }
});

router.put(
  "/updatePayment",
  body("email", "Provide a valid email").isEmail(),
  body("amount", "Please provide a valid amount").isNumeric(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      return res.json(await updateAccountPayment(req.body));
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
