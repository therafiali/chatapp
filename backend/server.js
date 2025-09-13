const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./database");
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const port = 3001;

// connect to MongoDB
connectDB();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

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
