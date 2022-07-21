import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import routes from "./src/controllers/vehicleController.js";
import floorRoutes from "./src/controllers/floorController.js";
import slotRoutes from "./src/controllers/slotController.js";
import transactionRoutes from "./src/controllers/transactionsController.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

const port = process.env.PORT;

app.use("/vehicle", routes);
app.use("/floors", floorRoutes);
app.use("/slots", slotRoutes);
app.use("/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Multifloor parking system");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
