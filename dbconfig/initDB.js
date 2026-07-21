import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let dbUrl;
    if (process.env.NODE_ENV === "dev") dbUrl = process.env.DB_DEV_URL;
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Successfully connected to DB");
    });

    connection.on("error", (error) => {
      console.log("error", error);
    });

    connection.on("disconnected", () => {
      console.log("Disconnected");
    });

    await mongoose.connect(dbUrl);
  } catch (error) {
    console.error("Failed to connect to database", error);
  }
};

export default connectDB;
