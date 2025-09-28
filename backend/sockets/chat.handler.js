// chat.handler.js
const { onlineUsers } = require("./onlineUsers");

const chatHandler = (io, socket) => {
  socket.on("private-message", ({ toUserId, message }) => {
    const fromUserId = socket.user.userId;

    const msg = {
      from: fromUserId,
      to: toUserId,
      message,
      timestamp: new Date(),
    };

    // ✅ Send to all devices of the receiver
    const toUser = onlineUsers.get(toUserId);
    if (toUser?.sockets?.size > 0) {
      for (const socketId of toUser.sockets) {
        io.to(socketId).emit("private-message", msg);
      }
    } else {
      // Receiver is offline → optional handling
      socket.emit("user-offline", { toUserId });
    }

    // ✅ Send back to all sender devices
    const fromUser = onlineUsers.get(fromUserId);
    if (fromUser?.sockets?.size > 0) {
      for (const socketId of fromUser.sockets) {
        io.to(socketId).emit("private-message", msg);
      }
    }

    console.log("Private message sent:", msg);
  });
};

module.exports = chatHandler;
