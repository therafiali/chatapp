import { getSocket } from "@/lib/socket";
import { useEffect, useState } from "react";

interface Message {
  from: string;
  to: string;
  message: string;
  timestamp: string;
}

export const useChat = (selectedUserId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    const handlePrivateMessage = (msg: Message) => {
      // Show only if this chat is open
      if (msg.from === selectedUserId || msg.to === selectedUserId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("private-message", handlePrivateMessage);

    return () => {
      socket.off("private-message", handlePrivateMessage);
    };
  }, [selectedUserId]);

  const sendMessage = (text: string) => {
    if (!selectedUserId || !text.trim()) return;
    socket?.emit("private-message", {
      toUserId: selectedUserId,
      message: text,
    });
  };

  return { messages, sendMessage };
};
