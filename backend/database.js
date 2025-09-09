const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://therafiali:G7YrwaZ8Wc4003fm@cluster0.ruz4rnf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
};

module.exports = connectDB;
