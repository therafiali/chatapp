"use client";

import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("recieve-msg", (data) => {
      console.log("data", data);
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  const sendMsg = (msg: string) => {
    console.log("click");
    socket.emit("send-msg", msg);
    setInput('')
    return msg;
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={input || ""}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder="Enter .............."
        />
      </div>

      <button onClick={() => sendMsg(input)}>Send</button>

      <div className="mt-10">
        <h3>Messages:</h3>
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
