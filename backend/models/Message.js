const { default: mongoose } = require("mongoose");

const MessageSchema = new mongoose.Schema({
  room: String,
  text: String,
  sender: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
