import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.DATABASE_URL) {
    return console.log("DATABASE_URL must be defined");
  }
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME,
    });
    isConnected = true;
    console.log("MongoDB connection is Made!");
  } catch (error) {
    console.log("=> error while connecting to database:", error);
  }
};