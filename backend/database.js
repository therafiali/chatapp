const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://rafi:VsqxdM03uxFzFmAa@cluster0.sz7ghjd.mongodb.net/abc?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
