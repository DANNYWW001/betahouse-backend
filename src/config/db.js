const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.DATABASE_URL;

    if (!uri) {
      console.error(
        "MongoDB error: MONGO_URI (or DATABASE_URL) is not defined in environment variables."
      );
      return;
    }

    await mongoose.connect(uri, {
    });

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
