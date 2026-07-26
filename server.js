import express from "express";
import connectDB from "./dbconfig/initDB.js";
import routes from "./routes/index.js";
import { configDotenv } from "dotenv";
import cors from "cors";

let PORT = 5000;
configDotenv();

await connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

routes(app);

app.get('/', (req, res) => {
  res.send('Chocolate shop API is running...');
});

app.listen(PORT, () => {
  console.log(`RainbowGoldServer running on port ${PORT}`);
});