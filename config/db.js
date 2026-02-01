const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/karima";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully");
    return { inMemory: false };
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.warn("Falling back to in-memory MongoDB for development.");

    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log("Connected to in-memory MongoDB");
    return { inMemory: true, mongod };
  }
}

module.exports = connectDB;
