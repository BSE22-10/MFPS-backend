import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import routes from "./src/controllers/vehicleController.js";
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

app.get("/", (req, res) => {
  res.send("Multifloor parking system");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
