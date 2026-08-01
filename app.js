import express from "express";
import connectDB from "./dbconfig/initDB.js";
import routes from "./routes/index.js";
import { configDotenv } from "dotenv";
import cors from "cors";

configDotenv();

await connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

routes(app);

export default app;