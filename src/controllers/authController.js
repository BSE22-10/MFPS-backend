import express from "express";
import { login, signup } from "../services/index.js";
import { body, query, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/signup",
  body("email", "Provide a valid email").isEmail(),
  body("password", "Provide a valid string").isString(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      console.log(req.body);
      res.json(await signup(req.body.email, req.body.password));
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  }
);

router.post(
  "/login",
  body("email", "Provide a valid email").isEmail(),
  body("password", "Provide a valid string").isString(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      res.json(await login(req.body.email, req.body.password));
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  }
);

export default router;
