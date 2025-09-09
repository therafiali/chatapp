module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ socket connected:", socket.id);

    socket.on("send-msg", (data) => {
      console.log("📩 Message received:", data);
      io.emit("recieve-msg", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ socket disconnected:", socket.id);
    });
  });
};
