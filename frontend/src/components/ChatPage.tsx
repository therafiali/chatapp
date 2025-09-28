"use client";

import { useUsers } from "@/hooks/useUsers";
import ChatWindow from "@/components/ChatWindow";
import { useState } from "react";

export default function ChatPage() {
  const { users } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar (Users List) */}
      <div className="w-64 border-r p-4">
        <h2 className="font-bold mb-4">Online Users</h2>
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-2 cursor-pointer rounded ${
              selectedUserId === user.id ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedUserId(user.id)}
          >
            {user.name} ({user.email})
          </div>
        ))}
      </div>

      {/* Right Panel (Chat Window) */}
      <div className="flex-1 p-4">
        {selectedUserId ? (
          <ChatWindow userId={selectedUserId} />
        ) : (
          <p className="text-gray-500">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}
