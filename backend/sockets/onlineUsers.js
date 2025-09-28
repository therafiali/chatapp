// userId -> Set of socketIds
const onlineUsers = new Map();

function addUser(userId, socketId, userData) {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, { sockets: new Set(), ...userData });
  }
  onlineUsers.get(userId).sockets.add(socketId);
}

function removeUser(userId, socketId) {
  if (!onlineUsers.has(userId)) return;

  const userInfo = onlineUsers.get(userId);
  userInfo.sockets.delete(socketId);

  // if no sockets left, remove user completely
  if (userInfo.sockets.size === 0) {
    onlineUsers.delete(userId);
    return true; // fully offline
  }
  return false; // still has other sessions
}

module.exports = { onlineUsers, addUser, removeUser };
