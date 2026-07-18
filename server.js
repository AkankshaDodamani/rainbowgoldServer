import e from "express";
import connectDB from "./dbconfig/initDB.js";
import { configDotenv } from "dotenv";

let PORT = 5000;
configDotenv();

await connectDB();

const app = e();

app.get('/', (req, res) => {
  res.send('Chocolate shop API is running...');
});

app.listen(PORT, () => {
  console.log(`RainbowGoldServer running on port ${PORT}`);
});