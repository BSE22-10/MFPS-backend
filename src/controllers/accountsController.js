import express from "express";
import { body, query, validationResult } from "express-validator";
import {
  checkBalance,
  checkPlate,
  createAccount,
  getEmail,
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

router.post(
  "/checkPlate",
  // body("number_plate", "Provide a valid string").isString(),
  async (req, res) => {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.status(400).json({ errors: errors.array() });
      // }
      console.log(req.body.number_plate);
      return res.json(await checkPlate(req.body.number_plate));
    } catch (error) {
      console.log(error);
      res.json({ error: error.message || error });
    }
  }
);

router.put(
  "/updatePayment",
  body("number_plate", "Provide a valid plate").isString(),
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
      res.json({ error: error.message || error });
    }
  }
);

router.post(
  "/getEmail",
  //   body("number_plate", "Provide a valid plate").isString(),
  async (req, res) => {
    try {
      //   const errors = validationResult(req);
      //   if (!errors.isEmpty()) {
      //     return res.status(400).json({ errors: errors.array() });
      //   }
      return res.json(await getEmail(req.body.number_plate));
    } catch (error) {
      console.log(error);
      res.json({ error: error.message || error });
    }
  }
);

router.post(
  "/checkAcccountBalance",
  body("number_plate", "Please provide a valid email").isString(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      return res.json(await checkBalance(req.body.number_plate));
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  }
);

export default router;
