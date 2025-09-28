"use client";

import { useChat } from "@/hooks/useChat";
import { useState } from "react";

export default function ChatWindow({ userId }: { userId: string }) {
  const { messages, sendMessage } = useChat(userId);
  const [input, setInput] = useState("");

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="p-4 border rounded w-80">
      <div className="h-64 overflow-y-auto border-b mb-2">
        {messages.map((m, i) => (
          <div key={i} className={m.from === userId ? "text-left" : "text-right"}>
            <span className="block text-sm bg-gray-200 p-1 rounded my-1">
              {m.message}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-2 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
