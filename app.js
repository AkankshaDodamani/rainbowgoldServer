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

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rainbow Gold Backend is running",
  });
});

routes(app);

export default app;