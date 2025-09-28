const { verifyAccessToken } = require("../utils/jwt");
const chatHandler = require("./chat.handler");
const { onlineUsers, addUser, removeUser } = require("./onlineUsers");

const initSocket = (server) => {
  const { Server } = require("socket.io");

  // create instance
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  });

  // Socket Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = verifyAccessToken(token);
      socket.user = decoded; // attach decoded user
      socket.join(socket.user.userId);
      next();
    } catch (error) {
      return next(new Error("Invalid Token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    console.log("[CONNECTION] User connected:", user);

    // ✅ Add user to online map
    addUser(user.userId, socket.id, { name: user.name, email: user.email });

    // ✅ Send full online users list to the new user
    const allOnlineUsers = Array.from(onlineUsers.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      email: data.email,
    }));
    socket.emit("online-users", allOnlineUsers);

    // ✅ Notify others about the new user
    socket.broadcast.emit("user-connected", {
      id: user.userId,
      name: user.name,
      email: user.email,
    });

    // ✅ Handle direct messages
    chatHandler(io, socket);

    // ✅ On disconnect
    socket.on("disconnect", () => {
      const fullyOffline = removeUser(user.userId, socket.id);
      if (fullyOffline) {
        io.emit("user-disconnected", user.userId);
        console.log("[DISCONNECT] User fully offline:", user.userId);
      }
    });
  });

  return io;
};

module.exports = { initSocket };
