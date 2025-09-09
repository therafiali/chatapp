const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./database");

const port = 3001;

// connect to MongoDB
connectDB();

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

require("./sockets/chat")(io);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
