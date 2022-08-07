import express from "express";
import { body, query, validationResult } from "express-validator";
import { createAccount } from "../services/index.js";

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
      return await createAccount(req.body);
      //   res.status(201).json({
      //     message: "Floor created",
      //   });
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
