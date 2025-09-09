const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const port = 3001;

// mongodb+srv://therafiali:G7YrwaZ8Wc4003fm@cluster0.ruz4rnf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

mongoose.connect(
  "mongodb+srv://therafiali:G7YrwaZ8Wc4003fm@cluster0.ruz4rnf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const MessageSchema = new mongoose.Schema({
  room: String,
  text: String,
  sender: String,
  created_at: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model("Message", MessageSchema);

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("send-msg", (data) => {
    console.log("📩 Message received:", data);

    io.emit("recieve-msg", data);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
