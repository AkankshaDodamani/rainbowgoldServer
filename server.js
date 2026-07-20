import express from "express";
import connectDB from "./dbconfig/initDB.js";
import routes from "./routes/index.js";
import { configDotenv } from "dotenv";

let PORT = 5000;
configDotenv();

await connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.get('/', (req, res) => {
  res.send('Chocolate shop API is running...');
});

app.listen(PORT, () => {
  console.log(`RainbowGoldServer running on port ${PORT}`);
});