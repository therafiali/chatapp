import { getSocket } from "@/lib/socket";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    console.log("[HOOK] Connecting socket...");
    socket.connect();

    socket.on("connect", () => {
      console.log("[SOCKET] Connected:", socket.id);
    });

    socket.on("online-users", (onlineUsers: any) => {
      console.log("[SOCKET] Received online-users:", onlineUsers);
      setUsers(onlineUsers);
    });

    socket.on("user-connected", (newUser: any) => {
      console.log("[SOCKET] user-connected:", newUser);
      setUsers((prev) => {
        if (prev.find((u) => u.id === newUser.id)) return prev;
        return [...prev, newUser];
      });
    });

    socket.on("user-disconnected", (userId: string) => {
      console.log("[SOCKET] user-disconnected:", userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    });

    socket.on("disconnect", () => {
      console.log("[SOCKET] Disconnected from server");
    });

    return () => {
      socket.off("online-users");
      socket.off("user-connected");
      socket.off("user-disconnected");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return { users };
};
